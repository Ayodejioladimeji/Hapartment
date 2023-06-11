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
router.patch("/suspend-agent", admin, adminCtrl.suspendAgent);
router.patch("/lift-suspension", admin, adminCtrl.liftSuspension);
router.patch("/suspend-listing", adminCtrl.suspendListing);

// get request
router.get("/all-users", adminCtrl.getAllUsers);
router.get("/admin-user", admin, adminCtrl.getAdmin);

// delete request
router.delete("/admin-delete-listing/:id", admin, adminCtrl.deleteListing);
router.delete("/admin-delete-images/:id", admin, adminCtrl.deleteImages);
router.delete("/delete-user/:id", admin, adminCtrl.deleteUser);

module.exports = router;
