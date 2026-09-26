const express = require("express");
const router = express.Router();
const { signup, login, updatePassword } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
const { signupValidation, loginValidation, passwordUpdateValidation } = require("../middleware/validate");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.put("/update-password", verifyToken, passwordUpdateValidation, updatePassword);

module.exports = router;
