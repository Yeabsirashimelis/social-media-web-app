import {
  faRepeat,
  faShareFromSquare,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faTelegramPlane } from "@fortawesome/free-brands-svg-icons";

function ThreadsCard({ thread }) {
  const { name, username, content, medias, profilePicture } = thread;
  console.log("****************", thread, "***********************");
  return (
    <div className="bg-[#1a1a1a] rounded-lg mb-8 px-4 py-4 lg:px-6 lg:py-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <Image
          src={profilePicture}
          alt={username}
          width={0}
          height={0}
          sizes="100vw"
          className=" h-12 w-auto rounded-lg  mr-4"
        />
        <div>
          <p className="text-lg font-semibold text-white">{name}</p>
          <p className="text-sm text-gray-400">Posted 2 hours ago</p>
        </div>
      </div>

      {/* Thread Text */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{content}</p>

      {/* Images */}
      <div className="flex  gap-2">
        {medias.map((media) => (
          <div className="relative inset-0 w-1/2">
            <Image
              src={media}
              alt={name}
              width={0}
              height={0}
              sizes="100vw"
              className=" rounded-lg"
            />
            {/* Dark Overlay */}
            <div
              className="absolute inset-0  bg-black opacity-0
            hover:opacity-20 transition-all duration-200"
            ></div>
          </div>
        ))}
      </div>

      {/* Interaction Icons */}
      <div className="flex gap-6 mt-4 text-gray-400">
        <div className="flex items-center gap-2 group cursor-pointer">
          <FontAwesomeIcon
            icon={faHeart}
            className="h-5 w-5 group-hover:text-red-500 transition-colors duration-200"
          />
          <p className="group-hover:text-white">345</p>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <FontAwesomeIcon
            icon={faComment}
            className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-200"
          />
          <p className="group-hover:text-white">148</p>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <FontAwesomeIcon
            icon={faRepeat}
            className="h-5 w-5 group-hover:text-green-500 transition-colors duration-200"
          />
          <p className="group-hover:text-white">345</p>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <FontAwesomeIcon
            icon={faTelegramPlane}
            className="h-5 w-5 group-hover:text-indigo-500 transition-colors duration-200"
          />
          <p className="group-hover:text-white">4</p>
        </div>
      </div>
    </div>
  );
}

export default ThreadsCard;
