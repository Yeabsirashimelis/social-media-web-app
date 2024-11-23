import connectDB from "@/config/database";
import Community from "@/models/community";
import Thread from "@/models/thread";

// GET   /api/communities/[inviteLink]/musics`
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

    // Combine all the medias and filter for audio files
    const allMedias = medias.flatMap((thread) => thread.medias);

    // Filter to get only audio files, ensure that media has a fileName and type
    const audioFiles = allMedias.filter(function (media) {
      return (
        media?.fileName?.endsWith(".mp3") ||
        media?.fileName?.endsWith(".wav") ||
        media?.includes("raw")
      );
    });

    console.log(audioFiles);

    return new Response(JSON.stringify(audioFiles), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
