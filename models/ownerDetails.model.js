const mongoose = require("mongoose");

const ownerInfo = new mongoose.Schema(
  {
    ownerFullName: {
      type: String,
      required: true,
    },
    ownerCountry: {
      type: String,
      required: true,
    },
    ownerState: {
      type: String,
      required: true,
    },
    ownerCity: {
      type: String,
      required: true,
    },
    ownerAddress: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    ownerMobilenumber: {
      type: String,
      required: true,
    },
    profileImage: {
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
    businessInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessInfo", // Reference to the BusinessInfo model
    },
  },
  { timestamps: true }
);
const OwnerInfo = mongoose.model("OwnerInfo", ownerInfo);
module.exports = OwnerInfo;
