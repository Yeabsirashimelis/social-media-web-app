import { useParams } from "next/navigation";
import Spinner from "./Spinner";
import ThreadCard from "./ThreadCard";

function CommunityPosts({ threads }) {
  const { inviteLink } = useParams;

  return (
    <div className="min-h-screen grid grid-cols-1 py-4 mx-auto gap-6">
      {threads.map((thread) => (
        <ThreadCard thread={thread} key={thread._id} />
      ))}
    </div>
  );
}

export default CommunityPosts;
