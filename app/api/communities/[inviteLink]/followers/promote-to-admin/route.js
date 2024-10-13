import connectDB from "@/config/database";
import Community from "@/models/community";
import CommunityFollow from "@/models/communityFollow";

// PUT /api/communities/inviteLink/followers/promote-or-demote
export const PUT = async function (request, { params }) {
  try {
    await connectDB();

    const { inviteLink } = params;
    const formData = await request.formData();
    const followerId = formData.get("followerId");

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

    // Determine the new admin status
    const newAdminStatus = !follower.isAdmin; // Toggle isAdmin

    // Update the follower's isAdmin status
    const updatedFollower = await CommunityFollow.findOneAndUpdate(
      { userId: followerId, communityId: community._id },
      { isAdmin: newAdminStatus }, // Set new admin status
      { new: true }
    );

    return new Response(JSON.stringify(updatedFollower), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
