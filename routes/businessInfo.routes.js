const express = require("express");
const router = express.Router();
const { uploadRestaurantImage, createBusinessInfo, updateBusinessInfo, sendMobileNumberOTP, sendEmailOTP } = require("../controllers/businessInfo.controller");

//Storage
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload=multer({storage:storage})

//Methods
router.post('/businessCreation',createBusinessInfo)
router.post("/uploadRestrauntImage/:businessInfoId",upload.single("file"), uploadRestaurantImage);
router.patch('/updateBusinessInfo/:businessInfoId',updateBusinessInfo)
router.post('/sendOTPMobile',sendMobileNumberOTP)
router.post('/sendOTPEmail',sendEmailOTP)



module.exports = router;