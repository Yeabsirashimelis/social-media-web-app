"use client";

import {
  faHeart,
  faComment,
  faCaretSquareDown,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCaretDown,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Gallery, Item } from "react-photoswipe-gallery";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeComment } from "@/services/likeApi";
import { useState } from "react";
import ReplyToReply from "./ReplyToReply";
import Replies from "./Replies";

function EachComment({ comment, openReplyId, setOpenReplyId }) {
  const {
    _id,
    commenter: { name, profilePicture, username },
    content,
    media,
    likesCount: initialLikesCount,
  } = comment;

  const threadId =
    typeof comment.thread === "object" ? comment.thread._id : comment.thread;

  const noNeedReplies = typeof comment.thread === "object";
  console.log(noNeedReplies);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: likeComment,
    onMutate: async (commentId) => {
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevCount) => prevCount + (liked ? -1 : 1));
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const previousComments = queryClient.getQueryData(["comments"]);
      return { previousComments };
    },
    onError: (err, variables, context) => {
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevCount) => prevCount + (liked ? 1 : -1));
      if (context?.previousComments) {
        queryClient.setQueryData(["comments"], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  function handleLikeClick(commentId) {
    mutate({ commentId, targetType: "Comment" });
  }

  // Toggle the reply box for a specific comment
  function handleReplyClick(commentId) {
    setOpenReplyId((prevId) => (prevId === commentId ? null : commentId));
  }

  return (
    <div className="p-4 my-2">
      <div className="flex items-center mb-2">
        <img
          src={profilePicture}
          alt={`${name}'s profile`}
          className="w-12 h-12 rounded-lg mr-3"
        />
        <div>
          <strong className="block">{name}</strong>
          <span className="text-gray-400">@{username}</span>
        </div>
      </div>
      <div className="mb-2">
        <p>{content}</p>
        {media && (
          <Gallery>
            <div className="mt-2 w-1/2">
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
            </div>
          </Gallery>
        )}
      </div>
      {/* Interaction Icons */}
      <div className="flex mt-4 space-x-4">
        {" "}
        {/* Added space between buttons */}
        <div
          className="flex items-center gap-2 px-3 py-2
           transition-all duration-300 cursor-pointer hover:bg-[#272626]
          rounded-full"
          onClick={() => handleLikeClick(_id)}
        >
          <FontAwesomeIcon
            icon={liked ? solidHeart : faHeart}
            className={`h-5 w-5 transition-colors duration-200 ${
              liked ? "text-red-600" : "group-hover:text-red-500"
            }`}
          />
          <p className="group-hover:text-white">{likesCount}</p>
        </div>
        <div
          className="flex items-center gap-2 group cursor-pointer 
        px-3 py-2 transition-all duration-300 rounded-full hover:bg-[#272626]"
          onClick={() => handleReplyClick(_id)} // Toggle reply box for this comment
        >
          <FontAwesomeIcon
            icon={faComment}
            className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-200"
          />
          <p className="group-hover:text-white">Reply</p>
        </div>
      </div>
      {/* Replies Section */}
      {!noNeedReplies && (
        <div className="mt-4">
          <Replies threadId={threadId} commentId={_id} />
        </div>
      )}
      {/* Conditionally render ReplyToReply based on the state */}
      {openReplyId === _id && (
        <ReplyToReply
          comment={comment}
          closeReplyId={() => setOpenReplyId(null)}
        />
      )}
      {/* <hr className="border-gray-300 my-2" /> Divider line */}
    </div>
  );
}

export default EachComment;
