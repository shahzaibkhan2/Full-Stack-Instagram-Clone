import ReactSection from "./ReactSection";
import Likes from "./Likes";
import CommentSection from "./CommentSection";
import { usePostContext } from "@/hooks/usePost/usePostContext";
import PostAuthorSection from "./PostAuthorSection";
import { useCallback, useState } from "react";
import { apiVars } from "@/constants/apiVars";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/features/postSlice";
import debounce from "lodash/debounce";

const Post = ({ post }) => {
  const { commentInput, commentInputOnChange, setCommentInput } =
    usePostContext();
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(
    user?.likes?.includes(user?._id) || false
  );
  const [postLikesCount, setPostLikesCount] = useState(post.likes.length);
  const [comments, setComments] = useState(post?.comments);

  const likeDislikePostHandler = async () => {
    const action = isLiked ? "dislike-post" : "like-post";

    try {
      const response = await fetch(
        `${apiVars.baseUrl}/${apiVars.postsUrl}/${post?._id}/${action}`,
        {
          method: "Get",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPostLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
          setIsLiked((prev) => !prev);

          const updatedPosts = posts.map((eachPost) =>
            eachPost?._id === post._id
              ? {
                  ...eachPost,
                  likes: isLiked
                    ? eachPost.likes.filter((likeId) => likeId !== user?._id)
                    : [...eachPost.likes, user?._id],
                }
              : eachPost
          );

          dispatch(setPosts(updatedPosts));
          toast.success(data.message);
        } else {
          toast.error("Post like or dislike failed.");
        }
      } else {
        toast.error("Post like or dislike failed.");
      }
    } catch (error) {
      toast.success("Post like or dislike failed.");
    }
  };

  const postCommentHandler = async () => {
    try {
      const response = await fetch(
        `${apiVars.baseUrl}/${apiVars.postsUrl}/${post?._id}/add-comment`,
        {
          method: "Post",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: commentInput }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedPostComments = [...comments, data.comment];
          setComments(updatedPostComments);
          const updatedPosts = posts.map((eachPost) =>
            eachPost?._id === post._id
              ? { ...eachPost, comments: updatedPostComments }
              : eachPost
          );

          dispatch(setPosts(updatedPosts));
          toast.success(data.message);
          setCommentInput("");
        } else {
          toast.error("Post comment failed.");
        }
      } else {
        toast.error("Post comment failed.");
      }
    } catch (error) {
      toast.success("Post comment failed.");
    }
  };

  // Debounce the likeDislikePostHandler using lodash's debounce
  const debouncedLikeDislikeHandler = useCallback(
    debounce(likeDislikePostHandler, 500),
    [isLiked, postLikesCount]
  );

  const debouncedPostCommentHandler = useCallback(
    debounce(postCommentHandler, 500),
    []
  );

  return (
    <article className="mx-auto my-14">
      <PostAuthorSection post={post} />
      <div className="object-cover mt-6 rounded-[5px]">
        <img
          src={post?.image}
          alt="post-image"
          className="aspect-square object-cover w-full rounded-[5px]"
        />
        <ReactSection
          debouncedLikeDislikeHandler={debouncedLikeDislikeHandler}
          isLiked={isLiked}
          post={post}
        />
        <Likes
          post={post}
          postLikesCount={postLikesCount}
          comments={comments}
        />
        <CommentSection />
        <div className="relative">
          <input
            onChange={commentInputOnChange}
            type="text"
            value={commentInput}
            placeholder="Add a comment"
            className="focus:outline-gold w-full text-sm p-2 rounded-[10px]"
          />
          {commentInput && (
            <span
              onClick={debouncedPostCommentHandler}
              className="text-blue-400 font-bold absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default Post;
