import connectDB from "@/config/database";
import Follows from "@/models/follows";
import User from "@/models/user";

//GET /api/profile/username/followers-following-count
export const GET = async function (request, { params }) {
  try {
    await connectDB();
    const { username } = params;
    const user = await User.findOne({ username: username });
    if (!user) {
      return new Response("user not found", { status: 404 });
    }

    let numOfFollowers;
    let numOfFollowing;

    const followData = await Follows.findOne({ userId: user._id });
    if (!followData) {
      numOfFollowers = 0;
      numOfFollowing = 0;
    }

    if (followData) {
      numOfFollowers = followData.followers.length;
      numOfFollowing = followData.following.length;
    }

    return new Response(
      JSON.stringify({
        followersCount: numOfFollowers,
        followingCount: numOfFollowing,
      })
    );
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
