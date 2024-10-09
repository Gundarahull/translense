const mongoose = require("mongoose");

const businessInfo = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    businessCountry: {
      type: String,
      required: true,
    },
    businessState: {
      type: String,
      required: true,
    },
    businessCity: {
      type: String,
      required: true,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true,
    },
    businessMobilenumber: {
      type: String,
      required: true,
    },
    restaurantImage: {
      type: String,
      //   required: true,
    },
    mobileOTP: {
      type: String,
    },
    mobileOTPExpiry: {
      type: String,
    },
    emailOTP: {
      type: String,
    },
    emailOTPExpiry: {
      type: String,
    },
  },
  { timestamps: true }
);
const BusinessInfo = mongoose.model("BusinessInfo", businessInfo);
module.exports = BusinessInfo;
