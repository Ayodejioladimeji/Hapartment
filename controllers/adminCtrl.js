const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { strictRemoveComma } = require("comma-separator");
const forgotPasswordMail = require("../mails/forgotPasswordMail");
const resendCodeMail = require("../mails/resendCodeMail");
const registerMail = require("../mails/registerMail");

//

const adminCtrl = {
  // login admin

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // check for user in the database
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

      // check the password provided by the user
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      // create access token
      const access_token = createAccessToken({ id: user.id });

      res.json({ msg: "Login successful!", access_token });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // get logged in user with the access token created earlier
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().sort("-createdAt");
      if (users === null)
        return res.status(400).json({ msg: "User not found" });

      res.json(users);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // update user profile
  updateUser: async (req, res) => {
    try {
      const { fullname, username, image } = req.body;

      console.log(req.body);

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          fullname,
          username,
          image,
        }
      );

      res.json({ msg: "Account information updated successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

// ===========================

// Access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = adminCtrl;
