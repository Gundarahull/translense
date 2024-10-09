const BusinessInfo = require("../models/businessInfo.model");
const OwnerInfo = require("../models/ownerDetails.model");
const uploadOnCloudinary = require("../utils/cloudinary");

const createOwnerInfo = async (req, res) => {
  try {
    const {
      fullName,
      Country,
      State,
      City,
      Address,
      Email,
      Mobilenumber,
      businessInfoId,
    } = req.body;
    // Validate that all required fields are provided
    if (
      !fullName ||
      !Country ||
      !State ||
      !City ||
      !Address ||
      !Email ||
      !Mobilenumber ||
      !businessInfoId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: FullName, Country, State, City, Address,Email, Mobilenumber,businessInfoId",
        data: "",
      });
    }

    //check Business email and Business Mobile number is Same or not
    const emailMobileCheck = await BusinessInfo.findById(businessInfoId);
    if (
      !emailMobileCheck.Email === Email ||
      !emailMobileCheck.Mobilenumber === Mobilenumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Business Email and Business Mobile Number is not same",
        data: "",
      });
    }
    // Create a new owner info document
    const ownerInfo = await OwnerInfo.create({
      ownerFullName: fullName,
      ownerCountry: Country,
      ownerState: State,
      ownerCity: City,
      ownerAddress: Address,
      ownerEmail: Email,
      ownerMobilenumber: Mobilenumber,
      businessInfoId,
    });
    return res.status(201).json({
      success: true,
      message: "Owner Info created successfully",
      data: ownerInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error:
        error.message || "Something went wrong while Creating the Owner INFO",
    });
  }
};

//Normally we can add ProfileImage to specify whos image i am using "OwnerINFOID"
const ownerProfileImage = async (req, res) => {
  try {
    console.log("params>>>>", req.params);

    const { ownerInfoId } = req.params;
    if (!ownerInfoId) {
      return res.status(400).json({
        success: false,
        message: "ownerInfoIdis required",
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
    const uploadImage = await OwnerInfo.findOneAndUpdate(
      { _id: ownerInfoId },
      {
        $set: { profileImage: imageUrl.url },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Profile Image uploaded successfully",
      data: uploadImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error:
        error.message || "Something went wrong while uploading the Profile PIC",
    });
  }
};

module.exports = {
  createOwnerInfo,
  ownerProfileImage,
};
