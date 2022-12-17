const agentCtrl = require("../controllers/agentCtrl");
const auth = require("../middlewares/auth");

const router = require("express").Router();

// get request
router.get("/all_agents", agentCtrl.allAgents);
router.get("/agent_details/:id", auth, agentCtrl.agentDetails);
//
module.exports = router;
