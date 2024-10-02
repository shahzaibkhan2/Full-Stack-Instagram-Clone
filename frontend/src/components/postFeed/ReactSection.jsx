import { FaRegHeart } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { LuSend } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa6";
import { usePostContext } from "@/hooks/usePost/usePostContext";
import { useDispatch } from "react-redux";
import { setSelectedPost } from "@/store/features/postSlice";

const ReactSection = ({ debouncedLikeDislikeHandler, isLiked, post }) => {
  const { setCommentOpen } = usePostContext();
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center my-4">
      <div className="flex gap-6 items-center">
        {isLiked ? (
          <FaRegHeart
            onClick={debouncedLikeDislikeHandler}
            size={24}
            className="text-red-500 hover:text-red-300 transition duration-300 cursor-pointer"
          />
        ) : (
          <FaRegHeart
            onClick={debouncedLikeDislikeHandler}
            size={24}
            className="hover:text-gray-500 transition duration-300 cursor-pointer"
          />
        )}
        <LuMessageCircle
          onClick={() => {
            dispatch(setSelectedPost(post));
            setCommentOpen(true);
          }}
          size={24}
          className="hover:text-gray-500 transition duration-300 cursor-pointer"
        />
        <LuSend
          size={24}
          className="hover:text-gray-500 transition duration-300 cursor-pointer"
        />
      </div>
      <FaRegBookmark
        size={24}
        className="hover:text-gray-500 transition duration-300 cursor-pointer"
      />
    </div>
  );
};

export default ReactSection;
