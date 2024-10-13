import connectDB from "@/config/database";
import Thread from "@/models/thread";
import Comment from "@/models/comment";

// GET api/threads/id
export const GET = async function (request, { params }) {
  const { id: threadId } = params;
  try {
    await connectDB();
    const thread = await Thread.findById(threadId).populate({
      path: "poster",
      select: "name username profilePicture",
    });

    if (!thread) {
      return new Response("Thread not found", { status: 404 });
    }

    const commentCount = await Comment.countDocuments({
      thread: thread._id,
    });

    const threadWithCommentCount = {
      ...thread.toObject(), // Convert Mongoose document to plain object
      commentsCount: commentCount, // Add comment count
    };
    return new Response(JSON.stringify(threadWithCommentCount), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
