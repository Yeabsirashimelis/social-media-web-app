import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Thread from "@/models/thread";
import Comment from "@/models/comment";
import { getSessionUser } from "@/utils/getSessionUser";
import Community from "@/models/community";

export const GET = async function (request) {
  try {
    await connectDB();
    const threads = await Thread.find({})
      .sort({ createdAt: -1 }) // Sort threads in descending order
      .populate({
        path: "poster",
        select: "name username profilePicture",
      })
      .populate({
        path: "community",
        select: "communityName inviteLink profilePicture", // Populate the necessary community fields
      });

    // Count comments for each thread and update the poster information if thread type is community
    const threadsWithCommentCount = await Promise.all(
      threads.map(async (thread) => {
        const commentCount = await Comment.countDocuments({
          thread: thread._id,
        });

        // Check if the thread is of type 'community'
        let posterInfo;
        if (thread.threadType === "community" && thread.community) {
          posterInfo = {
            name: thread?.community?.communityName,
            username: thread?.community?.inviteLink, //this will be the invite link of the channel
            profilePicture: thread?.community?.profilePicture, // Assuming logo is used as profile picture
          };
        } else {
          // Default poster info (individual user)
          posterInfo = {
            name: thread?.poster?.name,
            username: thread?.poster?.username,
            profilePicture: thread?.poster?.profilePicture,
          };
        }

        return {
          ...thread.toObject(), // Convert Mongoose document to plain object
          commentsCount: commentCount, // Add comment count
          poster: posterInfo, // Update poster information
        };
      })
    );

    return new Response(JSON.stringify(threadsWithCommentCount), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};

// POST api/threads
export const POST = async function (request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const { userId } = await getSessionUser();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const medias = formData.getAll("medias");
    const threadType = formData.get("threadType");
    const inviteLink = formData.get("inviteLink");

    const thread = {
      poster: userId,
      content: formData.get("content"),
      hashtags: formData.get("hashtags"),
      medias: [],
    };

    if (threadType === "community") {
      thread.threadType = "community";
      const community = await Community.findOne({ inviteLink: inviteLink });
      thread.community = community._id;
    }

    // UPLOAD THE IMAGES TO CLOUDINARY only if medias exist
    if (medias.length > 0) {
      const imageUploadPromises = medias.map(async (media) => {
        const imageBuffer = await media.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString("base64");

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          { folder: "myschool" }
        );

        return result.secure_url;
      });

      // Wait for all the images to upload
      const uploadedMedias = await Promise.all(imageUploadPromises);
      thread.medias = uploadedMedias;
    }

    const newThread = new Thread(thread);
    await newThread.save();

    return new Response(JSON.stringify(newThread._id), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
