const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  addUser,
  addStore,
  getStores,
  getUsers,
  getUserById,
} = require("../controllers/adminController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { nameRule, emailRule, addressRule, passwordRule, handleValidation } = require("../middleware/validate");
const { body } = require("express-validator");

// all admin routes require a valid token + admin role
router.use(verifyToken, requireRole("admin"));

router.get("/dashboard", getDashboardStats);

router.post(
  "/users",
  [nameRule, emailRule, addressRule, passwordRule, body("role").isIn(["admin", "user", "owner"]), handleValidation],
  addUser
);

router.post(
  "/stores",
  [nameRule, emailRule, addressRule, handleValidation],
  addStore
);

router.get("/stores", getStores);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

module.exports = router;
