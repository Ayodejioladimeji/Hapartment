const User = require("../models/userModel");
const Listing = require("../models/listModel");
// const SampleListing = require("../models/listSampleModel");
const Notification = require("../models/notificationModel");
const Favorite = require("../models/favoriteModel");
const axios = require("axios");
const { strictRemoveComma } = require("comma-separator");
const listingRequestMail = require("../mails/listingRequestMail");
const notificationMail = require("../mails/notificationMail");
const cloudinary = require("cloudinary");

const { CLIENT_URL, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const listCtrl = {
  // Create Listing
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

      listingRequestMail(user.email, user.fullname);
      await newListing.save();

      // Create a notification criteria to notify users through mail
      const filt = {
        property_type,
        statename,
        cityname,
        bathrooms,
        toilets,
        furnishing,
      };

      // get all notifications
      const notifications = await Notification.find()
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");

      const filtered = notifications.find((item) => {
        let isValid = true;

        const filters = {
          property_type: item.property_type,
          statename: item.statename,
          cityname: item.cityname,
          bathrooms: item.bathrooms,
          toilets: item.toilets,
          furnishing: item.furnishing,
        };

        for (key in filt) {
          // console.log(key, item[key], filters[key]);
          isValid = isValid && filters[key] === filt[key];
        }
        return isValid;
      });

      // get all listings so you can find the notification from it
      const listing = await Listing.find();

      // filter through the listing and compare its values with notification values
      if (filtered !== undefined) {
        const value = listing.find(
          (item) =>
            item.property_type === filtered.property_type &&
            item.statename === filtered.statename &&
            item.cityname === filtered.cityname &&
            item.bathrooms === filtered.bathrooms &&
            item.toilets === filtered.toilets &&
            item.furnishing === filtered.furnishing
        );

        if (value !== undefined) {
          const url = `${CLIENT_URL}/listings/${value._id}`;

          notificationMail(
            url,
            filtered.postedBy.email,
            filtered.postedBy.fullname
          );
        }
      }

      res.json({
        msg: "Property created successfully",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // update Listing
  updateListing: async (req, res) => {
    try {
      const {
        list_id,
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

      // Check if the user is logged in
      const check = await User.findById(req.user.id);

      if (check === null)
        return res.status(400).json({ msg: "Login to continue" });

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

      const newListing = await Listing.find({
        postedBy: req.user.id,
      });

      if (newListing.length === 0)
        return res
          .status(400)
          .json({ msg: "You haven't created any property" });

      const list = newListing.find((item) => item._id.toString() === list_id);

      if (!list) return res.status(400).json({ msg: "incorect list id" });

      await Listing.findOneAndUpdate(
        { _id: list._id },
        {
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
          status: "pending",
        }
      );

      // Create a notification criteria to notify users through mail
      const filt = {
        property_type,
        statename,
        cityname,
        bathrooms,
        toilets,
        furnishing,
      };

      // get all notifications
      const notifications = await Notification.find()
        .populate("postedBy", "_id fullname email username image ")
        .sort("-createdAt");

      const filtered = notifications.find((item) => {
        let isValid = true;

        const filters = {
          property_type: item.property_type,
          statename: item.statename,
          cityname: item.cityname,
          bathrooms: item.bathrooms,
          toilets: item.toilets,
          furnishing: item.furnishing,
        };

        for (key in filt) {
          // console.log(key, item[key], filters[key]);
          isValid = isValid && filters[key] === filt[key];
        }
        return isValid;
      });

      // get all listings so you can find the notification from it
      const listing = await Listing.find();

      // filter through the listing and compare its values with notification values
      if (filtered !== undefined) {
        const value = listing.find(
          (item) =>
            item.property_type === filtered.property_type &&
            item.statename === filtered.statename &&
            item.cityname === filtered.cityname &&
            item.bathrooms === filtered.bathrooms &&
            item.toilets === filtered.toilets &&
            item.furnishing === filtered.furnishing
        );

        if (value !== undefined) {
          const url = `${CLIENT_URL}/listings/${value._id}`;

          notificationMail(
            url,
            filtered.postedBy.email,
            filtered.postedBy.fullname
          );
        }
      }

      res.json({
        msg: "Property updated successfully",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //   get all listings
  allListing: async (req, res) => {
    try {
      const listing = await Listing.find()
        .populate(
          "postedBy",
          "_id fullname email username image verification isSuspended"
        )
        .sort("-createdAt");

      // filter through not to return declined listings
      const newlisting = listing.filter(
        (item) =>
          item?.status !== "declined" && item?.postedBy?.isSuspended === false
      );

      // shuffle the listings to display randomly
      const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.8);
      const randomData = shuffle(newlisting);

      res.json(randomData);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //   Listing details
  listDetails: async (req, res) => {
    try {
      const list_details = await Listing.findById(req.params.id)
        .populate("postedBy", "_id fullname email username image verification ")
        .sort("-createdAt");

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
        .populate("postedBy", "_id fullname email username image verification ")
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
        .populate("postedBy", "_id fullname email username image verification ")
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

      // const postedBy = {
      //   _id: saved_favorite.postedBy._id,
      //   fullname: saved_favorite.postedBy.fullname,
      //   username: saved_favorite.postedBy.username,
      //   email: saved_favorite.postedBy.email,
      //   image: saved_favorite.postedBy.image,
      //   verification: saved_favorite.postedBy.verification,
      // };

      // Create a new instance of the property
      const newListing = new Favorite({
        saved_favorite,
        savedBy: req.user,
        postedBy: req.user,
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
      const favourite = await Favorite.find()
        .populate("postedBy", "_id fullname email username image verification ")
        .sort("-createdAt");

      // filter through the listing to get the ones created by the logged in user
      const get_favourite = favourite.filter(
        (item) => item.postedBy.toString() === req.user.id.toString()
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

  // Delete Listing images
  destroyImage: async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) return res.status(400).json({ msg: "No image selected" });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.json({ msg: "Image Deleted" });
    });
  },

  // filter listing
  filterListing: async (req, res) => {
    try {
      const data = await Listing.find()
        .populate(
          "postedBy",
          "_id fullname email username image, verification "
        )
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
      let data = await Listing.find({
        $or: [
          { property_type: { $regex: req.params.key } },
          { statename: { $regex: req.params.key } },
          { cityname: { $regex: req.params.key } },
          { furnishing: { $regex: req.params.key } },
        ],
      });

      res.json(data);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // delete listing
  deleteListing: async (req, res) => {
    try {
      // check if the user is logged in
      const check = await User.findById(req.user.id);
      if (check === null)
        return res.status(400).json({ msg: "Login to continue" });

      await Listing.findByIdAndDelete(req.params.id);

      res.json({ msg: "Listing Deleted Successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // delete favorites
  deleteFavorite: async (req, res) => {
    try {
      // check if the user is logged in
      const check = await User.findById(req.user.id);
      if (check === null)
        return res.status(400).json({ msg: "Login to continue" });

      await Favorite.findByIdAndDelete(req.params.id);

      res.json({ msg: "Favourite Deleted Successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // update Rented / Acquired property
  acquiredListing: async (req, res) => {
    try {
      await Listing.findOneAndUpdate(
        { _id: req.params.id },
        {
          acquired: true,
        }
      );

      res.json({
        msg: "Status updated successfully",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // Delete image
  deleteImage: async (req, res) => {
    try {
      const { publicId } = req.body;
      if (!publicId) return res.status(400).json({ msg: "No images selected" });

      cloudinary.v2.uploader.destroy(publicId[0], (err, result) => {
        if (err) throw err;
      });
      cloudinary.v2.uploader.destroy(publicId[1], (err, result) => {
        if (err) throw err;
      });
      cloudinary.v2.uploader.destroy(publicId[2], (err, result) => {
        if (err) throw err;
      });
      cloudinary.v2.uploader.destroy(publicId[3], (err, result) => {
        if (err) throw err;
      });
      cloudinary.v2.uploader.destroy(publicId[4], (err, result) => {
        if (err) throw err;
      });
      cloudinary.v2.uploader.destroy(publicId[5], (err, result) => {
        if (err) throw err;
      });
      cloudinary.v2.uploader.destroy(publicId[6], (err, result) => {
        if (err) throw err;
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = listCtrl;
