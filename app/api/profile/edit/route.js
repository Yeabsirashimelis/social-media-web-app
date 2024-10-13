import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import User from "@/models/user";
import { getSessionUser } from "@/utils/getSessionUser";

export const PUT = async function (request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const user = {
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      bio: formData.get("bio"),
      interestedIn: formData.get("interestedIn"),
      dateOfBirth: formData.get("dateOfBirth"),
    };

    console.log("*******************", user, "*******************");

    const { userId } = await getSessionUser();

    const userToUpdate = await User.findByIdAndUpdate(userId, user);

    return new Response(JSON.stringify(userToUpdate), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
