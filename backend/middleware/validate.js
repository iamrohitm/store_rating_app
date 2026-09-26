const { body, validationResult } = require("express-validator");

// runs after the rule chains below, sends 400 if any rule failed
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const nameRule = body("name")
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage("Name must be between 20 and 60 characters");

const emailRule = body("email")
  .trim()
  .isEmail()
  .withMessage("Enter a valid email address");

const addressRule = body("address")
  .trim()
  .isLength({ max: 400 })
  .withMessage("Address must be max 400 characters");

const passwordRule = body("password")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be 8-16 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain at least one special character");

const signupValidation = [nameRule, emailRule, addressRule, passwordRule, handleValidation];
const loginValidation = [emailRule, body("password").notEmpty(), handleValidation];
const passwordUpdateValidation = [passwordRule, handleValidation];

module.exports = {
  signupValidation,
  loginValidation,
  passwordUpdateValidation,
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  handleValidation,
};
