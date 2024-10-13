import connectDB from "@/config/database";
import Follows from "@/models/follows";
import User from "@/models/user";
import { getSessionUser } from "@/utils/getSessionUser";

// POST api/follows/[username]
//this is all about adding ids in the arrays of followers and following
export const POST = async function (request, { params }) {
  try {
    await connectDB();
    const { userId } = await getSessionUser(); // current user's ID from session
    const username = params.username; // the username of the user to follow

    // Find the user being followed based on the username
    const followedUser = await User.findOne({ username: username });

    if (!followedUser) {
      return new Response("User not found", { status: 404 });
    }

    // 1. Add the current user to the followed user's followers list (who follows the user)
    await Follows.updateOne(
      { userId: followedUser._id }, // find the followed user's doc
      { $addToSet: { followers: userId } }, // add current user to followers array
      { upsert: true } // create document if it doesn't exist
    );

    // 2. Add the followed user to the current user's following list (whom the user is following)
    await Follows.updateOne(
      { userId: userId }, // find the current user's doc
      { $addToSet: { following: followedUser._id } }, // add followed user to following array
      { upsert: true } // create document if it doesn't exist
    );

    return new Response("Followed successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE api/follows/[username]
//this will not delete an item from the database. just remove ids from the followers and following arrays
export const DELETE = async function (request, { params }) {
  try {
    await connectDB();
    const { userId } = await getSessionUser(); // current user's ID from session
    const username = params.username; // the username of the user to unfollow

    // Find the user being unfollowed based on the username
    const followedUser = await User.findOne({ username: username });

    if (!followedUser) {
      return new Response("User not found", { status: 404 });
    }

    // 1. Remove the current user from the followed user's followers list
    await Follows.updateOne(
      { userId: followedUser._id }, // find the followed user's doc
      { $pull: { followers: userId } } // remove current user from followers array
    );

    // 2. Remove the followed user from the current user's following list
    await Follows.updateOne(
      { userId: userId }, // find the current user's doc
      { $pull: { following: followedUser._id } } // remove followed user from following array
    );

    return new Response("Unfollowed successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
