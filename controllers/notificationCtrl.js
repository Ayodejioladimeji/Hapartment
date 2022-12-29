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

      //   Check if the user has already created a related notifications
      const data = await Notification.find();
      const filters = req.body;

      const check = data.filter(
        (item) => item.postedBy._id.toString() === req.user.id.toString()
      );

      const checker = check.filter(
        (item) =>
          item.property_type === filters.property_type &&
          item.statename === filters.statename &&
          item.cityname === filters.cityname &&
          item.bathrooms === filters.bathrooms &&
          item.toilets === filters.toilets &&
          item.furnishing === filters.furnishing
      );

      if (checker.length !== 0)
        return res
          .status(400)
          .json({ msg: "You already created a related notification" });

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

  //   delete notification by user
  deleteNotification: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      await Notification.findByIdAndDelete(req.params.id);

      res.json({ msg: "Notification deleted successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = notificationCtrl;
