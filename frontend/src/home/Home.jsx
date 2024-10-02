import PostsFeed from "@/components/postFeed/PostsFeed";
import RightSidebar from "@/components/rightSidebar/RightSidebar";
import PostContextProvider from "@/context/PostContext";

const Home = () => {
  return (
    <main className="ml-72 bg-gray-200 grid grid-cols-3">
      <PostContextProvider>
        <PostsFeed />
      </PostContextProvider>
      <RightSidebar />
    </main>
  );
};

export default Home;
