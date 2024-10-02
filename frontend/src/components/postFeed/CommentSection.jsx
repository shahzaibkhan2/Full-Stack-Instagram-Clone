import { DialogTwo, DialogContentTwo } from "../ui/dialogTwo";
import { Dialog, DialogContent } from "../ui/dialog";
import { usePostContext } from "@/hooks/usePost/usePostContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "../ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import Comments from "./Comments";

const CommentSection = () => {
  const {
    commentOpen,
    setCommentOpen,
    sendCommentInput,
    sendCommentInputOnChangeHandler,
    debouncedSendPostCommentHandler,
    sendCommentRef,
    comments,
  } = usePostContext();
  const { selectedPost } = useSelector((state) => state.post);

  return (
    <DialogTwo open={commentOpen}>
      <DialogContentTwo
        commentOpen={commentOpen}
        setCommentOpen={setCommentOpen}
        className="flex flex-col max-w-5xl p-0 rounded-l-lg"
      >
        <div className="flex flex-1">
          <section className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post-image"
              className="size-full object-cover rounded-[5px]"
            />
          </section>
          <section className="flex w-1/2 justify-between flex-col">
            <div className="flex items-center p-4 justify-between">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      alt="profile-image"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-xs font-semibold">
                    {selectedPost?.author?.username}
                  </Link>
                  <p className="text-sm text-gray-600 max-w-98">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Deserunt esse doloribus omnis similique quisquam voluptatem.
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild className="relative">
                    <MoreHorizontal className="absolute -top-[32px] size-12 right-8 cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex items-center justify-center flex-col">
                    <div className="border-b-2 w-full hover:bg-red-500 hover:text-white px-1 py-2 rounded-[5px] transition duration-300 text-center font-semibold cursor-pointer">
                      <p>Unfollow</p>
                    </div>
                    <div className="border-b-2 w-full hover:bg-green-500 hover:text-white px-1 py-2 rounded-[5px] transition duration-300 text-center font-semibold cursor-pointer">
                      <p>Add to favorites</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="p-4 flex-1 max-h-96 overflow-y-auto">
              {comments?.map((eachComment, index) => (
                <Comments key={index} eachComment={eachComment} />
              ))}
            </div>

            <div className="p-4">
              <div className="relative">
                <input
                  ref={sendCommentRef}
                  value={sendCommentInput}
                  onChange={sendCommentInputOnChangeHandler}
                  type="text"
                  placeholder="Add a comment"
                  className="focus:outline-gold w-full text-sm p-2 rounded-[10px]"
                />

                <button
                  disabled={!sendCommentInput.trim()}
                  onClick={debouncedSendPostCommentHandler}
                  className={`font-bold absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    sendCommentInput.trim()
                      ? "text-blue-400 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </section>
        </div>
      </DialogContentTwo>
    </DialogTwo>
  );
};

export default CommentSection;
