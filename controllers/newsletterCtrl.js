const Newsletter = require("../models/newsletterModal");
//

const newsletterCtrl = {
  newsletter: async (req, res) => {
    try {
      const { email } = req.body;

      const check = await Newsletter.findOne({ email });
      if (check)
        return res.status(400).json({
          msg: "Thank you, You have already subscribed to our waitlist.",
        });

      // Create an Instance
      const newUser = new Newsletter({
        email,
      });

      //   Save to the database
      await newUser.save();

      res.json({ msg: "Thank you for Joining our waitlist", newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = newsletterCtrl;
