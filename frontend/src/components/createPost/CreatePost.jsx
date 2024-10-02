import { usePostContext } from "@/hooks/usePost/usePostContext";
import {
  DialogContentThree,
  DialogDescription,
  DialogHeader,
  DialogThree,
  DialogTitle,
} from "../ui/dialogThree";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const {
    createPostHandler,
    createPostOpen,
    setCreatePostOpen,
    createPostImageRef,
    imageFileOnChangeHandler,
    createPostImagePreview,
    createPostIsLoading,
    setCreatePostCaption,
    createPostCaption,
  } = usePostContext();
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogThree open={createPostOpen}>
      <DialogContentThree
        onInteractOutside={() => setCreatePostOpen(false)}
        className="flex flex-col gap-2"
      >
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-[#ac903d] text-2xl -mt-3 mb-3">
            Create Post
          </DialogTitle>
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage
                src={user?.data?.profilePicture}
                alt="profile-image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">{user?.data?.username}</h1>
              <DialogDescription>
                Bio section to write something
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form>
          <Textarea
            value={createPostCaption}
            onChange={(event) => setCreatePostCaption(event.target.value)}
            className="resize-none text-sm  border-none focus-visible:ring-[#ac903d] rounded-xl"
            placeholder="Write a caption"
          />
          {createPostImagePreview && (
            <div className="size-full p-4 flex justify-center items-center rounded-[10px] mt-2">
              <img
                src={createPostImagePreview}
                alt="your-image"
                className="size-full object-cover rounded-[10px]"
              />
            </div>
          )}

          <input
            ref={createPostImageRef}
            type="file"
            className="hidden"
            onChange={imageFileOnChangeHandler}
          />
        </form>
        <Button
          onClick={async () => await createPostImageRef.current.click()}
          className="rounded-xl w-[180px] mx-auto bg-gold hover:bg-hoverBtn transition duration-300"
        >
          Choose File
        </Button>
        {createPostImagePreview &&
          (createPostIsLoading ? (
            <Button className="py-4 rounded-xl w-[180px] mx-auto">
              <Loader2 className="size-4 animate-spin mr-2" />
              Posting...
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="py-4 w-[180px] rounded-xl mx-auto"
            >
              Post
            </Button>
          ))}
      </DialogContentThree>
    </DialogThree>
  );
};

export default CreatePost;
