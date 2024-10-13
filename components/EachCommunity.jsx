"use client";

import Image from "next/image";
import { getCommunity } from "@/services/communityApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { useParams } from "next/navigation";
import { useApp } from "@/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Error from "../components/Error";
import { createThread } from "@/services/threadApi";
import PostImageInCommunityModal from "./PostImageInCommunityModal";
import CommunityPosts from "./CommunityPosts";
import FollowCommunity from "./FollowCommunity";
import CommunityInfo from "./CommunityInfo";

function EachCommunity() {
  const { inviteLink } = useParams();
  const {
    contentOfCommunity,
    setContentOfCommunity,
    communityInfoOpened,
    setCommunityInfoOpened,
  } = useApp();

  const [medias, setMedias] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getCommunity(inviteLink),
    queryKey: ["community", inviteLink],
  });

  console.log(data);

  const {
    mutate,
    isPending: isPosting,
    error: postError,
  } = useMutation({
    mutationFn: createThread,
    onSuccess: (data) => {
      setContentOfCommunity("");
      queryClient.invalidateQueries(["community", inviteLink]);
    },
  });

  function handleMediaChange(e) {
    const { files } = e.target;
    const fileArray = Array.from(files);
    setMedias(fileArray);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", contentOfCommunity);
    formData.append("threadType", "community");
    formData.append("inviteLink", inviteLink);
    mutate(formData);
  }

  function handleOpenCommunityDetails() {
    setCommunityInfoOpened(true);
  }

  if (isLoading) return <Spinner />;

  if (error) return <Error />;

  return (
    <div className="grid py-4 grid-rows-[auto_1fr_auto] h-screen">
      {/* Sticky Top - Community Info with Profile */}
      <div className="shadow-lg z-10 py-1 border-b ">
        <div className="flex flex-col  gap-1">
          <div
            className=" flex items-center space-x-4"
            onClick={handleOpenCommunityDetails}
          >
            {data.community?.profilePicture ? (
              <Image
                src={data.community.profilePicture}
                alt="Profile"
                height={0}
                width={0}
                sizes="100vw"
                className="h-12 w-12 object-cover rounded-lg"
              />
            ) : (
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold">
                {data.community?.communityName?.charAt(0).toUpperCase() || "C"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">
                {data.community?.communityName || "Community"}
              </h1>
            </div>
          </div>

          <div>
            <p className="font-bold">100 followers</p>
          </div>
        </div>
      </div>

      {/* //commnityInfo */}
      {communityInfoOpened && <CommunityInfo community={data?.community} />}

      {/* Main Content */}
      <div className="flex-grow  z-[5] overflow-y-auto">
        {/* Render threads/posts here */}
        {data?.threads?.length ? (
          <CommunityPosts threads={data?.threads} />
        ) : (
          <p className="p-4">
            Community posts and discussions will appear here...
          </p>
        )}
      </div>

      {/* Sticky Bottom - Add Thread/Post Form */}
      {data?.isAdmin ? (
        <div className="shadow-lg z-10 py-1 border-t">
          <form onSubmit={handleSubmit} className="flex items-center">
            <textarea
              placeholder="Add content..."
              className="mt-1 block w-full outline-none bg-black px-4 py-4 rounded-md shadow-xl sm:text-sm"
              rows={1}
              required
              value={contentOfCommunity}
              onChange={(e) => setContentOfCommunity(e.target.value)}
            ></textarea>

            <div className="flex gap-4 mr-6 items-center">
              {/* File input with FontAwesome icon */}
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md transition duration-300"
                onClick={() => setModalOpened(true)}
              >
                <FontAwesomeIcon icon={faPaperclip} className="ml-2 h-7 w-8" />
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleMediaChange}
                multiple
              />

              {contentOfCommunity && (
                <button
                  type="submit"
                  className="mr-2 rounded-md transition duration-300 "
                  disabled={isPosting}
                >
                  <FontAwesomeIcon icon={faTelegram} className="h-7 w-8" />
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <FollowCommunity inviteLink={data?.community?.inviteLink} />
      )}

      {/* Image Preview Modal */}
      {modalOpened && medias.length && (
        <PostImageInCommunityModal
          setMedias={setMedias}
          medias={medias}
          setModalOpened={setModalOpened}
        />
      )}
    </div>
  );
}

export default EachCommunity;
