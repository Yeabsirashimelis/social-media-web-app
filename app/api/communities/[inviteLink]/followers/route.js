import connectDB from "@/config/database";
import Community from "@/models/community";
import CommunityFollow from "@/models/communityFollow";

// GET /api/community/inviteLink/followers - to fetch the followers of a community
export const GET = async function (request, { params }) {
  try {
    await connectDB();
    const { inviteLink } = params;

    const community = await Community.findOne({ inviteLink: inviteLink });
    if (!community) return new Response("Community not found", { status: 404 });

    const followers = await CommunityFollow.find({
      communityId: community._id,
    }).populate("userId", "name username profilePicture");

    return new Response(JSON.stringify(followers), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
