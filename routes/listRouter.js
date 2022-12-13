const listCtrl = require("../controllers/listCtrl");
const auth = require("../middlewares/auth");

const router = require("express").Router();

//
router.post("/create_listing", auth, listCtrl.createListing);

//
module.exports = router;
