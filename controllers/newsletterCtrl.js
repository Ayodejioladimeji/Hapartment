const Newsletter = require("../models/newsletterModal");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const sendEmail = require("./sendMails");

const newsletterCtrl = {
  newsletter: async (req, res) => {
    try {
      const { email, fullname } = req.body;

      if (!email || !fullname) {
        return res
          .status(400)
          .json({ msg: "Please provide your fullname and email address" });
      }

      // Check if user email exist already in the database
      const check = await Newsletter.findOne({ email });
      if (check)
        return res.status(400).json({
          msg: "Thank you, You have already subscribed to our waitlist.",
        });

      // mailchimp
      mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_API_SERVER,
      });

      // splitting the fullname
      const name = fullname.split(" ");

      // Creating a new member here
      await mailchimp.lists.addListMember(process.env.MAILCHIMP_ID, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name[0],
          LNAME: name[1],
        },
      });

      // Create an Instance
      const newUser = new Newsletter({
        fullname,
        email,
      });

      //   Save to the database
      await newUser.save();

      sendEmail(email, name[0]);

      return res.json({ msg: "Thank you for Joining our waitlist", newUser });
    } catch (err) {
      if (err.message === "Bad Request") {
        return res.status(400).json({ msg: "You already joined our waitlist" });
      }

      return res.status(500).json({ msg: err.message });
    }
  },

  getAudience: async (req, res) => {
    try {
      // mailchimp
      mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_API_SERVER,
      });

      const response = await mailchimp.lists.getListMembersInfo(
        process.env.MAILCHIMP_ID
      );

      res.json({ msg: "Data fetched successfully", response });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = newsletterCtrl;
