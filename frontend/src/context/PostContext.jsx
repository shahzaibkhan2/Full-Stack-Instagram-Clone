import { apiVars } from "@/constants/apiVars";
import useGetAllPosts from "@/hooks/usePost/useGetAllPosts";
import { readFileAsDataURL } from "@/lib/utils";
import { setPosts, setSelectedPost } from "@/store/features/postSlice";
import { debounce } from "lodash";
import { createContext, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const PostContext = createContext(null);

const PostContextProvider = ({ children }) => {
  const { posts, selectedPost } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // <---------------- States ------------------>
  const [commentInput, setCommentInput] = useState("");
  const [sendCommentInput, setSendCommentInput] = useState("");
  const [commentOpen, setCommentOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [comments, setComments] = useState(selectedPost?.comments);

  // Create Post States
  const [createPostImageFile, setCreatePostImageFile] = useState("");
  const [createPostCaption, setCreatePostCaption] = useState("");
  const [createPostImagePreview, setCreatePostImagePreview] = useState("");
  const [createPostIsLoading, setCreatePostIsLoading] = useState(false);
  const [openAuthorDialog, setOpenAuthorDialog] = useState(false);
  const [deletePostIsLoading, setDeletePostIsLoading] = useState(false);

  // <---------------- useRefs ------------------>

  // Create Post Refs
  const createPostImageRef = useRef();
  const sendCommentRef = useRef();

  // <---------------- Handlers and Functions ------------------>

  const commentInputOnChange = (event) => {
    const commmentInputValue = event.target.value;
    if (commmentInputValue.trim()) {
      setCommentInput(commmentInputValue);
    } else {
      setCommentInput("");
    }
  };

  const sendCommentInputOnChangeHandler = (event) => {
    const sendCommmentInputValue = event.target.value;
    if (sendCommmentInputValue.trim()) {
      setSendCommentInput(sendCommmentInputValue);
    } else {
      setSendCommentInput("");
    }
  };

  const submitCommentInputHandler = async (event) => {
    console.log("commented successfully !");
  };

  // Create Post

  const createPostHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("caption", createPostCaption);
    if (createPostImagePreview) formData.append("image", createPostImageFile);

    try {
      setCreatePostIsLoading(true);
      const response = await fetch(
        `${apiVars.baseUrl}/${apiVars.postsUrl}/add-post`,

        {
          method: "POST",
          credentials: "include",
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("Posted successfully !");
          dispatch(setPosts([data.data.post, ...posts]));
          setCreatePostOpen(false);
        } else {
          toast.error("Post failed.");
        }
      } else {
        toast.error("Post failed.");
      }
    } catch (error) {
      console.log(error, "Post failed.");
    } finally {
      setCreatePostIsLoading(false);
    }
  };

  const imageFileOnChangeHandler = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setCreatePostImageFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setCreatePostImagePreview(dataUrl);
    }
  };

  // Send Post Comments

  const sendPostCommentHandler = async () => {
    let textData = sendCommentRef.current.value;
    try {
      const response = await fetch(
        `${apiVars.baseUrl}/${apiVars.postsUrl}/${selectedPost?._id}/add-comment`,
        {
          method: "Post",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: textData }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedPostComments = [comments, data.comment];
          setSendCommentInput(updatedPostComments);
          const updatedPosts = posts.map((eachPost) =>
            eachPost?._id === selectedPost?._id
              ? { ...eachPost, comments: updatedPostComments }
              : eachPost
          );
          setComments(updatedPostComments);

          dispatch(setPosts(updatedPosts));
          toast.success(data.message);
          sendCommentRef.current.value = "";
          setSendCommentInput("");
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

  const debouncedSendPostCommentHandler = useCallback(
    debounce(sendPostCommentHandler, 500),
    []
  );

  // <----------------------- useEffects ----------------------->

  useGetAllPosts();
  //   <---------------- Home Context Values --------->
  const postContextValues = {
    commentInput,
    setCommentInput,
    commentInputOnChange,
    commentOpen,
    setCommentOpen,
    sendCommentInput,
    setSendCommentInput,
    sendCommentInputOnChangeHandler,
    submitCommentInputHandler,
    createPostHandler,
    createPostOpen,
    setCreatePostOpen,
    createPostImageRef,
    imageFileOnChangeHandler,
    createPostImagePreview,
    createPostIsLoading,
    setCreatePostIsLoading,
    setCreatePostCaption,
    createPostCaption,
    openAuthorDialog,
    setOpenAuthorDialog,
    deletePostIsLoading,
    setDeletePostIsLoading,
    debouncedSendPostCommentHandler,
    sendCommentRef,
    comments,
  };
  return (
    <PostContext.Provider value={postContextValues}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
