const express = require("express");
const router = express.Router();

//Storage
const multer = require("multer");
const { ownerProfileImage, createOwnerInfo } = require("../controllers/ownerInfo.controller");
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
router.post('/createOwner',createOwnerInfo)
router.post("/uploadProfileImage/:ownerInfoId",upload.single("file"), ownerProfileImage);



module.exports = router;