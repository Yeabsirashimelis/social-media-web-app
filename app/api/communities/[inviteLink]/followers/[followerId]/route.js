import connectDB from "@/config/database";
import Community from "@/models/community";
import CommunityFollow from "@/models/communityFollow";

// DELETE /api/communities/inviteLink/followers/[followerId]
export const DELETE = async function (request, { params }) {
  try {
    await connectDB();

    const { inviteLink, followerId } = params;
    console.log("params: ", { inviteLink, followerId });

    // Find the community using the invite link
    const community = await Community.findOne({ inviteLink: inviteLink });
    if (!community) return new Response("Community not found", { status: 404 });

    // Find the follower in the community
    const follower = await CommunityFollow.findOne({
      userId: followerId,
      communityId: community._id,
    });

    if (!follower) {
      return new Response("Follower not found or not part of this community", {
        status: 404,
      });
    }

    const userToRemove = await CommunityFollow.findOneAndDelete({
      userId: followerId,
    });

    return new Response(JSON.stringify(userToRemove), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
