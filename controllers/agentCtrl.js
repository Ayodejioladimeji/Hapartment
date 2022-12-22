const User = require("../models/userModel");
const Listing = require("../models/listModel");

//

const agentCtrl = {
  allAgents: async (req, res) => {
    try {
      const all_users = await User.find().sort("-createdAt");

      const agents = all_users.filter((item) => item.userType === "agent");

      res.json(agents);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //   agent details
  agentDetails: async (req, res) => {
    try {
      // get agents by id
      const agent_details = await User.findById({ _id: req.params.id });
      if (!agent_details)
        return res.status(400).json({ msg: "Agent not found" });

      // get all listings by the agent
      const all_listing = await Listing.find();

      const agent_listing = all_listing.filter(
        (item) => item.postedBy._id.toString() === req.params.id
      );
      res.json({
        agent_details: agent_details,
        agent_listing: agent_listing,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = agentCtrl;
