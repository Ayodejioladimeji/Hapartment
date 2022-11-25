const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Invalid Authentication" });

    // validate the jwt
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Invalid Authorization" });

      const { id } = user;
      User.findById(id).then((userdata) => {
        req.user = userdata;
        next();
      });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = auth;
