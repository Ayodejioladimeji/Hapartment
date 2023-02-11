const User = require("../models/userModel");
const Contact = require("../models/contactModel");
const jwt = require("jsonwebtoken");
const Listing = require("../models/listModel");
const Admin = require("../models/adminModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { strictRemoveComma } = require("comma-separator");
const forgotPasswordMail = require("../mails/forgotPasswordMail");
const resendCodeMail = require("../mails/resendCodeMail");
const registerMail = require("../mails/registerMail");

//

const adminCtrl = {
  // create admin
  createAdmin: async (req, res) => {
    try {
      const { fullname, email, password } = req.body;
      // check for empty input field
      if (!fullname || !email || !password) {
        return res.status(400).json({ msg: "Field cannot be empty" });
      }

      // check of the user already exists in the database
      const user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ msg: "Admin already exists with the email address" });

      // password encryption
      const passwordHash = await bcrypt.hash(password, 12);

      // Create a new admin
      const newAdmin = new Admin({
        fullname,
        email,
        password: passwordHash,
      });

      await newAdmin.save();
      res.json({ msg: "Admin agent created successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // login admin

  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // check for user in the database
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(400).json({ msg: "Invalid Credentials" });

      // check the password provided by the user
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      // create access token
      const access_token = createAccessToken({ id: admin.id });

      res.json({ msg: "Login successful!", access_token });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // get all users
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

  // get all listings
  getAllListings: async (req, res) => {
    try {
      const list = await Listing.find().sort("-createdAt");
      if (list === null)
        return res.status(400).json({ msg: "Properties not found" });

      res.json(list);
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

  // Verify Agent endpoint
  approveAgent: async (req, res) => {
    try {
      const allusers = await User.find();

      const getUser = allusers.filter(
        (user) => user._id.toString() === req.params.id
      );

      const {
        identity_name,
        identity_mobile,
        identity_selfie,
        identity_document,
        document_type,
      } = getUser[0].verification[0];

      const newData = {
        identity_name,
        identity_mobile,
        identity_selfie,
        identity_document,
        document_type,
        isVerified: "true",
      };

      await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          verification: newData,
        }
      );

      res.json({ msg: "Agent verified successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Decline Agent verification endpoint
  declineAgent: async (req, res) => {
    try {
      const allusers = await User.find();

      const getUser = allusers.filter(
        (user) => user._id.toString() === req.params.id
      );

      const {
        identity_name,
        identity_mobile,
        identity_selfie,
        identity_document,
        document_type,
      } = getUser[0].verification[0];

      const newData = {
        identity_name,
        identity_mobile,
        identity_selfie,
        identity_document,
        document_type,
        isVerified: "declined",
      };

      await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          verification: newData,
        }
      );

      res.json({ msg: "Agent approval declined successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Approve Listings
  approveListing: async (req, res) => {
    try {
      await Listing.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          status: "verified",
        }
      );

      res.json({ msg: "Property verified successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Decline Listings
  declineListing: async (req, res) => {
    try {
      await Listing.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          status: "declined",
        }
      );

      res.json({ msg: "Property declined successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // contact us
  contactUs: async (req, res) => {
    try {
      const { name, email, message } = req.body;

      const newContact = new Contact({
        name,
        email,
        message,
      });

      await newContact.save();
      res.json({
        msg: "Thank your for contacting us, we'll reply you as soon as possible",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
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
