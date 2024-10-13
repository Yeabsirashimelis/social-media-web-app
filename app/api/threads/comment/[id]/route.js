import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Comment from "@/models/comment";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async function (request, { params }) {
  try {
    await connectDB();
    const { id: threadId } = params;

    // Parse the URL to get the query parameters
    const url = new URL(request.url);
    const parentId = url.searchParams.get("commentId"); // Get the commentId

    // If parentId is not provided or is "null", treat it as top-level comment
    //  filter - will be an object to serach from the database

    const filter = { thread: threadId };
    if (parentId && parentId !== "null") {
      filter.parentId = parentId; // Add parentId to the filter only if it's valid
    } else {
      filter.parentId = null; // For top-level comments
    }

    console.log("Filter:", filter);

    // Fetch either top-level comments or replies
    const comments = await Comment.find(filter)
      .sort({ createdAt: -1 }) // Sort comments in descending order
      .populate({
        path: "commenter",
        select: "name username profilePicture",
      });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

export const POST = async function (request, { params }) {
  try {
    await connectDB();
    const formData = await request.formData();
    const { userId } = await getSessionUser();
    const media = formData.get("media");

    const comment = {
      content: formData.get("content"),
      commenter: userId,
      media: "", // Default to empty string if no media
      thread: params.id,
      parentId: formData.get("commentId"),
    };

    console.log(comment);

    if (media && media.size > 0) {
      // Check if media exists and has content
      const imageUploadPromise = async (media) => {
        const imageBuffer = await media.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString("base64");

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:media/png;base64,${imageBase64}`,
          { folder: "myschool" }
        );

        return result.secure_url;
      };

      // Wait for image upload if media exists
      comment.media = await imageUploadPromise(media);
    }

    // Save the new comment with or without media
    const newComment = new Comment(comment);
    await newComment.save();

    return new Response("success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
