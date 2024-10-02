import { Loader2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { RiUserUnfollowFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { apiVars } from "@/constants/apiVars";
import { toast } from "sonner";
import { deletePost, setPosts } from "@/store/features/postSlice";
import { usePostContext } from "@/hooks/usePost/usePostContext";

const PostAuthorSection = ({ post }) => {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const { deletePostIsLoading, setDeletePostIsLoading } = usePostContext();

  const deletePostHandler = async () => {
    try {
      setDeletePostIsLoading(true);
      const response = await fetch(
        `${apiVars.baseUrl}/${apiVars.postsUrl}/delete-post/${post?._id}`,
        {
          method: "Post",
          credentials: "include",
        }
      );

      if (response?.ok) {
        dispatch(deletePost(post?._id));
        const result = await response.json();
        if (result?.success) {
          toast.success("Post deleted completely !");
          console.log(result);
        }
      }
    } catch (error) {
      toast.error("Post did not delete.");
    } finally {
      setDeletePostIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage src={post?.author?.profilePicture} alt="profile-image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2 className="font-bold text-black text-lg">
          {post?.author?.username}
        </h2>
      </div>
      <Dialog>
        <DialogTrigger>
          <MoreHorizontal className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center justify-center">
          <Button
            variant="destructive"
            className="w-full font-bold cursor-pointer px-10 py-2 text-white rounded-[5px] bg-green-500 hover:bg-blue-500 transition duration-300"
          >
            Add to Favorites <MdFavorite className="size-5 ml-2" />
          </Button>

          {user &&
            user?.data &&
            user?.data?._id === post?.author?._id &&
            (deletePostIsLoading ? (
              <Button
                variant="destructive"
                className="w-full text-white font-bold cursor-pointer px-10 py-2 bg-green-500 hover:bg-red-500 transition duration-300 rounded-[5px]"
              >
                <Loader2 className="mr-2 size-4 animate-spin" /> Deleting Post
              </Button>
            ) : (
              <Button
                onClick={deletePostHandler}
                variant="destructive"
                className="w-full text-white font-bold cursor-pointer px-10 py-2 bg-green-500 hover:bg-red-500 transition duration-300 rounded-[5px]"
              >
                Delete Post <MdDelete className="size-5 ml-2" />
              </Button>
            ))}
          <Button
            variant="destructive"
            className="w-full text-white font-bold cursor-pointer px-10 py-2 bg-green-500 hover:bg-red-500 transition duration-300 rounded-[5px]"
          >
            Unfollow <RiUserUnfollowFill className="size-5 ml-2" />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostAuthorSection;
