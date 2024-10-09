const crypto = require("crypto");

const generateOTP = (length) => {
  const otp = crypto
    .randomInt(0, Math.pow(10, length)) 
    .toString()
    .padStart(length, "0");
  return otp;
};

module.exports=generateOTP