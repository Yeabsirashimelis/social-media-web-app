import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Community from "@/models/community";
import CommunityFollow from "@/models/communityAdmin";
import { getSessionUser } from "@/utils/getSessionUser";

// GET api/communities/for-each-person
export const GET = async function (request) {
  try {
    await connectDB();
    const { userId } = await getSessionUser();
    if (!userId) {
      return new Response("unauthorized", { status: 401 });
    }

    // find communities where the user is the owner, an admin, or follows the community
    const filter = {
      $or: [
        { owner: userId }, // Check if the user is the owner
        { admins: { $in: [userId] } }, // Check if the user is an admin
        {
          _id: {
            $in: (
              await CommunityFollow.find({ userId }).select("communityId")
            ).map((follow) => follow.communityId),
          }, // Check if the user follows the community
        },
      ],
    };

    const communities = await Community.find(filter);

    return new Response(JSON.stringify(communities), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};

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
