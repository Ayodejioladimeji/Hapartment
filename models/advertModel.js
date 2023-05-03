const mongoose = require("mongoose");

const advertSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      required: true,
      trim: true,
    },
    pricing: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: Object,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isStarted: {
      type: String,
      required: true,
    },
    isEnded: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Advert", advertSchema);
