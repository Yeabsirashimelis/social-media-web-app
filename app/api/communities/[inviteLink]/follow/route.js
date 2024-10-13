import connectDB from "@/config/database";
import Community from "@/models/community";
import CommunityFollow from "@/models/communityFollow";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/community/inviteLink/follow - to check if the session user follows the current community
export const GET = async function (request, { params }) {
  try {
    await connectDB();
    const { userId } = await getSessionUser(); // current user's ID from session
    const inviteLink = params.inviteLink; // the inviteLink of the community to check

    const community = await Community.findOne({ inviteLink });
    if (!community) return new Response("Community not found", { status: 404 });

    const communityFollowStatus = await CommunityFollow.findOne({
      userId,
      communityId: community._id,
    });

    if (communityFollowStatus) {
      return new Response(JSON.stringify({ followed: true }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ followed: false }), { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/community/inviteLink/follow - to follow a community
export const POST = async function (request, { params }) {
  try {
    await connectDB();
    const { userId } = await getSessionUser(); // current user's ID from session
    const inviteLink = params.inviteLink; // the inviteLink of the community to follow

    // Find the community being followed based on the inviteLink
    const community = await Community.findOne({ inviteLink });
    console.log("userId : ", userId);
    if (!community) {
      return new Response("Community not found", { status: 404 });
    }

    // Check if the user is already following the community
    const isAlreadyFollowing = await CommunityFollow.findOne({
      userId,
      communityId: community._id,
    });

    if (isAlreadyFollowing) {
      // If the user is already following, unfollow the community
      await CommunityFollow.findOneAndDelete({
        userId,
        communityId: community._id,
      });
      return new Response("Unfollowed community successfully", { status: 200 });
    }

    // Create a new follow document
    const communityFollow = new CommunityFollow({
      userId,
      communityId: community._id,
    });

    await communityFollow.save(); // Save the follow document

    return new Response("Followed community successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
