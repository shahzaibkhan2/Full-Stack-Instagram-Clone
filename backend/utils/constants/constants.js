import { validationResult } from "express-validator";
const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next(); // Proceed to the next middleware or route handler if validation passes
  }

  // Create a structured error response
  const errors = result.array().map((err) => {
    switch (err.param) {
      case "username":
        return {
          field: "username",
          message:
            err.msg ||
            "Invalid username. It should be alphanumeric and between 3 to 20 characters.",
        };
      case "password":
        return {
          field: "password",
          message:
            err.msg ||
            "Invalid password. It should be at least 8 characters long and contain at least one number and one special character.",
        };
      case "email":
        return {
          field: "email",
          message: err.msg || "Please provide a valid email address.",
        };
      case "profilePicture":
        return {
          field: "profilePicture",
          message: err.msg || "Profile picture URL is invalid.",
        };
      case "gender":
        return {
          field: "gender",
          message: err.msg || "Gender must be male, female, or other.",
        };
      case "biography":
        return {
          field: "biography",
          message: err.msg || "Biography must not exceed 200 characters.",
        };
      default:
        return {
          field: err.param,
          message: err.msg || "Invalid input.",
        };
    }
  });

  // Return error response with detailed field messages
  return res.status(400).json({ errors });
};

export default handleValidationErrors;
