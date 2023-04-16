const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const favoriteSchema = new mongoose.Schema(
  {
    saved_favorite: {
      type: Object,
      required: true,
    },
    savedBy: {
      type: ObjectId,
      ref: "User",
    },
    postedBy: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
