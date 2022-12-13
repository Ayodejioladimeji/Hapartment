const User = require("../models/userModel");
const Listing = require("../models/listModel");

const listCtrl = {
  createListing: async (req, res) => {
    try {
      const {
        address,
        property_type,
        country,
        state,
        city,
        bathrooms,
        toilets,
        furnishing,
        home_facilities,
        area_facilities,
        description,
        price,
        category,
        area_guide,
        images,
      } = req.body;

      if (
        !address ||
        !property_type ||
        !country ||
        !state ||
        !city ||
        !bathrooms ||
        !toilets ||
        !furnishing ||
        !home_facilities ||
        !area_facilities ||
        !description ||
        !price ||
        !category ||
        !area_guide ||
        !images
      ) {
        return res
          .status(400)
          .json({ msg: "Fields cannot be empty, please fill the inputs" });
      }

      //   check if the user exists
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User not found" });

      //   save data in the database
      const newListing = new Listing({
        address,
        property_type,
        country,
        state,
        city,
        bathrooms,
        toilets,
        furnishing,
        home_facilities,
        area_facilities,
        description,
        price,
        category,
        area_guide,
        images,
      });

      await newListing.save();
      res.json({
        msg: "Property under review for approval, this can take up to 1hr, you will get a mail from us as soon as it is approved! ",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = listCtrl;
