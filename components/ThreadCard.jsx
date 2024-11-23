"use client";
import {
  faRepeat,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faTelegramPlane } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeThread } from "@/services/likeApi";
import { useRouter } from "next/navigation";
import AddReply from "./AddReply";
import { Gallery, Item } from "react-photoswipe-gallery";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "../assets/styles/audioplayer.css";

function ThreadCard({ thread }) {
  const {
    _id,
    poster: { name, username, profilePicture },
    content,
    createdAt,
    likesCount: initialLikesCount,
    commentsCount,
    threadType,
  } = thread;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [viewA, setViewA] = useState(false);
  const router = useRouter();

  const timeAgo = (createdAt) => {
    const now = new Date();
    const postedDate = new Date(createdAt);
    const diffInMs = now - postedDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
      return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
    } else if (diffInMonths > 0) {
      return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    } else if (diffInDays > 0) {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1
        ? "1 minute ago"
        : `${diffInMinutes} minutes ago`;
    } else {
      return diffInSeconds === 1
        ? "1 second ago"
        : `${diffInSeconds} seconds ago`;
    }
  };

  const postedAgo = timeAgo(createdAt);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: likeThread,
    onMutate: async (threadId) => {
      // Optimistic update
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevCount) => prevCount + (liked ? -1 : 1));

      // Cancel any ongoing query for threads to prevent overwriting
      await queryClient.cancelQueries({ queryKey: ["threads"] });

      // Snapshot of the previous value (in case of rollback)
      const previousThreads = queryClient.getQueryData(["threads"]);

      return { previousThreads };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state in case of error
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevCount) => prevCount + (liked ? 1 : -1));

      if (context?.previousThreads) {
        queryClient.setQueryData(["threads"], context.previousThreads);
      }
    },
    onSettled: () => {
      // Refetch the threads after mutation success/failure
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  function handleLikeClick(threadId) {
    mutate(threadId);
  }

  function handleStopNavigation(e) {
    e.stopPropagation();
  }

  function handleCloseViewA() {
    setViewA(false);
  }

  function handleRedirection() {
    if (threadType === "community") {
      router.push(`/communities/${username}`);
    } else {
      router.push(`/profile/${username}`);
    }
  }

  return (
    <div
      className="relative  bg-[#1a1a1a]  rounded-lg mb-8 px-4 py-4 lg:px-6 lg:py-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
      onClick={() => router.push(`/${username}/post/${_id}`)}
    >
      {/* User Info */}
      <div className="flex justify-between">
        {" "}
        <div className="flex items-center mb-4" onClick={handleStopNavigation}>
          <Image
            src={profilePicture}
            alt={username}
            width={0}
            height={0}
            sizes="100vw"
            className=" h-12 w-12 rounded-lg  mr-4"
          />
          <div>
            <div
              className="text-lg hover:underline transition-all duration-200 font-semibold text-white"
              onClick={handleRedirection}
            >
              @{username}
            </div>
            <p className="text-sm text-gray-400">Posted {postedAgo}</p>
          </div>
        </div>
        {threadType === "community" && (
          <div className="flex justify-center items-center bg-blue-600 text-white text-sm font-semibold px-3 h-6 rounded-full shadow-md">
            <svg
              className="w-4 h-4 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2a9 9 0 110 18 9 9 0 010-18zm3.59 6.59a1.42 1.42 0 112-2 1.42 1.42 0 01-2 2zm-6.41 0a1.42 1.42 0 112-2 1.42 1.42 0 01-2 2zm9.41 6a6.59 6.59 0 00-6 0 6.59 6.59 0 00-6 0"
              />
            </svg>
            <span>Community</span>
          </div>
        )}
      </div>

      {/* Thread Text */}
      <p className="text-gray-300 px-4 text-sm mb-4 leading-relaxed">
        {content}
      </p>

      {/* Images */}
      {thread.medias && (
        <div className="flex  gap-2 px-4" onClick={handleStopNavigation}>
          <Gallery>
            {thread.medias.map((media, index) => {
              const isVideo = media.includes("video");
              const isAudio = media.includes("raw");
              return (
                <div className="relative inset-0 w-1/2" key={index}>
                  {isVideo ? (
                    <video
                      onClick={(e) => {
                        e.stopPropagation(); //prevent navigation
                      }}
                      src={media}
                      muted
                      controls
                      autoPlay
                      loop
                      className="rounded-lg w-full h-full"
                      style={{ objectFit: "cover" }}
                    />
                  ) : isAudio ? (
                    <ReactAudioPlayer
                      onClick={(e) => e.stopPropagation()}
                      src={media}
                      muted
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-lg"
                      style={{
                        backgroundColor: "rgb(68, 65, 65)",
                        color: "white",
                      }}
                    >
                      Your browser does not support the audio element.
                    </ReactAudioPlayer>
                  ) : (
                    <Item
                      original={media}
                      thumbnail={media}
                      width="800"
                      height="1000"
                    >
                      {({ ref, open }) => (
                        <Image
                          ref={ref}
                          onClick={open}
                          src={media}
                          alt={name}
                          width={0}
                          height={0}
                          priority={true}
                          sizes="100vw"
                          className="rounded-lg w-full h-full"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </Item>
                  )}
                  {/* Dark Overlay */}
                  {/* <div
                    className="absolute inset-0 bg-black opacity-0
                    hover:opacity-20 transition-all duration-200"
                  ></div> */}
                </div>
              );
            })}
          </Gallery>
        </div>
      )}

      {/* Interaction Icons */}
      <div
        className="flex px-4  mt-4 text-gray-400"
        onClick={handleStopNavigation}
      >
        <div
          className="flex items-center gap-2 px-3 py-2
           transition-all duration-300  cursor-pointer hover:bg-[#272626]
          rounded-full "
          onClick={() => handleLikeClick(_id)}
        >
          {likesCount ? (
            <FontAwesomeIcon
              icon={solidHeart}
              className="h-5 w-5 text-red-600 group-hover:text-red-500 transition-colors duration-200"
            />
          ) : (
            <FontAwesomeIcon
              icon={faHeart}
              className="h-5 w-5 group-hover:text-red-500 transition-colors duration-200"
            />
          )}

          <p className="group-hover:text-white">{likesCount}</p>
        </div>
        <div
          className="flex items-center gap-2 group cursor-pointer 
        px-3 py-2 transition-all duration-300 rounded-full  hover:bg-[#272626]"
          onClick={() => {
            // setCurrentThread(thread);
            console.log(thread);
            setViewA(true);
          }}
        >
          {viewA && (
            <AddReply
              thread={thread}
              setViewA={setViewA}
              handleCloseViewA={handleCloseViewA}
            />
          )}
          <FontAwesomeIcon
            icon={faComment}
            className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-200"
          />
          <p className="group-hover:text-white">{commentsCount}</p>
        </div>
        <div
          className="flex items-center gap-2 group cursor-pointer 
         px-3 py-2 transition-all duration-300 rounded-full  hover:bg-[#272626]"
        >
          <FontAwesomeIcon
            icon={faRepeat}
            className="h-5 w-5 group-hover:text-green-500 transition-colors duration-200"
          />
          <p className="group-hover:text-white">{2}</p>
        </div>
        <div
          className="flex items-center gap-2 group cursor-pointer 
        px-3 py-2 transition-all duration-300 rounded-full hover:bg-[#272626]"
        >
          <FontAwesomeIcon
            icon={faTelegramPlane}
            className="h-5 w-5 group-hover:text-indigo-500 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
}

export default ThreadCard;
