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
        identity_name: {
          type: String,
          default: null,
        },
        identity_mobile: {
          type: String,
          default: null,
        },
        identity_selfie: {
          type: String,
          default: null,
        },
        identity_document: {
          type: String,
          default: null,
        },
        document_type: {
          type: String,
          default: null,
        },
        isVerified: {
          type: String,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
