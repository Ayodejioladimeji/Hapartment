const router = require("express").Router();
const { check } = require("express-validator");
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middlewares/auth");

// post request
router.post(
  "/register",
  check("email", "Please provide a valid email").isEmail(),
  check(
    "password",
    "Please provide a password with 6 or more characters"
  ).isLength({ min: 6 }),
  userCtrl.register
);

router.post("/authenticate", userCtrl.authenticate);
router.post("/resend", userCtrl.resend);
router.post("/login", userCtrl.login);
router.post("/forgotpassword", userCtrl.forgotPassword);
router.post("/resetpassword", userCtrl.resetPassword);
router.post("/changepassword", auth, userCtrl.changePassword);
router.patch("/updateuser", auth, userCtrl.updateUser);
router.patch("/verifyagent", auth, userCtrl.verifyAgent);

// get request
router.get("/user", auth, userCtrl.getUser);

module.exports = router;
