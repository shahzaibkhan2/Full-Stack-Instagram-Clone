import { httpOptions } from "../constants.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// Generate Access Token
const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went wrong while generating access and refresh token !"
    );
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw new ApiError(
      401,
      "Some fields are missing. All fields are required."
    );
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    throw new ApiError(
      401,
      "User with this email address already exists. Please try other email address."
    );
  }

  const createdUser = await User.create({
    username,
    email,
    password,
  });

  if (!createdUser) {
    throw new ApiError(
      500,
      "Internal server error and user could not be created."
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Registeration successful !"));
});

// Login User

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    throw new ApiError(
      401,
      "Some fields are missing. All fields are required."
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordChecked = await user.isPasswordCorrect(password);

  if (!isPasswordChecked) {
    throw new ApiError(
      401,
      "Invalid password. Please provide a correct password."
    );
  }

  const { accessToken } = await generateAccessToken(user._id);

  if (!accessToken) {
    throw new ApiError(
      500,
      "Access token could not be created due to internal server error."
    );
  }

  const populatedPosts = await Promise.all(
    user.posts.map(async (postId) => {
      const post = await Post.findById(postId);

      if (post.author.equals(user._id)) {
        return post;
      } else {
        return null;
      }
    })
  );

  const frontendData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    following: user.following,
    followers: user.followers,
    posts: populatedPosts,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, httpOptions)
    .json(
      new ApiResponse(
        200,
        frontendData,
        `Login successful ! Welcome ${user.username}`
      )
    );
});

// Logout User
const logoutUser = asyncHandler(async (_, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully !"));
});

// Get Profile

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(401, "Invalid id. Please provide a valid id.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Successfully got the user."));
});

// Update User Profile

const updateUserProfile = asyncHandler(async (req, res) => {
  const { biography, gender } = req.body;
  const userId = req.user._id;
  const profilePicture = req.file;

  if (!biography || !gender || !profilePicture) {
    throw new ApiError(401, "All fields are required.");
  }

  const profilePictureUri = getDataUri(profilePicture);

  const cloudinaryResponse = await uploadOnCloudinary(profilePictureUri);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Sorry for internal server error.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      biography,
      gender,
      profilePicture: cloudinaryResponse.secure_url,
    },
    {
      new: true,
    }
  ).select("-password");

  if (!user) {
    throw new ApiError(401, "Sorry ! no user found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, { user }, "User updated successfully !"));
});

// Get List of Suggested Users

const getSuggestedUsers = asyncHandler(async (req, res) => {
  const id = req.user_id;

  const suggestedUser = await User.find({ _id: { $ne: id } }).select(
    "-password"
  );

  if (!suggestedUser) {
    throw new ApiError(500, "Sorry ! Internal server error.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users: suggestedUser },
        "All users fetched successfully !"
      )
    );
});

// Follow or Unfollow User

const followOrUnfollowUser = asyncHandler(async (req, res) => {
  const following = req.user._id;
  const { followed } = req.params;

  if (!followed || !following) {
    throw new ApiError(401, "All fields are required.");
  }

  if (following === followed) {
    throw new ApiError(
      401,
      "Sorry ! You cannot follow or unfollow yourself :)"
    );
  }

  const followingUser = await User.findById(following);
  const followedUser = await User.findById(followed);

  if (!followingUser || !followedUser) {
    throw new ApiError(
      401,
      "Sorry ! Invalid user id. Please provide a valid user id."
    );
  }

  const isFollowing = await followingUser.following.includes(followedUser);

  if (isFollowing) {
    await Promise.all([
      User.findByIdAndUpdate(
        { _id: followingUser._id },
        { $pull: { following: followedUser._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        { _id: followedUser._id },
        { $pull: { followers: followingUser._id } },
        { new: true }
      ),
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, "User unfollowed successfully !"));
  } else {
    await Promise.all([
      User.findByIdAndUpdate(
        { _id: followingUser._id },
        { $push: { following: followedUser._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        { _id: followedUser._id },
        { $push: { followers: followingUser._id } },
        { new: true }
      ),
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, "User followed successfully !"));
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  followOrUnfollowUser,
  getSuggestedUsers,
};
