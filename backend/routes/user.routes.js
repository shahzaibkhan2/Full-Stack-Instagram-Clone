import { Router } from "express";
import {
  followOrUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/:userId/profile").get(verifyJWT, getUserProfile);
router
  .route("/profile/update")
  .post(verifyJWT, upload.single("profilePicture"), updateUserProfile);
router.route("/suggested").get(verifyJWT, getSuggestedUsers);
router
  .route("/follow-unfollow/:followed")
  .post(verifyJWT, followOrUnfollowUser);

export default router;
