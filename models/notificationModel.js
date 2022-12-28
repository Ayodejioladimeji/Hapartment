const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema(
  {
    property_type: {
      type: String,
      required: true,
    },
    statename: {
      type: String,
      required: true,
    },
    cityname: {
      type: String,
      required: true,
    },
    bathrooms: {
      type: String,
      required: true,
    },
    toilets: {
      type: String,
      required: true,
    },
    furnishing: {
      type: String,
      required: true,
    },
    min_price: {
      type: String,
      required: true,
    },
    max_price: {
      type: String,
      required: true,
    },

    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
