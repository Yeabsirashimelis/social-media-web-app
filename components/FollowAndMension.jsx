"use client";
import { follow, unFollow } from "@/services/followsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function FollowAndMension({ username, isFollowing: initialIsFolllowing }) {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(initialIsFolllowing);

  const { mutate: mutateFollow, isPending: isFollowPending } = useMutation({
    mutationFn: follow,

    // Optionally, cancel outgoing queries for this user profile to avoid overwriting the optimistic update

    onMutate: async () => {
      setIsFollowing(true);

      // Optionally, cancel outgoing queries for this user profile to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ["profile"] });

      // Snapshot of previous value (optional)
      const previousData = queryClient.getQueryData(["profile"]);

      return { previousData };
    },

    onSuccess: () => {
      //i'll do something here
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },

    onError: (err, variables, context) => {
      //revert the optimistic update in case of an error
      setIsFollowing(context.previousData?.isFollowing);
      console.log("Error updating follow status", err);
    },
    onSettled: () => {
      // Refetch the profile data to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  ///UNFOLLOW
  const { mutate: mutateUnfollow, isPending: isUnfollowPending } = useMutation({
    mutationFn: unFollow,

    // Optionally, cancel outgoing queries for this user profile to avoid overwriting the optimistic update

    onMutate: async () => {
      setIsFollowing(false);

      // Optionally, cancel outgoing queries for this user profile to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ["profile"] });

      // Snapshot of previous value (optional)
      const previousData = queryClient.getQueryData(["profile"]);

      return { previousData };
    },

    onSuccess: () => {
      //i'll do something here
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },

    onError: (err, variables, context) => {
      //revert the optimistic update in case of an error
      setIsFollowing(context.previousData?.isFollowing);
      console.log("Error updating follow status", err);
    },
    onSettled: () => {
      // Refetch the profile data to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  function handleFollow() {
    mutateFollow(username);
  }

  function handleUnfollow() {
    mutateUnfollow(username);
  }

  return (
    <div className="grid grid-cols-2 my-4 mx-3 gap-4 ">
      {isFollowing ? (
        <button
          className="bg-black hover:text-gray-200 font-semibold px-1 py-2 border  rounded-lg"
          disabled={isUnfollowPending}
          onClick={handleUnfollow}
        >
          Following
        </button>
      ) : (
        <button
          className="text-black hover:text-[rgb(26,26,26)] bg-white
     font-semibold px-1 py-2 border rounded-lg"
          disabled={isFollowPending}
          onClick={handleFollow}
        >
          Follow
        </button>
      )}
      <button className="bg-black hover:text-gray-200 font-semibold px-1 py-2 border  rounded-lg">
        Mension
      </button>
    </div>
  );
}

export default FollowAndMension;
