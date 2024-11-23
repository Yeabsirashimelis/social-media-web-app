"use client";
import { useApp } from "@/appContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { addComment } from "@/services/commentApi";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

function AddComment() {
  const { removeCurrentThread, currentThread, setCurrentThread } = useApp();
  const {
    _id,
    poster: { name, username, profilePicture },
    content: threadContent,
  } = currentThread;

  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null); // Image preview URL

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
      setContent("");
      setMedia(null);
      setMediaPreview(null);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("media", media);
    formData.append("threadId", _id);

    mutate(formData);
  }

  const ref = useOutsideClick(() => removeCurrentThread(), false);

  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50">
      <div
        className="bg-[#1a1a1a] w-full max-w-xl h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[85vh] overflow-y-auto p-6 rounded-lg shadow-lg"
        // ref={ref}
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
            onClick={() => removeCurrentThread}
          >
            ✕
          </button>
        </div>

        {/* Thread Info */}
        <div>
          <p className="mt-2 mb-2">{threadContent}</p>
          {currentThread.medias && (
            <div className="flex gap-2">
              {currentThread.medias.map((media) => (
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
          {/* Media Add Field */}
          <div className="mt-4">
            <label className="block">Add Media</label>
            <input type="file" className="mt-2" onChange={handleImageChange} />
          </div>
          {/* Image Preview */}
          {mediaPreview && (
            <div className="mt-4">
              <p className="text-white">Image Preview:</p>
              <img
                src={mediaPreview}
                alt="Selected media preview"
                className="mt-2 w-full h-auto rounded-lg"
              />
            </div>
          )}
          {/* Modal Footer */}
          <div className="flex justify-end mt-4">
            <button
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                removeCurrentThread();
              }}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddComment;
