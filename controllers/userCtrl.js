const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { strictRemoveComma } = require("comma-separator");
const registerMail = require("../mails/registerMail");
const forgotPasswordMail = require("../mails/forgotPasswordMail");

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
        userType: "agent",
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
        return res.status(401).json({ msg: "Invalid code" });
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
          .json({ msg: "One Time Code expired, register again" });
      }
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

      const code = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();

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
      return res.status(500).json({ msg: error.message });
    }
  },
};

// ===========================
// Activation token
const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

// Access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = userCtrl;
