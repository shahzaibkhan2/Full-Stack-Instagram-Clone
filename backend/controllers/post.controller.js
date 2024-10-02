import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sharp from "sharp";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
// Add Post

const addPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const image = req.file;
  const userId = req.user?._id;

  if (!caption || !image) {
    throw new ApiError(400, "All fields are required.");
  }

  const optimizedImageBuffer = await sharp(image.buffer)
    .resize({ width: 900, height: 900, fit: "inside" })
    .toFormat("jpeg", { quality: 90 })
    .toBuffer();

  const imageUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
    "base64"
  )}`;

  const cloudinaryResponse = await uploadOnCloudinary(imageUri);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Sorry ! Internal server error.");
  }

  const post = await Post.create({
    author: userId,
    caption,
    image: cloudinaryResponse?.secure_url,
  });

  const user = await User.findById(userId);

  if (user) {
    user.posts.push(post._id);
    await user.save();
  }

  await post.populate({ path: "author", select: "-password" });

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post created successfully !"));
});

// Get All Posts

const getAllPosts = asyncHandler(async (_, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: {
        path: "author",
        select: "username profilePicture",
      },
    });

  return res
    .status(200)
    .json(new ApiResponse(200, { posts }, "All posts fetched successfully !"));
});

const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username, profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: {
        path: "author",
        select: "username, profilePicture",
      },
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { posts }, "All user posts fetched successfully !")
    );
});

const likePost = asyncHandler(async (req, res) => {
  const userWhoLikes = req.user?._id;
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) throw new ApiError(400, "No post found.");

  await post.updateOne({ $addToSet: { likes: userWhoLikes } });
  await post.save();

  // Section for Socket.io Integrations

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully liked the post !"));
});

const dislikePost = asyncHandler(async (req, res) => {
  const userWhoLikes = req.user._id;
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) throw new ApiError(400, "No post found.");

  await post.updateOne({ $pull: { likes: userWhoLikes } });
  await post.save();

  // Section for Socket.io Integrations

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully disliked the post !"));
});

const addComment = asyncHandler(async (req, res) => {
  const userWhoComments = req.user._id;
  const { postId } = req.params;
  const { text } = req.body;

  if (!text) throw new ApiError(400, "Text is missing. Text is required.");
  if (!postId) throw new ApiError(400, "Post id is missing. Post is required.");

  const post = await Post.findById(postId);

  const comment = await Comment.create({
    text,
    author: userWhoComments,
    post: postId,
  });

  await comment.populate({
    path: "author",
    select: "username profilePicture",
  });
  await post.comments.push(comment._id);
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { comment }, "Comment added successfully !"));
});

const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const postComments = await Comment.find({ post: postId }).populate(
    "author",
    "profilePicture username"
  );

  if (!postComments)
    throw new ApiError(404, "No comment found related to this post.");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { postComments },
        "Post comments fetched successfully !"
      )
    );
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "No post found.");

  if (post.author.toString() !== userId.toString())
    throw new ApiError(403, "Unauthorized access.");

  await Post.findByIdAndDelete(postId);
  await Comment.deleteMany({ post: postId });

  const user = await User.findById(userId);
  user.posts = user.posts.filter((pId) => pId.toString() !== postId.toString());
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Post deleted successfully !"));
});

const addBookmarkToPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found.");

  const user = await User.findById(userId);
  if (user.bookmarks.includes(postId)) {
    await user.updateOne({ $pull: { bookmarks: post._id } });
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Bookmark removed successfully !"));
  } else {
    await user.updateOne({ $addToSet: { bookmarks: post._id } });
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Bookmark added successfully !"));
  }
});
export {
  addPost,
  getAllPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  getPostComments,
  deletePost,
  addBookmarkToPost,
};
