import connectDB from "@/config/database";
import Community from "@/models/community";
import Thread from "@/models/thread";

// GET   /api/communities/[inviteLink]/medias
export const GET = async function (request, { params }) {
  try {
    await connectDB();
    const { inviteLink } = params;
    const community = await Community.findOne({ inviteLink: inviteLink });

    if (!community) {
      return new Response("community not found", { status: 404 });
    }

    const medias = await Thread.find(
      { community: community._id },
      { medias: 1, _id: 0 }
    );

    // Combine all the medias and filter out audio files based on the "raw" keyword in the URL
    const allMedias = medias
      .flatMap((thread) => thread.medias)
      .filter((media) => {
        // Exclude media URLs that contain "raw", assuming it's an indicator for audio files
        return !media.includes("/raw/");
      });

    return new Response(JSON.stringify(allMedias), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
