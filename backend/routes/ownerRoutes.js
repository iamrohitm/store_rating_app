const express = require("express");
const router = express.Router();
const { getOwnerDashboard } = require("../controllers/ownerController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.use(verifyToken, requireRole("owner"));

router.get("/dashboard", getOwnerDashboard);

module.exports = router;
