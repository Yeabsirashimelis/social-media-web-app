import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Community from "@/models/community";
import { getSessionUser } from "@/utils/getSessionUser";

// POST /api/for-each-person
export const POST = async function (request) {
  try {
    await connectDB();
    const { userId } = await getSessionUser();
    const formData = await request.formData();

    const profilePicture = formData.get("profilePicture");

    const community = {
      communityName: formData.get("communityName"),
      description: formData.get("description"),
      owner: userId,
    };

    console.log(community);

    // // UPLOAD THE IMAGES TO CLOUDINARY
    if (profilePicture) {
      const imageUploadPromise = async (image) => {
        const imageBuffer = await image.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString("base64");

        //   // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          { folder: "myschool" }
        );

        return result.secure_url;
      };

      // Wait for all the images to upload
      const uploadedImage = await imageUploadPromise(profilePicture);
      community.profilePicture = uploadedImage;
    }

    const newCommunity = await Community.create(community);
    const communityFirstName = newCommunity.communityName
      .split(" ")[0]
      .slice(0, 6);

    const inviteLink = `${communityFirstName}${newCommunity._id}`;
    newCommunity.inviteLink = inviteLink;
    await newCommunity.save();

    return new Response("success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
