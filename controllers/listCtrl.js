const User = require("../models/userModel");
const Listing = require("../models/listModel");
const Favorite = require("../models/favoriteModel");
const axios = require("axios");

const { GEO_HOST, GEO_URL, GEO_KEY } = process.env;

const listCtrl = {
  createListing: async (req, res) => {
    try {
      const {
        address,
        property_type,
        country,
        state,
        city,
        statename,
        cityname,
        bedrooms,
        bathrooms,
        toilets,
        furnishing,
        home_facilities,
        area_facilities,
        description,
        price,
        category,
        video,
        images,
      } = req.body;

      // if (
      //   !address ||
      //   !property_type ||
      //   !country ||
      //   !state ||
      //   !city ||
      //   !bathrooms ||
      //   !toilets ||
      //   !furnishing ||
      //   !home_facilities ||
      //   !area_facilities ||
      //   !description ||
      //   !price ||
      //   !category ||
      //   !images
      // ) {
      //   return res
      //     .status(400)
      //     .json({ msg: "Fields cannot be empty, please fill the inputs" });
      // }

      //   check if the user exists
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User not found" });

      // get the latitude and longitude of the address provided by the user
      let map = [];

      const options = {
        method: "GET",
        url: process.env.GEO_URL,
        params: {
          address: address,
        },
        headers: {
          "X-RapidAPI-Key": process.env.GEO_KEY,
          "X-RapidAPI-Host": process.env.GEO_HOST,
        },
      };

      await axios
        .request(options)
        .then(function (response) {
          map.push(response.data.Results[0]);
        })
        .catch(function (error) {
          console.error(error);
        });

      //   save data in the database
      const newListing = new Listing({
        address,
        map,
        property_type,
        country,
        state,
        city,
        statename,
        cityname,
        bedrooms,
        bathrooms,
        toilets,
        furnishing,
        home_facilities,
        area_facilities,
        description,
        price,
        category,
        video,
        images,
        postedBy: req.user,
      });

      await newListing.save();
      res.json({
        msg: "Property under review for approval, this can take up to 1hr, you will get a mail from us as soon as it is approved! ",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //   get all listings
  allListing: async (req, res) => {
    try {
      const listing = await Listing.find()
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");

      res.json(listing);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //   Listing details
  listDetails: async (req, res) => {
    try {
      // check if user is logged in
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(400).json({ msg: "Please login to continue" });

      const list_details = await Listing.findById(req.params.id);

      res.json(list_details);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //   get my listings by agents
  myListing: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(400).json({ msg: "Please login to continue" });

      const listing = await Listing.find({ postedBy: req.user.id })
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");

      if (!listing) return res.status(400).json({ msg: "No properties found" });

      res.json(listing);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //   My Saved Favorites
  saveFavorite: async (req, res) => {
    try {
      const { list_id } = req.body;

      // get all listing
      const listing = await Listing.find().sort("-createdAt");

      // check if the listing clicked is available
      const list = listing.filter((item) => item._id.toString() === list_id);

      if (list.length === 0)
        return res.status(400).json({ msg: "Property not found" });

      // Check if the property has already been added
      const favorites = await Favorite.find();

      const myfav = favorites.find(
        (item) => item.saved_favorite._id.toString() === list_id
      );

      if (myfav)
        return res
          .status(400)
          .json({ msg: "Property already saved to favorites" });

      const saved_favorite = listing.find(
        (item) => item._id.toString() === list_id
      );

      // Create a new instance of the property
      const newListing = new Favorite({
        saved_favorite,
        savedBy: req.user,
      });

      await newListing.save();

      res.json({ msg: "Property added to your favorites", newListing });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // get Saved favorites
  getFavorites: async (req, res) => {
    try {
      const favourite = await Favorite.find().sort("-createdAt");
      // filter through the listing to get the ones created by the logged in user
      const get_favourite = favourite.filter(
        (item) => item.savedBy.toString() === req.user.id.toString()
      );
      res.json(get_favourite);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = listCtrl;
