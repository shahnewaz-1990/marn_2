const OTP = require("../models/OTPModel");

const generateOTP = require("../utils/generateOTP.js");
const sendOTP = require("../utils/sendOTP.js");

const sendOtpController = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = await generateOTP();
    await sendOTP(otp, email);
    OTP.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true },
      (err, result) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        res.json({
          message: "OTP Saved",
          result,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getOTP = async (req, res) => {
  try {
    const otp = await OTP.findOne({ email: req.body.email });
    if (!otp) {
      return res.status(400).send();
    }
    res.send(otp);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  sendOtpController,
  getOTP,
};
