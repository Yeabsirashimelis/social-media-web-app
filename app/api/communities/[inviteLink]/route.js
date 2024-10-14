import connectDB from "@/config/database";
import Community from "@/models/community";
import Thread from "@/models/thread";
import Comment from "@/models/comment";
import { getSessionUser } from "@/utils/getSessionUser";
import CommunityFollow from "@/models/communityFollow";

// GET /api/communities/inviteLink
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

    const numberOfFollowers = await CommunityFollow.countDocuments({
      communityId: community._id,
    });

    // Return community information along with its threads and admin status
    const response = {
      community,
      threads: threadsWithCommentCount, // Include threads with comment counts
      isAdmin, // Add the isAdmin property to the response
      numberOfFollowers,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/communities/inviteLink

export const PUT = async function (request, { params }) {
  try {
    await connectDB();
    const { inviteLink } = params;

    const formData = await request.formData();
    const data = {
      communityName: formData.get("communityName"),
      description: formData.get("description"),
      communityType: formData.get("communityType"),
    };

    // Update the community with the new data
    await Community.updateOne({ inviteLink }, { $set: data });

    return new Response("Community updated successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    const community = await Community.findOne({ inviteLink: inviteLink });
    if (!community) return new Response("community not found", { status: 404 });

    return new Response("something went wrong", { status: 500 });
  }
};

// DELETE /api/communities/inviteLink
export const DELETE = async function (request, { params }) {
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

    // Find the community by inviteLink
    const community = await Community.findOne({ inviteLink });

    // Check if community exists
    if (!community) {
      return new Response(JSON.stringify({ message: "Community not found" }), {
        status: 404,
      });
    }

    // Check if the user is the owner or an admin
    const isOwner = community.owner.toString() === userId;

    // Only the owner or an admin can delete the community
    if (!isOwner) {
      return new Response(JSON.stringify({ message: "Not authorized" }), {
        status: 403,
      });
    }

    // Delete all related threads and comments
    const threads = await Thread.find({ community: community._id });

    for (const thread of threads) {
      await Comment.deleteMany({ thread: thread._id }); // Delete all comments related to the thread
      await Thread.deleteOne({ _id: thread._id }); // Delete the thread
    }

    // Delete the community itself
    await Community.deleteOne({ _id: community._id });

    return new Response(
      JSON.stringify({ message: "Community deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
