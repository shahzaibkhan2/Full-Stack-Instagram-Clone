import { body } from "express-validator";

const validationArray = [
  // Username: Required, alphanumeric, between 3 and 20 characters
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),

  // Password: Required, minimum 8 characters, contains at least one number and one special character
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  // Email: Required, valid email format
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  // Profile Picture: Optional, valid URL format
  body("profilePicture")
    .optional()
    .isURL()
    .withMessage("Profile picture must be a valid URL"),

  // Gender: Optional, only allow 'male', 'female', or 'other'
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  // Biography: Optional, maximum length of 200 characters
  body("biography")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Biography must not exceed 200 characters"),
];

export default validationArray;
