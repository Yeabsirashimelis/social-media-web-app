import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

function CommunityFollower({ follower, isAdmin, onClick }) {
  return (
    <div className="relative flex items-center py-2 rounded-lg transition-all duration-300 cursor-pointer">
      <Image
        src={follower.profilePicture}
        alt={follower.username}
        width={48}
        height={48}
        className="h-12 w-12 rounded-lg object-cover mr-4"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <Link
            href={`/profile/${follower.username}`}
            className="text-sm hover:underline transition-all duration-200 font-semibold text-white"
          >
            @{follower.username}
          </Link>
          {isAdmin && (
            <span className="ml-3 bg-gray-600 text-white text-xs px-1 rounded">
              Admin
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">{follower.name}</p>
      </div>
      <button
        className="absolute top-6 right-4 cursor-pointer"
        onClick={onClick} // Trigger the toggle function when clicked
      >
        <FontAwesomeIcon
          icon={faEllipsisV}
          className="text-white text-sm md:text-base hover:text-gray-400 transition-colors"
        />
      </button>
    </div>
  );
}

export default CommunityFollower;
