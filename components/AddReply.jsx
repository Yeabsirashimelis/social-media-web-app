import { useOutsideClick } from "@/hooks/useOutsideClick";
import { addComment } from "@/services/commentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import SmallSpinner from "./SmallSpinner";
import { motion } from "framer-motion"; // Import Framer Motion

function AddReply({ thread, setViewA, handleCloseViewA }) {
  const {
    _id,
    poster: { name, username, profilePicture },
    content: threadContent,
  } = thread;

  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null); // Image preview URL
  const queryClient = useQueryClient();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file)); // Create a URL for image preview
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
      setContent("");
      setMedia(null);
      setMediaPreview(null);
      handleCloseViewA();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("threadId", _id);

    if (media) {
      formData.append("media", media); // Only append media if it exists
    }

    mutate(formData);
  }

  const ref = useOutsideClick(handleCloseViewA);

  // Framer Motion variants for animation
  const modalVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: 100, transition: { duration: 0.3 } },
  };

  const mediaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="fixed inset-0 flex items-center z-[50] justify-center bg-black bg-opacity-50">
      {/* Motion div for the modal wrapper */}
      <motion.div
        className="bg-[#1a1a1a] max-w-xl h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[85vh] overflow-y-auto p-6 rounded-lg shadow-lg"
        ref={ref}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag // Optional: Enable dragging the modal around
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src={profilePicture}
              alt={username}
              width={0}
              height={0}
              sizes="100vw"
              className="h-12 w-auto rounded-lg mr-4"
            />
            <div>
              <p className="text-lg font-semibold text-white">{name}</p>
            </div>
          </div>

          <button
            className="text-white hover:text-red-500"
            onClick={() => handleCloseViewA()}
          >
            ✕
          </button>
        </div>

        {/* Thread Info */}
        <div>
          <p className="mt-2 mb-2">{threadContent}</p>
          {thread.medias && (
            <div className="flex gap-2">
              {thread.medias.map((media) => (
                <div className="relative inset-0 w-1/2" key={media}>
                  <Image
                    src={media}
                    alt="media"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-lg w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Comment Input */}
          <textarea
            className="w-full p-2 mt-4 border bg-black rounded-lg"
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          {/* Image Preview */}
          {mediaPreview && (
            <motion.div
              className="mt-4"
              variants={mediaVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-white">Image Preview:</p>
              <img
                src={mediaPreview}
                alt="Selected media preview"
                className="mt-2 w-full h-auto rounded-lg"
              />
            </motion.div>
          )}

          {/* Modal Footer */}
          <div className="mt-4">
            <label className="block">Add Media</label>
            <input type="file" className="mt-2" onChange={handleImageChange} />
          </div>

          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {isPending ? <SmallSpinner /> : "Reply"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddReply;
