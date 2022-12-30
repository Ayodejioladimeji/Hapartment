const User = require("../models/userModel");
const Listing = require("../models/listModel");
const Favorite = require("../models/favoriteModel");
const axios = require("axios");
const { strictRemoveComma } = require("comma-separator");

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
        !images
      ) {
        return res
          .status(400)
          .json({ msg: "Fields cannot be empty, please fill the inputs" });
      }

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
      const listing = await Listing.find()
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");

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
        return res.status(400).json({ msg: "You already saved this property" });

      const saved_favorite = listing.find(
        (item) => item._id.toString() === list_id
      );

      const postedBy = {
        _id: saved_favorite.postedBy._id,
        fullname: saved_favorite.postedBy.fullname,
        username: saved_favorite.postedBy.username,
        email: saved_favorite.postedBy.email,
        image: saved_favorite.postedBy.image,
      };

      // Create a new instance of the property
      const newListing = new Favorite({
        saved_favorite,
        savedBy: req.user,
        postedBy: postedBy,
      });

      await newListing.save();
      // res.json(newListing);

      res.json({ msg: "Property added to your favorites" });
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

  // Report listing
  reportListing: async (req, res) => {
    try {
      const { list_id, message } = req.body;

      const listing = await Listing.findOne({ _id: list_id });

      const data = {
        user: req.user.id,
        message,
      };

      const check = listing.reportedBy.find(
        (item) => item.user === req.user.id
      );

      if (check)
        return res
          .status(400)
          .json({ msg: "You already reported this property" });

      listing.reportedBy.unshift(data);

      await listing.save();

      res.json({ msg: "You just reported this property" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  // filter listing
  filterListing: async (req, res) => {
    try {
      const data = await Listing.find()
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");
      const filters = req.query;

      const filt = {
        property_type: filters.property_type,
        statename: filters.statename,
        cityname: filters.cityname,
        bathrooms: filters.bathrooms,
        toilets: filters.toilets,
        furnishing: filters.furnishing,
      };

      const filteredListing = data.filter((item) => {
        let isValid = true;

        for (key in filt) {
          // console.log(key, item[key], filters[key]);
          isValid = isValid && item[key] === filt[key];
        }
        return isValid;
      });

      // add price filtering
      const priceFilter = filteredListing.filter(
        (item) =>
          strictRemoveComma(item.price) >=
            strictRemoveComma(filters.min_price) &&
          strictRemoveComma(item.price) <= strictRemoveComma(filters.max_price)
      );

      res.json(priceFilter);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // search listing
  searchListing: async (req, res) => {
    try {
      const data = await Listing.find()
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");
      const filters = req.query;

      const filteredListing = data.filter((item) => {
        let isValid = true;

        for (key in filters) {
          isValid = isValid && item[key] === filters[key];
        }
        return isValid;
      });

      res.json(filteredListing);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = listCtrl;
