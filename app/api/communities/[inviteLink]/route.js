import connectDB from "@/config/database";
import Community from "@/models/community";
import Thread from "@/models/thread";
import Comment from "@/models/comment";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async function (request, { params }) {
  try {
    await connectDB();
    const { inviteLink } = params;

    const { userId } = await getSessionUser();

    // Validate inviteLink
    if (!inviteLink) {
      return new Response(
        JSON.stringify({ message: "Invite link is required" }),
        { status: 400 }
      );
    }

    // Fetch the community by invite link
    const community = await Community.findOne({ inviteLink });

    if (!community) {
      return new Response(JSON.stringify({ message: "Community not found" }), {
        status: 404,
      });
    }

    // Check if the user is an admin (owner or in admins array)
    const isAdmin =
      community.owner.toString() === userId ||
      community.admins.includes(userId);

    // Fetch threads related to the community
    const threads = await Thread.find({ community: community._id }).populate({
      path: "poster",
      select: "name username profilePicture", // Select user details to populate
    });

    // Calculate comment counts for each thread
    const threadsWithCommentCount = await Promise.all(
      threads.map(async (thread) => {
        // Count comments for each thread
        const commentCount = await Comment.countDocuments({
          thread: thread._id,
        });

        // Return thread with the comment count added
        return {
          ...thread.toObject(), // Convert thread document to a plain object
          commentsCount: commentCount, // Add comment count
        };
      })
    );

    // Return community information along with its threads and admin status
    const response = {
      community,
      threads: threadsWithCommentCount, // Include threads with comment counts
      isAdmin, // Add the isAdmin property to the response
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
