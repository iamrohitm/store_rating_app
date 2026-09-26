const express = require("express");
const router = express.Router();
const { getStoresForUser, submitRating } = require("../controllers/userController");
const { verifyToken, requireRole } = require("../middleware/auth");

// only normal users use these
router.use(verifyToken, requireRole("user"));

router.get("/stores", getStoresForUser);
router.post("/stores/:storeId/rating", submitRating);

module.exports = router;
