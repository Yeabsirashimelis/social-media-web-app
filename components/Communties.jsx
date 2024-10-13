"use client";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import img1 from "../assets/images/img2.jpg";
import img2 from "../assets/images/img2.jpg";
import img3 from "../assets/images/img3.jpg";
import img4 from "../assets/images/img4.jpg";
import CommunityCard from "./CommunityCard";
import { useQuery } from "@tanstack/react-query";
import { getCommunitiesForYou } from "@/services/communityApi";
import Spinner from "./Spinner";

function Communties() {
  const {
    data: communities,
    isLoading,
    error,
  } = useQuery({
    queryFn: getCommunitiesForYou,
    queryKey: ["communitiesRelatedToYou"],
  });

  if (isLoading) return <Spinner />;

  return (
    <div className=" mx-auto px-3 py-2  rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Communities</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search communities..."
          className="block w-full bg-[#080808] border text-gray-600   py-2 px-4 pl-10 outlineborder border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:text-sm-none "
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
        </span>
      </div>

      {!communities.length ? (
        <p className="absolute top-1/2 px-6 text-lg flex justify-center  items-center">
          Embrace a community that you love, or craft one that reflects your own
          vision😎!
        </p>
      ) : (
        <div className="grid gap-3  mt-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {communities.map((community) => (
            <CommunityCard community={community} key={community._id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Communties;
