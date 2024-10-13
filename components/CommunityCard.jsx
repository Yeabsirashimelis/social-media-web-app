import Image from "next/image";
import Link from "next/link";

function CommunityCard({ community }) {
  const { profilePicture, communityName, description, inviteLink } = community;
  const descriptionForCard =
    description.length > 20 ? description.substr(0, 20) + "..." : description;
  const thumbnailText = !profilePicture
    ? communityName.substr(0, 2).toUpperCase()
    : profilePicture;

  return (
    <div className="bg-[#080808] space-y-3 px-4 py-4 rounded-lg">
      <div className="flex gap-3 items-center">
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt="Profile"
            height={0}
            width={0}
            sizes="100vw"
            className="h-16 w-16 object-cover rounded-lg"
          />
        ) : (
          <div
            className="h-16 w-16 bg-[#36035a] rounded-lg flex items-center justify-center"
            style={{ fontSize: "2.2rem", color: "#fff", fontWeight: "bold" }}
          >
            {thumbnailText}
          </div>
        )}
        <div className="flex flex-col items-center">
          <p>{communityName}</p>
          {/* <p className="text-xs">{community.link}</p> */}
        </div>
      </div>
      <p className="text-sm">{descriptionForCard}</p>
      <Link href={`/communities/${inviteLink}`}>
        <button
          className="bg-[#4B0082] hover:bg-[#36035a] transition-colors duration-150
             shadow-lg  px-4 py-1 rounded-lg  mt-2"
        >
          view
        </button>
      </Link>
    </div>
  );
}

export default CommunityCard;
