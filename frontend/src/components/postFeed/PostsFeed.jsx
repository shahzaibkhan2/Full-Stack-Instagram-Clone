import { useSelector } from "react-redux";
import Post from "./Post";

const PostsFeed = () => {
  const { posts } = useSelector((state) => state.post);
  return (
    <main className="flex flex-col items-center w-[70%] mx-auto col-span-2">
      <div className="flex flex-col w-full">
        {posts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </main>
  );
};

export default PostsFeed;
