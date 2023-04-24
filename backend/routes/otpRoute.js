const express = require("express");

const { getOTP, sendOtpController } = require("../controllers/otpController");
const router = new express.Router();

router.post("/sendOtp", sendOtpController);

router.post("/getOtp", getOTP);

module.exports = router;
