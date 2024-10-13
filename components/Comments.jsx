"use client";

import { getComments } from "@/services/commentApi";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import EachComment from "./EachComment";
import { useState } from "react";

function Comments({ threadId }) {
  const [openReplyId, setOpenReplyId] = useState(null);

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getComments(threadId),
    queryKey: ["comments", threadId],
  });

  if (isLoading) return <Spinner loading={isLoading} />;
  if (error) return <div>Error loading comments</div>;

  return (
    <div className="bg-[#1a1a1a]  px-4 py-4">
      <h1>Comments</h1>
      <hr className="border-gray-300 my-2" />
      {comments.length === 0 ? (
        <div className="text-gray-100 text-center my-4">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        comments.map((comment) => (
          <EachComment
            comment={comment}
            key={comment._id}
            openReplyId={openReplyId}
            setOpenReplyId={setOpenReplyId}
          />
        ))
      )}
    </div>
  );
}

export default Comments;
