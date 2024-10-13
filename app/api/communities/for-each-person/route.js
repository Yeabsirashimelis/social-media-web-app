import connectDB from "@/config/database";
import Community from "@/models/community";
import CommunityFollow from "@/models/communityFollow";
import { getSessionUser } from "@/utils/getSessionUser";

// GET api/communities/username
export const GET = async function (request) {
  try {
    await connectDB();
    const { userId } = await getSessionUser();
    if (!userId) {
      return new Response("unauthorized", { status: 401 });
    }

    // find communities where the user is the owner, an admin, or follows the community
    const filter = {
      $or: [
        { owner: userId }, // Check if the user is the owner
        { admins: { $in: [userId] } }, // Check if the user is an admin
        {
          _id: {
            $in: (
              await CommunityFollow.find({ userId }).select("communityId")
            ).map((follow) => follow.communityId),
          }, // Check if the user follows the community
        },
      ],
    };

    const communities = await Community.find(filter);

    return new Response(JSON.stringify(communities), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
