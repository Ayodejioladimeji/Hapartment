const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    userType: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },

    verification: [
      {
        fullname: {
          type: String,
          default: "",
        },
        phone: {
          type: String,
          default: "",
        },
        image: {
          type: String,
          default: "",
        },
        document: {
          type: String,
          default: "",
        },
        isVerified: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
