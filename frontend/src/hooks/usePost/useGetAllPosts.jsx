import { apiVars } from "@/constants/apiVars";
import { setPosts } from "@/store/features/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(
          `${apiVars.baseUrl}/${apiVars.postsUrl}/get-all-posts`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            dispatch(setPosts(data.data.posts));
            toast.success("Posts fetched successfully !");
          } else {
            toast.error("Posts did not fetch.");
          }
        } else {
          toast.error("Posts did not fetch.");
        }
      } catch (error) {
        toast.error(error.message || "Posts did not fetch.");
      }
    };
    fetchAllPosts();
  }, []);
};

export default useGetAllPosts;
