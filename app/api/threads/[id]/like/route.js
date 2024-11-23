import connectDB from "@/config/database";

export const POST = async function (request) {
  try {
    await connectDB();
  } catch (error) {}
};
