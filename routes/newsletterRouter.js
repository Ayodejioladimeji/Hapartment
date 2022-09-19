const router = require("express").Router();
const newsletterCtrl = require("../controllers/newsletterCtrl");

router.post("/newsletter", newsletterCtrl.newsletter);

module.exports = router;
