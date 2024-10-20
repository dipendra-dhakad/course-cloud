const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from the req body
    const email = req.body.email;

    //check user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }

    //genrate token
    // const token = crypto.randomUUID();
    const token = crypto.randomBytes(20).toString("hex")

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpries: Date.now() + 3600000,
      },
      { new: true }
    );
    // console.log("DETAILS", updatedDetails);

    //create url
    const url = `http://localhost:3000/update-password/${token}`;
    // const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`

    //send mail conating url
    await mailSender(
      email,
      "Password Reset Link",
      `Your Link for Password Reset is ${url}. Please click this url to reset your password.`
    );

    //return response
    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    });
  }
};

//reset Password
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, comfirmPassword, token } = req.body;

    //validation
    if (comfirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }

    //get user details from the db using token
    const userDetails = await User.findOne({ token: token });

    //if no entry  - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }

    //token time check
    if (!(userDetails.resetPasswordExpries > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true }
    );

    //return reponse
    return res.status(200).json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};
