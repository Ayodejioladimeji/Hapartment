const User = require("../models/userModel");
const Listing = require("../models/listModel");
const { strictRemoveComma } = require("comma-separator");
const Notification = require("../models/notificationModel");

const notificationCtrl = {
  createNotification: async (req, res) => {
    try {
      const {
        property_type,
        bathrooms,
        toilets,
        statename,
        cityname,
        furnishing,
        min_price,
        max_price,
      } = req.body;

      // check for empty input
      if (
        !property_type ||
        !bathrooms ||
        !toilets ||
        !statename ||
        !cityname ||
        !furnishing ||
        !min_price ||
        !max_price
      ) {
        return res.status(400).json({ msg: "Input cannot be empty" });
      }

      const newNotification = new Notification({
        property_type,
        bathrooms,
        toilets,
        statename,
        cityname,
        furnishing,
        min_price,
        max_price,
        postedBy: req.user,
      });

      await newNotification.save();

      res.json({
        msg: "Notification created successfully",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  myNotification: async (req, res) => {
    try {
      const notify = await Notification.find({ postedBy: req.user.id })
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");

      if (!notify)
        return res.status(400).json({ msg: "No notification found" });

      res.json(notify);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = notificationCtrl;
