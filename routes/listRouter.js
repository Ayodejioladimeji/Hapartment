const listCtrl = require("../controllers/listCtrl");
const auth = require("../middlewares/auth");

const router = require("express").Router();

//
// post request
router.post("/create_listing", auth, listCtrl.createListing);

//
// get request
router.get("/all_listing", listCtrl.allListing);
router.get("/my_listing", auth, listCtrl.myListing);
router.get("/list_details/:id", listCtrl.listDetails);
//
module.exports = router;
