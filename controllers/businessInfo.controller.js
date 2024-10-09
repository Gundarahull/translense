const generateOTP = require("../functions/generateOTP.fumction");
const BusinessInfo = require("../models/businessInfo.model");
const uploadOnCloudinary = require("../utils/cloudinary");
const sendEmail = require("../utils/mail.util");

const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const client = require("twilio")(accountSID, authToken);

const createBusinessInfo = async (req, res) => {
  try {
    //destructing
    const {
      businessName,
      businessCountry,
      businessState,
      businessCity,
      businessAddress,
      openingTime,
      closingTime,
      businessEmail,
      businessMobilenumber,
    } = req.body;
    // Validate that all required fields are provided
    if (
      !businessName ||
      !businessCountry ||
      !businessState ||
      !businessCity ||
      !businessAddress ||
      !openingTime ||
      !closingTime ||
      !businessEmail ||
      !businessMobilenumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: businessName, businessCountry, businessState, businessCity, businessAddress, openingTime, closingTime, businessEmail, businessMobilenumber",
        data: "",
      });
    }

    //Check Mobile and email exists or not
    const emailMobileCheck = await BusinessInfo.findOne({
      $or: [
        { businessMobilenumber: businessMobilenumber },
        { businessEmail: businessEmail },
      ],
    });
    if (emailMobileCheck) {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile Number already exists",
        data: "",
      });
    }
    const business = await BusinessInfo.create({
      businessName,
      businessCountry,
      businessState,
      businessCity,
      businessAddress,
      openingTime,
      closingTime,
      businessEmail,
      businessMobilenumber,
    });
    res.status(200).json({
      success: true,
      message: "Business Info created successfully",
      data: business,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong at Creation of Business",
    });
  }
};


//Normally we can add restauranTimage to specify whos image i am using "businessINFOID"
const uploadRestaurantImage = async (req, res) => {
  try {
    console.log("params>>>>", req.params);

    const { businessInfoId } = req.params;
    if (!businessInfoId) {
      return res.status(400).json({
        success: false,
        message: "Business Info ID is required",
        data: "",
      });
    }
    const path = req.file.path;
    const imageUrl = await uploadOnCloudinary(path);
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image didn't proccessed, Something went Wrong",
        data: "",
      });
    }
    console.log("Response from clodinary", imageUrl.url);
    const uploadImage = await BusinessInfo.findOneAndUpdate(
      { _id: businessInfoId },
      {
        $set: { restaurantImage: imageUrl.url },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Restaurant Image uploaded successfully",
      data: uploadImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error:
        error.message || "Something went wrong at Uploading  Restaurnat Image",
    });
  }
};

const updateBusinessInfo = async (req, res) => {
  try {
    const { businessInfoId } = req.params;

    // Destructure updated fields from the request body
    const {
      businessName,
      businessCountry,
      businessState,
      businessCity,
      businessAddress,
      openingTime,
      closingTime,
      businessEmail,
      businessMobilenumber,
    } = req.body;

    // Validate that at least one field is provided for update
    if (
      !businessName &&
      !businessCountry &&
      !businessState &&
      !businessCity &&
      !businessAddress &&
      !openingTime &&
      !closingTime &&
      !businessEmail &&
      !businessMobilenumber
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
        data: "",
      });
    }

    if (businessEmail || businessMobilenumber) {
      const emailMobileCheck = await BusinessInfo.findOne({
        $or: [
          { businessMobilenumber: businessMobilenumber },
          { businessEmail: businessEmail },
        ],
        _id: { $ne: businessInfoId }, // Ensure we exclude the current record
      });

      if (emailMobileCheck) {
        return res.status(400).json({
          success: false,
          message: "Email or Mobile Number already exists",
          data: "",
        });
      }
    }

    // Update business info
    const updatedBusiness = await BusinessInfo.findByIdAndUpdate(
      businessInfoId,
      {
        $set: {
          businessName,
          businessCountry,
          businessState,
          businessCity,
          businessAddress,
          openingTime,
          closingTime,
          businessEmail,
          businessMobilenumber,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business Info not found",
        data: "",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business Info updated successfully",
      data: updatedBusiness,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error:
        error.message ||
        "Something went wrong while updating the business info",
    });
  }
};

const sendMobileNumberOTP = async (req, res) => {
  try {
    const { businessMobilenumber } = req.body;
    if (!businessMobilenumber) {
      return res.status(400).json({
        success: false,
        message: "Business Mobile Number is required",
        data: "",
      });
    }

    const otp = generateOTP(6);
    const expiry = new Date(new Date().getTime() + 10 * 60 * 1000); //10 represnts 10 minutes of time for expiry

    console.log("expirty time>>>>", expiry);
    //updating the expiryTime and OTP
    const businessInfo = await BusinessInfo.findOneAndUpdate(
      { businessMobilenumber: businessMobilenumber },
      {
        $set: {
          mobileOTP: otp,
          mobileOTPExpiry: expiry,
        },
      },
      { new: true }
    );
    console.log("After Update");

    let msgOptions = {
      //I am using TWILIO
      //the number at trial version
      from: process.env.trailNumber,
      to: businessMobilenumber, //its a free trial version the otp goes to verified persons only!
      body: otp,
    };
    const message = await client.messages.create(msgOptions);
    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${businessMobilenumber}`,
      data: businessInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error:
        error.message ||
        "Something went wrong while Sending the OTP to Mobile Number",
    });
  }
};

const sendEmailOTP=async(req,res)=>{
  try {
    const { businessEmail } = req.body;
    if (!businessEmail) {
      return res.status(400).json({
        success: false,
        message: "Business Mobile Number is required",
        data: "",
      });
    }

     //sendimg the MAIL
     const mailSent = {
      email: businessEmail,
      emailType: "Verify",
    };

    const mailResponse=await sendEmail(mailSent);
    console.log("MAIL response>>>>>>>>>>>>",mailResponse);
    if(mailResponse){
      return res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${businessEmail}`
      })
    }
    
    
  }catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error:
        error.message ||
        "Something went wrong while Sending the OTP to Business Email",
    });
  }
}

module.exports = {
  createBusinessInfo,
  uploadRestaurantImage,
  updateBusinessInfo,
  sendMobileNumberOTP,
  sendEmailOTP

};
