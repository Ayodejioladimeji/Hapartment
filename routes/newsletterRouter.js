const router = require("express").Router();
const newsletterCtrl = require("../controllers/newsletterCtrl");

router.post("/newsletter", newsletterCtrl.newsletter);
router.get("/newsletters", newsletterCtrl.getAudience);

module.exports = router;
