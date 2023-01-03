const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middlewares/auth");

// post request
// router.post("/admin-login", userCtrl.login);
// router.patch("/admin-updateuser", auth, adminCtrl.updateUser);
// router.patch("/admin-verifyagent", auth, adminCtrl.verifyAgent);

// get request
router.get("/all-users", adminCtrl.getAllUsers);

module.exports = router;
