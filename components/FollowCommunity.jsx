import {
  checkIfCommunityFollowed,
  followCommunity,
} from "@/services/communityApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SmallSpinner from "./SmallSpinner";

function FollowCommunity({ inviteLink }) {
  const queryClient = useQueryClient();

  const {
    data: followStatus,
    isFetching: isCheckingFollowStatus,
    error: checkFollowError,
  } = useQuery({
    queryFn: () => checkIfCommunityFollowed(inviteLink),
    queryKey: ["followStatusOfCommunity", inviteLink],
    placeholderData: { followed: false }, // Default to not followed
  });

  const {
    mutate: mutateFollow,
    isPending: isFollowing,
    error: followError,
  } = useMutation({
    mutationFn: followCommunity,
    onSuccess: () => {
      // Invalidate the query to refetch follow status
      queryClient.invalidateQueries(["followStatusOfCommunity", inviteLink]);
    },
    onError: () => {
      // Optionally, you can handle errors here
    },
  });

  console.log("status:", isCheckingFollowStatus);
  console.log(isFollowing);

  function handleSubmit() {
    mutateFollow(inviteLink);
  }

  return (
    <div className="shadow-lg z-10 pt-1 border-t flex justify-center">
      <button
        className={`text-black hover:text-[rgb(26,26,26)] 
            ${
              followStatus?.followed
                ? "bg-[#1a1a1a] hover:text-red-600  text-gray-100"
                : "bg-white"
            } 
            font-semibold px-2 py-2 transition-colors duration-200 rounded-lg outline-none`}
        onClick={handleSubmit}
        disabled={isFollowing || isCheckingFollowStatus}
      >
        {(isFollowing || isCheckingFollowStatus) && <SmallSpinner />}
        {!isFollowing &&
          !isCheckingFollowStatus &&
          followStatus?.followed &&
          "Unsubscribe"}
        {!isFollowing &&
          !isCheckingFollowStatus &&
          !followStatus?.followed &&
          "Subscribe"}
      </button>

      {checkFollowError && (
        <p className="text-red-500">
          {checkFollowError.message || "Error checking follow status"}
        </p>
      )}

      {followError && (
        <p className="text-red-500">
          {followError.message || "Error subscribing to the community"}
        </p>
      )}
    </div>
  );
}

export default FollowCommunity;
