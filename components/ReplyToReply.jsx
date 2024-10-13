"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { addComment } from "@/services/commentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SmallSpinner from "./SmallSpinner";

function ReplyToReply({ comment, closeReplyId }) {
  const {
    commenter: { name, profilePicture, username },
    _id: commentId,
  } = comment;

  const threadId =
    typeof comment.thread === "object" ? comment.thread._id : comment.thread;

  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["replies"]);
      setContent("");
      closeReplyId();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("threadId", threadId);
    formData.append("commentId", commentId);

    mutate(formData);
  }

  return (
    <div className="p-4   bg-[#0e0d0d]  text-gray-50 rounded-lg shadow-md mt-4">
      <h4 className="font-semibold mb-3">Reply to {name}</h4>
      <div className="flex items-center gap-3 mb-4">
        {/* Profile Picture */}
        <img
          src={profilePicture}
          alt={`${name}'s profile`}
          className="w-10 h-10 rounded-lg border border-gray-300"
        />
        <p className="text-sm text-gray-300">@{username}</p>
      </div>
      <form className="flex items-center gap-3" onSubmit={handleSubmit}>
        {/* Input for the reply */}
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply..."
          className="flex-grow p-3 rounded-full border bg-[#1a1a1a] border-gray-300 focus:border-blue-400 focus:outline-none transition-colors duration-200"
        />
        {/* Submit button */}
        <button
          type="submit"
          className="rounded-full text-blue-200 hover:text-blue-600 transition-all duration-300 shadow-md w-9 "
          disabled={isPending}
        >
          {!isPending ? (
            <FontAwesomeIcon icon={faPaperPlane} className="h-7 w-7" />
          ) : (
            <SmallSpinner />
          )}
        </button>
      </form>
    </div>
  );
}

export default ReplyToReply;
