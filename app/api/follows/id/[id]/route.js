import connectDB from "@/config/database";

//POST api/follows/[id]
export const POST = async function (request, { params }) {
  try {
    await connectDB();
    const username = params.username;
    console.log("username : ", username);

    return new Response("success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
