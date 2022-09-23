const Newsletter = require("../models/newsletterModal");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const sendEmail = require("./sendMail");

const newsletterCtrl = {
  newsletter: async (req, res) => {
    try {
      const { email } = req.body;

      const check = await Newsletter.findOne({ email });
      if (check)
        return res.status(400).json({
          msg: "Thank you, You have already subscribed to our waitlist.",
        });

      // mailchimp
      mailchimp.setConfig({
        apiKey: "ed704bd6fe7c1e6ba419ba0be27eadd6-us8",
        server: "us8",
      });

      // fetching all members from mailchimp to check for existing members
      const { members } = await mailchimp.lists.getListMembersInfo(
        "2488e96dd4"
      );

      // get the email of each members
      let getEmail;
      members.forEach(async (item) => {
        if (item.email_address === email) {
          getEmail = item.email_address;
        }
      });

      // check if email exists here...
      if (getEmail) {
        return res.status(400).json({
          msg: "Thank you, You have already subscribed to our waitlist.",
        });
      }

      // Creating a new member here
      await mailchimp.lists.addListMember("2488e96dd4", {
        email_address: email,
        status: "subscribed",
      });

      // Create an Instance
      const newUser = new Newsletter({
        email,
      });

      //   Save to the database
      await newUser.save();
      // sendEmail(email);

      return res.json({ msg: "Thank you for Joining our waitlist", newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAudience: async (req, res) => {
    try {
      // mailchimp
      mailchimp.setConfig({
        apiKey: "ed704bd6fe7c1e6ba419ba0be27eadd6-us8",
        server: "us8",
      });

      const response = await mailchimp.lists.getListMembersInfo("2488e96dd4");
      console.log(response.members);

      res.json({ msg: "Data fetched successfully", response });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = newsletterCtrl;
