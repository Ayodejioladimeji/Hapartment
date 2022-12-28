const listCtrl = require("../controllers/listCtrl");
const auth = require("../middlewares/auth");

const router = require("express").Router();

//
// post request
router.post("/create_listing", auth, listCtrl.createListing);
router.post("/save_favorite", auth, listCtrl.saveFavorite);
router.post("/report_listing", auth, listCtrl.reportListing);

//
// get request
router.get("/all_listing", listCtrl.allListing);
router.get("/my_listing", auth, listCtrl.myListing);
router.get("/list_details/:id", listCtrl.listDetails);
router.get("/get_favorite", auth, listCtrl.getFavorites);
router.get("/filter_listing", listCtrl.filterListing);
router.get("/search_listing", listCtrl.searchListing);

// patch request

//
module.exports = router;
