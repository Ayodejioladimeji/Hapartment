const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { strictRemoveComma } = require("comma-separator");
const registerMail = require("../mails/registerMail");
const forgotPasswordMail = require("../mails/forgotPasswordMail");
const resendCodeMail = require("../mails/resendCodeMail");

//

const userCtrl = {
  // register user

  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { fullname, username, email, password, userType } = req.body;

      // check for empty field
      if (!fullname || !username || !email || !password) {
        return res.status(400).json({ msg: "Field cannot be empty" });
      }

      // check of the user already exists in the database
      const user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ msg: "User already exists with the email address" });

      // password encryption
      const passwordHash = await bcrypt.hash(password, 12);

      // Generate the one-time verication code

      const code = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();

      // create user object
      const newUser = {
        fullname,
        email,
        username,
        userType,
        password: passwordHash,
        code,
      };

      // Create activation token to save the userdata till they are verified
      const activation_token = createActivationToken(newUser);

      // send email to the newly registered user
      registerMail(email, fullname, code);

      // send feedbacl to the client side
      res.json({
        msg: "Registration successful!, please check your mail to activate your account",
        activation_token,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // authenticate user with verification code

  authenticate: async (req, res) => {
    try {
      const { activation_token, auth_code } = req.body;

      // validate the activation token received
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { fullname, username, email, userType, password, code } = user;

      // Check the code provided by the user
      if (strictRemoveComma(auth_code) !== strictRemoveComma(code)) {
        return res.status(401).json({ msg: "PLease provide a valid code" });
      }

      // check if the user already exists in the database
      const checkUser = await User.findOne({ email });
      if (checkUser)
        return res.status(400).json({ msg: "User already exists" });

      // Create a new user object to be saved in the user collection
      const newUser = new User({
        fullname,
        username,
        email,
        password,
        userType,
      });

      await newUser.save();
      res.json({ msg: "Your Account has been activated" });
    } catch (error) {
      if (error.message === "jwt expired") {
        return res
          .status(401)
          .json({ msg: "Session expired, Resend code again" });
      }
      return res.status(500).json({ msg: error.message });
    }
  },

  // Resend code to the user
  resend: async (req, res) => {
    try {
      const { activationtoken } = req.body;

      // Generate the one-time verication code

      const code = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();

      // validate the activation token received
      const user = jwt.verify(
        activationtoken,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { fullname, email, username, userType, password } = user;

      // create user object
      const newUser = {
        fullname,
        email,
        username,
        userType,
        password,
        code,
      };

      // Create activation token to save the userdata till they are verified
      const activation_token = createActivationToken(newUser);

      // send email to the newly registered user
      resendCodeMail(email, fullname, code);

      // send feedbac to the client side
      res.json({
        msg: "Code sent!, please check your mail to activate your account",
        activation_token,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // login user

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
  getUser: async (req, res) => {
    try {
      const check = await User.findById(req.user);
      if (check === null)
        return res.status(400).json({ msg: "User not found" });

      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exists" });

      // Generate the one-time verication code

      const code = Math.floor(
        Math.random() * (99999999 - 10000000) + 10000000
      ).toString();

      const authorised = {
        id: user._id,
        code,
      };

      // Create activation token to save the userdata till they are verified
      const activation_token = createActivationToken(authorised);

      // send email to the user email
      forgotPasswordMail(email, code);

      // send feedback to the user
      res.json({
        msg: "Please check your mail to get your one time code",
        activation_token,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // reset your password
  resetPassword: async (req, res) => {
    try {
      const { activation_token, auth_code, password } = req.body;

      // validate the activation token received
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { id, code } = user;

      // Check the code provided by the user
      if (strictRemoveComma(auth_code) !== strictRemoveComma(code)) {
        return res.status(401).json({ msg: "Invalid code" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      await User.findOneAndUpdate(
        { id: id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password successfully changed!" });
    } catch (error) {
      if (error.message === "jwt expired") {
        return res
          .status(401)
          .json({ msg: "Session expired, Please try again" });
      }

      return res.status(500).json({ msg: error.message });
    }
  },

  // change your password
  changePassword: async (req, res) => {
    try {
      const { account_password, new_password } = req.body;

      const user = await User.findOne({ email: req.user.email });
      if (!user) return res.status(400).json({ msg: "User not found" });

      // check if the password matched
      const isMatch = await bcrypt.compare(account_password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Account password is incorrect" });

      const passwordHash = await bcrypt.hash(new_password, 12);

      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password successfully changed!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // update user profile
  updateUser: async (req, res) => {
    try {
      const { fullname, username, image } = req.body;

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

  // verify agent
  verifyAgent: async (req, res) => {
    try {
      const {
        identity_name,
        identity_mobile,
        identity_document,
        identity_selfie,
        documentType,
      } = req.body;

      console.log(req.body);

      if (
        identity_name === null ||
        identity_mobile === null ||
        identity_selfie === null ||
        identity_document === null ||
        documentType === null
      ) {
        return res
          .status(400)
          .json({ msg: "Please provide necessary informations" });
      }

      const newData = {
        identity_name,
        identity_mobile,
        identity_selfie,
        identity_document,
        documentType,
        isVerified: "true",
      };

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          verification: newData,
        }
      );

      res.json({ msg: "Identity verification successful" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

// ===========================
// Activation token
const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

// Access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = userCtrl;
