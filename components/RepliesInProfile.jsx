"use client";

import { getYourReplies } from "@/services/ProfileApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ThreadCard from "./ThreadCard";
import Spinner from "./Spinner";
import Reply from "./Reply";
import EachComment from "./EachComment";
import { useState } from "react";

function RepliesInProfile() {
  const [openReplyId, setOpenReplyId] = useState(null);
  const { username } = useParams();
  console.log(username);
  const { data, isFetching, error } = useQuery({
    queryKey: ["yourReplies", username],
    queryFn: () => getYourReplies(username),
  });

  if (isFetching) return <Spinner />;
  console.log(data);
  return (
    <div>
      {data?.map((d, threadIdx) => (
        <div
          key={threadIdx}
          className="bg-[#1a1a1a] rounded-lg mb-12 px-4 py-4"
        >
          <ThreadCard thread={d.thread} />
          {d.parentComments.map((parentComment, commentIdx) => (
            <div key={parentComment.commentInfo._id} className="relative">
              {/* Render the parent comment */}
              <EachComment
                comment={parentComment.commentInfo}
                openReplyId={openReplyId}
                setOpenReplyId={setOpenReplyId}
              />

              {/* Vertical line to separate replies */}
              <div className="absolute left-0 top-0 h-full border-l-2 border-gray-600"></div>

              {/* Conditionally render replies to the parent comment */}
              {parentComment?.replies?.length > 0 && (
                <div className="ml-8 mt-2 bg-gray-800 p-2 rounded-md">
                  {parentComment.replies.map((reply, replyIdx) => (
                    <Reply key={reply._id} reply={reply} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default RepliesInProfile;
