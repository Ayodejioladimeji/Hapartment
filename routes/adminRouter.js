const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middlewares/auth");

// post request
// router.post("/admin-login", userCtrl.login);
router.post("/create-admin", adminCtrl.createAdmin);
router.post("/login-admin", adminCtrl.loginAdmin);
router.post("/contact", adminCtrl.contactUs);
router.post("/contact", adminCtrl.contactUs);
router.post("/create-admin", adminCtrl.createAdmin);
router.post("/login-admin", adminCtrl.loginAdmin);

// patch request
// router.patch("/admin-updateuser", adminCtrl.updateUser);
router.patch("/approve-agent/:id", adminCtrl.approveAgent);
router.patch("/decline-agent/:id", adminCtrl.declineAgent);
router.patch("/approve-listing/:id", adminCtrl.approveListing);
router.patch("/decline-listing/:id", adminCtrl.declineListing);

// get request
router.get("/all-users", adminCtrl.getAllUsers);

module.exports = router;
