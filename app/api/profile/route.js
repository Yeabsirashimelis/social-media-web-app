import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import User from "@/models/user";
import { getSessionUser } from "@/utils/getSessionUser";

// PUT /api/profile
export const GET = async function (request) {
  try {
    await connectDB();
    const { userId } = await getSessionUser();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return new Response("user not found", { status: 404 });
    }
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};

// PUT /api/profile - is put because there is some data already in the database with google provider
export const PUT = async function (request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const profilePicture = formData.get("profilePicture");
    const user = {
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      bio: formData.get("bio"),
      interestedIn: formData.get("interestedIn"),
      dateOfBirth: formData.get("dateOfBirth"),
    };

    // // UPLOAD THE IMAGES TO CLOUDINARY
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
    user.profilePicture = uploadedImage;

    const { userId } = await getSessionUser();

    const userToCompleteProfile = await User.findByIdAndUpdate(userId, user);

    return new Response(JSON.stringify(userToCompleteProfile), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
