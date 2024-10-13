import connectDB from "@/config/database";
import Like from "@/models/like";
import Thread from "@/models/thread";
import Comment from "@/models/comment";
import { getSessionUser } from "@/utils/getSessionUser";

// POST api/threads/like/[id]
export const POST = async function (request, { params }) {
  try {
    // Connect to the database
    await connectDB();

    // Extract thread or comment ID from params
    const targetId = params.id;

    // Get the request body (which includes targetType)
    const { targetType } = await request.json();
    console.log("******************", targetType, "******************");
    const { userId: user } = await getSessionUser();

    const likeInfo = { target: targetId, targetType, user };

    const existingLike = await Like.findOne(likeInfo);

    if (existingLike) {
      await Like.deleteOne(likeInfo);

      // Decrease the like count based on targetType
      if (targetType === "Thread") {
        await Thread.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
      } else if (targetType === "Comment") {
        await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
      }

      return new Response("Like removed", { status: 200 });
    } else {
      const newLike = new Like(likeInfo);
      await newLike.save();

      // Increase the like count based on targetType
      if (targetType === "Thread") {
        await Thread.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
      } else if (targetType === "Comment") {
        await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
      }

      return new Response("Like added", { status: 201 });
    }
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
