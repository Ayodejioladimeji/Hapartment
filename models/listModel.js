const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const listingSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    property_type: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
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
    bedrooms: {
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
    home_facilities: {
      type: Array,
      required: true,
    },
    area_facilities: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    acquired: {
      type: Boolean,
      default: false,
    },
    images: {
      type: Array,
      required: true,
    },
    video: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Listing", listingSchema);
