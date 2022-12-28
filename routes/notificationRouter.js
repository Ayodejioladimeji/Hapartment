const notificationCtrl = require("../controllers/notificationCtrl");
const auth = require("../middlewares/auth");

const router = require("express").Router();

//
// post request
router.post("/create_notification", auth, notificationCtrl.createNotification);

//
// get request
router.get("/my_notifications", auth, notificationCtrl.myNotification);

// patch request

// delete
router.delete(
  "/delete_notification/:id",
  auth,
  notificationCtrl.deleteNotification
);

//
module.exports = router;
