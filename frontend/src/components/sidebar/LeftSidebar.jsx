import { assets } from "@/assets/assets";
import { useAuthContext } from "@/hooks/useAuth/useAuthContext";
import { useSelector } from "react-redux";
import CreatePost from "../createPost/CreatePost";
import profile from "../../assets/profile.png";
import { FaHome } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineTrendingUp } from "react-icons/md";
import { HiOutlineChat } from "react-icons/hi";
import { TbBellRinging } from "react-icons/tb";
import { IoAddOutline } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import { usePostContext } from "@/hooks/usePost/usePostContext";
import { useNavigate } from "react-router-dom";

const leftSidebarItems = [
  {
    text: "Home",
    icon: <FaHome size={23} color="#ac903d" />,
  },
  {
    text: "Search",
    icon: <IoMdSearch size={23} color="#ac903d" />,
  },
  {
    text: "Trending",
    icon: <MdOutlineTrendingUp size={23} color="#ac903d" />,
  },
  {
    text: "Messages",
    icon: <HiOutlineChat size={23} color="#ac903d" />,
  },
  {
    text: "Notifications",
    icon: <TbBellRinging size={23} color="#ac903d" />,
  },
  {
    text: "Create",
    icon: <IoAddOutline size={23} color="#ac903d" />,
  },
];

const LeftSidebar = () => {
  const { authSubmitHandler } = useAuthContext();
  const { setCreatePostOpen } = usePostContext();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <nav className="fixed w-72 min-w-72 top-0 z-20 border-r h-screen px-4 bg-[#ac903d] text-white flex-shrink-0">
      <div className="w-36 h-28 pt-10 pl-2">
        <img src={assets.logo} alt="logo" className="w-full object-cover" />
      </div>
      <ul className="flex flex-col gap-1">
        {leftSidebarItems.map((item, i) => {
          return (
            <li
              onClick={() => {
                if (item.text === "Create") {
                  setCreatePostOpen(true);
                }
              }}
              key={i}
              className="hover:ring-1 hover:ring-yellow-700 hover:rounded-xl hover:shadow-lg hover:shadow-yellow-700"
            >
              <div className="relative rounded-lg flex gap-3 p-3 cursor-pointer items-center">
                <div className="rounded-full size-10 bg-white flex justify-center items-center">
                  {item.icon}
                </div>
                <p>{item.text}</p>
              </div>
            </li>
          );
        })}

        <li
          key={6}
          className="hover:ring-1 hover:ring-yellow-700 hover:rounded-xl hover:shadow-lg hover:shadow-yellow-700"
        >
          <div className="relative rounded-lg flex gap-3 p-3 cursor-pointer items-center">
            <img
              src={user?.data?.profilePicture || profile}
              alt="profile-picture"
              className="size-10"
            />
            <p>Profile</p>
          </div>
        </li>

        <li
          key={7}
          onClick={(event) => {
            authSubmitHandler(event, "Logout");
            navigate("/auth/login");
          }}
          className="hover:ring-1 hover:ring-yellow-700 hover:rounded-xl hover:shadow-lg hover:shadow-yellow-700"
        >
          <div className="relative rounded-lg flex gap-3 p-3 cursor-pointer items-center">
            <div>
              <div className="rounded-full size-10 bg-white flex justify-center items-center">
                <BiLogOutCircle size={24} color="#d55844" className="mr-1" />
              </div>
            </div>
            <p>Logout</p>
          </div>
        </li>
        <CreatePost />
      </ul>
    </nav>
  );
};

export default LeftSidebar;
