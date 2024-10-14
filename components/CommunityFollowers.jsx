import { getFollowers } from "@/services/communityApi";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import Error from "../components/Error";
import CommunityFollower from "./CommunityFollower";
import ControlFollowers from "./ControlFollowers";

function CommunityFollowers({ inviteLink }) {
  const { data, isLoading, error } = useQuery({
    queryFn: () => getFollowers(inviteLink),
    queryKey: ["followers", inviteLink],
  });
  // State to track followers with their roles
  const [followers, setFollowers] = useState(data || []);

  useEffect(() => {
    if (data) {
      setFollowers(data);
    }
  }, [data]);

  // State to track which follower is selected for controls
  const [selectedFollower, setSelectedFollower] = useState(null);

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  // Toggle the control panel for the selected follower
  const toggleControlPanel = (followerId) => {
    if (selectedFollower === followerId) {
      // If clicked again, close the panel
      setSelectedFollower(null);
    } else {
      setSelectedFollower(followerId);
    }
  };

  // Update followers state to reflect promoted or demoted follower
  const promoteFollower = (followerId) => {
    setFollowers((prevFollowers) =>
      prevFollowers.map((follower) =>
        follower.userId._id === followerId
          ? { ...follower, isAdmin: !follower.isAdmin } // Toggle isAdmin status
          : follower
      )
    );
    setSelectedFollower(null);
  };

  const onRemoveFollower = (followerId) => {
    setFollowers((prevFollowers) =>
      prevFollowers.filter((follower) => follower.userId._id !== followerId)
    );
    setSelectedFollower(null);
  };

  if (!followers.length)
    return (
      <p className="mt-4 text-center font-semibold">
        the community has no follower yet.
      </p>
    );

  return (
    <div className="mt-4">
      {followers.map((followerData, idx) => (
        <div key={idx} className="relative">
          <CommunityFollower
            follower={followerData.userId} //this contains the whole user data, not only the id (it is just population name)
            isAdmin={followerData.isAdmin}
            onClick={() => toggleControlPanel(followerData.userId._id)}
          />
          {selectedFollower === followerData.userId._id && (
            <ControlFollowers
              follower={selectedFollower}
              isAdmin={followerData.isAdmin}
              inviteLink={inviteLink}
              onPromote={promoteFollower}
              onRemove={onRemoveFollower}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CommunityFollowers;
