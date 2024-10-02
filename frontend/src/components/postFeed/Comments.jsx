import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Comments = ({ eachComment }) => {
  return (
    <div className="flex gap-3 items-center">
      <Avatar className="flex items-center gap-3">
        <AvatarImage src={eachComment?.author?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h2 className="flex gap-3">
        {eachComment?.author?.username}
        <span className="ml-4">{eachComment?.text}</span>
      </h2>
    </div>
  );
};

export default Comments;
