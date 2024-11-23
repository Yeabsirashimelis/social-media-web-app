import { getFollowersFollowingCount } from "@/services/ProfileApi";
import { useQuery } from "@tanstack/react-query";

function ProfileFollowsCount({ username }) {
  const { data, isLoading, error } = useQuery({
    queryFn: () => getFollowersFollowingCount(username),
    queryKey: ["followersFollowingCount", username],
  });
  console.log(data);
  if (isLoading) return <p className="m-4 text-lg mb-8">...</p>;
  if (error) return <p className="m-4 text-lg mb-8">...</p>;

  return (
    <div className="m-4 mb-8 font-bold text-lg text-[#585555]">
      <p>
        {data?.followersCount}
        <span className="hover:underline hover:text-gray-100 transition-all duration-300">
          followers
        </span>
      </p>
    </div>
  );
}

export default ProfileFollowsCount;
