const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middlewares/auth");

// post request
// router.post("/admin-login", userCtrl.login);
router.post("/create-admin", adminCtrl.createAdmin);
router.post("/login-admin", adminCtrl.loginAdmin);

// patch request
// router.patch("/admin-updateuser", auth, adminCtrl.updateUser);
router.patch("/approve-agent/:id", auth, adminCtrl.approveAgent);
router.patch("/decline-agent/:id", auth, adminCtrl.declineAgent);
router.patch("/approve-listing/:id", auth, adminCtrl.approveListing);
router.patch("/decline-listing/:id", auth, adminCtrl.declineListing);

// get request
router.get("/all-users", adminCtrl.getAllUsers);

module.exports = router;
