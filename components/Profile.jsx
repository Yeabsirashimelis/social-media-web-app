"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faReplyAll, faEdit } from "@fortawesome/free-solid-svg-icons";

import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/ProfileApi";
import Spinner from "./Spinner";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import ContentInProfile from "./ContentInProfile";
import { useRouter } from "next/navigation";
import RepliesInProfile from "./RepliesInProfile";
import FollowAndMension from "./FollowAndMension";

function Profile() {
  const { username } = useParams();

  const currentPath = usePathname();

  console.log(currentPath);

  const { data: session } = useSession();
  const isMe = username === session?.user?.username;
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
  });

  console.log(data);

  if (isLoading) return <Spinner loading={isLoading} />;
  return (
    <div className="min-h-screen ">
      <div className=" mx-auto ">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className=" rounded-lg shadow-lg flex items-center">
            {/* Placeholder for profile picture */}
            <Image
              src={data?.user?.profilePicture}
              alt="Profile"
              height={0}
              width={0}
              sizes="100vw"
              className="h-16 w-16 object-cover rounded-lg"
            />
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{data?.user?.name}</h1>
              <p className="text-gray-400 mt-2">{data?.user?.interestedIn}</p>
            </div>
          </div>
          {isMe && (
            <Link href="/profile/edit">
              <div className="flex items-center gap-2 bg-[#080808] px-4 py-2 rounded-md">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="h-4 w-4 text-blue-400 hover:text-blue-500"
                />
                <p>Edit</p>
              </div>
            </Link>
          )}
        </div>

        <div className="mt-6 bg-[#080808] px-2  rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
          <div className="flex flex-col space-y-2">
            {data?.user?.bio && (
              <div className="flex items-center bg-black px-2 py-1 rounded-md">
                <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-2" />
                <p>Bio: {data?.user?.bio}</p>
              </div>
            )}
            {data?.user?.dateOfBirth && (
              <div className="flex items-center  bg-black px-2 py-1 rounded-md">
                <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-2" />
                <p>
                  Birth Date:
                  {new Date(data?.user?.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}
            {data?.user?.phoneNumber && (
              <div className="flex items-center  bg-black px-2 py-1 rounded-md">
                <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-2" />
                <p>Call: {data?.user?.phoneNumber}</p>
              </div>
            )}
          </div>
        </div>

        {isMe ? (
          <Link href="/profile/edit">
            <p className="bg-black  my-4 mx-3 text-center hover:text-gray-200 font-semibold px-1 py-2 border  rounded-lg">
              Edit Profile
            </p>
          </Link>
        ) : (
          <div>
            <FollowAndMension
              username={username}
              isFollowing={data?.isFollowing}
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="mt-8  bg-[#080808]  rounded-lg shadow-lg">
          <div className="grid grid-cols-3">
            <Link
              href={`/profile/${username}`}
              className={`${
                currentPath === `/profile/${username}` ? "bg-[#1a1a1a] " : ""
              }`}
            >
              <NavItem icon={faMessage} text="Threads" />
            </Link>
            <Link
              href={`/profile/${username}/replies`}
              className={`${
                currentPath === `/profile/${username}/replies`
                  ? "bg-[#1a1a1a] "
                  : ""
              }`}
            >
              <NavItem icon={faReplyAll} text="Replies" />
            </Link>
            <NavItem icon={faTag} text="Tagged" />
          </div>
        </nav>

        {/* Content Area */}
        <div className="mt-6">
          {/* Content will be dynamically loaded based on selected tab */}
          {/* Placeholder content */}
          {currentPath === `/profile/${username}` && data && (
            <ContentInProfile data={data} />
          )}

          {currentPath === `/profile/${username}/replies` && data && (
            <RepliesInProfile />
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, text }) {
  return (
    <div
      className="flex-1 flex-row text-center py-4 px-6 cursor-pointer
    hover:bg-[#1a1919] transition-colors duration-300"
    >
      <div className="flex gap-3 justify-center">
        <FontAwesomeIcon icon={icon} className="text-xl mb-1" />
        <p className="block text-sm">{text}</p>{" "}
      </div>
    </div>
  );
}

export default Profile;
