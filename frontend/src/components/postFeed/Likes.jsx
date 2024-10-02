import { usePostContext } from "@/hooks/usePost/usePostContext";
import { setSelectedPost } from "@/store/features/postSlice";
import { useDispatch } from "react-redux";

const Likes = ({ post, postLikesCount, comments }) => {
  const { setCommentOpen } = usePostContext();
  const dispatch = useDispatch();
  return (
    <div className="text-gray-500 flex flex-col gap-2">
      <span className="block mb-2 font-bold">{postLikesCount} likes</span>
      <p className="text-gray-600">
        <span className="mr-2 font-medium text-black">
          {post.author.username}
        </span>{" "}
        {post.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setCommentOpen(true);
        }}
        className="text-gray-500 text-md mb-2 font-semibold cursor-pointer"
      >
        View all {comments.length} comments
      </span>
    </div>
  );
};

export default Likes;
