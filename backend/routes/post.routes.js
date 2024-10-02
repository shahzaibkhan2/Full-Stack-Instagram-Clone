import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addBookmarkToPost,
  addComment,
  addPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getPostComments,
  getUserPosts,
  likePost,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Secure Routes

router.route("/add-post").post(verifyJWT, upload.single("image"), addPost);
router.route("/get-all-posts").get(verifyJWT, getAllPosts);
router.route("/get-user-posts").get(verifyJWT, getUserPosts);
router.route("/:postId/like-post").get(verifyJWT, likePost);
router.route("/:postId/dislike-post").get(verifyJWT, dislikePost);
router.route("/:postId/add-comment").post(verifyJWT, addComment);
router.route("/:postId/get-post-comments").get(getPostComments);
router.route("/delete-post/:postId").post(verifyJWT, deletePost);
router.route("/:postId/add-bookmark").post(verifyJWT, addBookmarkToPost);

export default router;
