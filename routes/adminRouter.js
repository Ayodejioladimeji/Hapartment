const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const admin = require("../middlewares/admin");

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
router.patch("/approve-agent/:id", admin, adminCtrl.approveAgent);
router.patch("/approve-listing/:id", admin, adminCtrl.approveListing);
router.patch("/decline-agent", admin, adminCtrl.declineAgent);
router.patch("/decline-listing", admin, adminCtrl.declineListing);

// get request
router.get("/all-users", adminCtrl.getAllUsers);
router.get("/user", adminCtrl.getAdmin);

module.exports = router;
