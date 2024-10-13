import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ThreadPosted({ threadId }) {
  const [showText, setShowText] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  function handleClose() {
    setShowText(false);
  }

  function handleViewThread() {
    if (session && threadId) {
      router.push(`/${session.user.username}/post/${threadId}`);
    }
  }

  return (
    <div className="absolute inset-5 flex justify-center items-center h-screen">
      {showText && (
        <div className="relative flex flex-col items-center justify-center py-2 px-4 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-lg">
          <button
            className="absolute top-1 right-1 text-gray-400 hover:text-white focus:outline-none"
            onClick={handleClose}
          >
            ✕
          </button>
          <div className="flex items-center py-2 pl-2 pr-12 gap-12 justify-between">
            {" "}
            <h2 className="text-2xl font-bold text-gray-200 ">Posted</h2>
            <button
              className="   rounded text-blue-400 hover:text-blue-600"
              onClick={handleViewThread}
            >
              View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreadPosted;
