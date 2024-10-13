import connectDB from "@/config/database";
import User from "@/models/user";
import Comment from "@/models/comment";
import Thread from "@/models/thread";

export const GET = async function (request, { params }) {
  try {
    const { username } = params;

    console.log("username: ", username);
    await connectDB();

    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Find the comments (both parent and replies) made by the user
    let comments = await Comment.find({ commenter: user._id })
      .sort({ createdAt: -1 }) // Sort comments in descending order
      .populate({
        path: "commenter", // Populate the main commenter's information directly
        select: "name username profilePicture",
      })
      .populate({
        path: "parentId", // Populate the parent comment if it exists
        populate: {
          path: "commenter", // Populate the parent comment's commenter directly
          select: "name username profilePicture",
        },
      })
      .populate({
        path: "thread",
        populate: {
          path: "poster", // Populate the poster details in the thread
          select: "name username profilePicture", // Only fetch name, username, and profilePicture
        },
      })
      .exec();

    if (!comments.length) {
      return new Response("No replies found", { status: 404 });
    }

    // Step 1: Collect parent comment IDs where the parent is not the user's comment
    const parentCommentIds = comments
      .filter((comment) => comment.parentId) // Filter out comments with no parentId (i.e., replies)
      .map((comment) => comment.parentId) // Extract the parentId
      .filter(
        (id, index, self) => self.indexOf(id) === index // Get unique parentIds
      );

    // Step 2: Fetch the parent comments for those replies
    let parentComments = [];
    if (parentCommentIds.length) {
      parentComments = await Comment.find({ _id: { $in: parentCommentIds } })
        .populate({
          path: "commenter",
          select: "name username profilePicture",
        })
        .populate({
          path: "thread",
          populate: {
            path: "poster", // Populate the poster details in the thread
            select: "name username profilePicture",
          },
        })
        .exec();
    }

    // Merge the user's comments and the parent comments into one array
    const allComments = [...comments, ...parentComments];

    // Step 3: Organize comments by thread
    const threadMap = new Map();

    allComments.forEach((comment) => {
      const threadId = comment.thread ? comment.thread.toString() : null; // Check for null

      // Skip if threadId is null
      if (!threadId) {
        console.warn(`Comment without threadId found: ${comment._id}`);
        return;
      }

      // Initialize the thread entry if it doesn't exist
      if (!threadMap.has(threadId)) {
        threadMap.set(threadId, {
          thread: comment.thread,
          parentComments: [],
        });
      }

      const parentComments = threadMap.get(threadId).parentComments;

      // Check if the comment is a parent or a reply
      if (comment.parentId) {
        // This comment is a reply
        const parentCommentId = comment.parentId
          ? comment.parentId.toString()
          : null; // Check for null

        // Skip if parentCommentId is null
        if (!parentCommentId) {
          console.warn(`Reply comment without parentId found: ${comment._id}`);
          return;
        }

        // Look for the parent comment in parentComments
        let parentComment = parentComments.find(
          (pc) => pc.commentInfo._id.toString() === parentCommentId
        );

        // If the parent comment doesn't exist, create it
        if (!parentComment) {
          const actualParentComment = allComments.find(
            (c) => c._id.toString() === parentCommentId
          );
          if (actualParentComment) {
            // Create the parent comment with the reply
            parentComment = {
              commentInfo: actualParentComment,
              replies: [comment], // Add the reply here
            };
            parentComments.push(parentComment); // Push the parent comment only once
          } else {
            console.warn(
              `Parent comment with ID ${parentCommentId} not found in allComments.`
            );
          }
        } else {
          // If the parent comment already exists, just add the reply
          parentComment.replies.push(comment);
        }
      } else {
        // This comment is a parent comment
        // Check if the parent comment is already added to avoid duplicates
        const existingParentComment = parentComments.find(
          (pc) => pc.commentInfo._id.toString() === comment._id.toString()
        );

        if (!existingParentComment) {
          // If not added already, push it with an empty replies array
          parentComments.push({
            commentInfo: comment, // Store the actual parent comment's info
            replies: [], // No replies yet
          });
        }
      }
    });

    // Step 4: Convert the map to an array
    const result = Array.from(threadMap.values());

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
