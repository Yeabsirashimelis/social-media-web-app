import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Reply from "./Reply"; // Assuming this component renders individual replies
import { useQuery } from "@tanstack/react-query";
import { getReplies } from "@/services/commentApi";
import SmallSpinner from "./SmallSpinner";

function Replies({ threadId, commentId }) {
  const [isOpen, setIsOpen] = useState(false);
  function toggleReplies() {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  const {
    data: replies,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getReplies(threadId, commentId),
    queryKey: ["replies", threadId, commentId],
  });

  console.log(replies);

  if (isLoading) <SmallSpinner />;
  if (!replies?.length) return null;
  return (
    <div className="mt-2">
      {/* Button to toggle replies */}
      <div
        className="flex items-center gap-2 group cursor-pointer px-3 py-2 transition-all duration-300 rounded-full text-sm "
        onClick={toggleReplies}
      >
        {isOpen ? "Hide replies" : `View ${replies.length} replies`}
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {/* Conditionally render replies */}
      {isOpen && (
        <div className="pl-6 mt-3 space-y-2">
          {replies.map((reply) => (
            <Reply key={reply._id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Replies;
