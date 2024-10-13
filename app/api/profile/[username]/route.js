import connectDB from "@/config/database";
import Thread from "@/models/thread";
import User from "@/models/user";
import Comment from "@/models/comment";
import { getSessionUser } from "@/utils/getSessionUser";
import Follows from "@/models/follows";

// PUT /api/profile/username
export const GET = async function (request, { params }) {
  const { username } = params;
  console.log("username : ", username);
  try {
    await connectDB();
    const { userId: myId } = await getSessionUser();

    const user = await User.findOne({ username: username });
    if (!user) {
      return new Response("user not found", { status: 404 });
    }

    // Check if the current user is following this person
    const followData = await Follows.findOne({ userId: user._id });
    const isFollowing = followData && followData.followers.includes(myId);

    const threads = await Thread.find({ poster: user._id });

    // Count comments for each thread
    const threadsWithCommentCount = await Promise.all(
      threads.map(async (thread) => {
        const commentCount = await Comment.countDocuments({
          thread: thread._id,
        });
        return {
          ...thread.toObject(), // Convert Mongoose document to plain object
          commentsCount: commentCount, // Add comment count
        };
      })
    );

    return new Response(
      JSON.stringify({ user, threads: threadsWithCommentCount, isFollowing }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};

