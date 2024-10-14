"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faImage } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { createThread } from "@/services/threadApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PostingThread from "./PostingThread";
import { useSession } from "next-auth/react";
import ThreadPosted from "./ThreadPosted";

function ThreadForm() {
  const [medias, setMedias] = useState([]);
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending: isPosting,
    error,
  } = useMutation({
    mutationFn: createThread,
    onSuccess: (data) => {
      setThreadId(data);
      setSuccess(true);
      // I will some something here
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      setMedias([]);
      setContent("");
      setHashtags("");
    },
    // I will do something here too
  });

  function handleSubmit(e) {
    e.preventDefault();
    const cleanedHashtags = hashtags
      .toString()
      .split(",")
      .map((tag) =>
        tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`
      );
    setHashtags(cleanedHashtags);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("hashtags", hashtags);

    //Append the media files if only they exist
    if (medias.length > 0) {
      medias.forEach((media) => {
        formData.append("medias", media);
      });
    }

    mutate(formData);
  }

  function handleImageChange(e) {
    const { files } = e.target;
    const fileArray = Array.from(files);
    setMedias(fileArray);
  }

  return (
    <div className="relative mx-auto min-h-screen px-3 py-2 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Thread</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="10"
            placeholder="Write your content here..."
            className="mt-1 block w-full px-4 py-4 bg-[#080808] border border-gray-600 rounded-md
              shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="hashtags" className="block text-sm font-medium">
            Hashtags (comma separated)
          </label>
          <input
            id="hashtags"
            name="hashtags"
            type="text"
            placeholder="#example, #coding, #fun"
            className="mt-1 block w-full px-4 py-4 bg-[#080808] border border-gray-600 rounded-md
              shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="medias"
            className="text-sm font-medium text-gray-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faImage} className="h-5 w-5" />
            <span>
              Media (optional): Add Photos or Videos to describe your thread to
              the world
            </span>
          </label>
          <input
            id="medias"
            name="medias"
            type="file"
            multiple
            className="mt-1 block w-full text-sm border border-gray-600
              rounded-md cursor-pointer bg-[#080808]"
            onChange={handleImageChange}
          />
        </div>

        {medias.length && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {medias.map((image, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="items-center px-4 py-2 border w-[60%] bg-[#080808] border-transparent
              rounded-md shadow-sm text-white font-medium hover:bg-[#1a1919]"
            disabled={isPosting}
          >
            <FontAwesomeIcon icon={faPaperclip} className="mr-2 h-5 w-5" />
            {isPosting ? " Posting your Thread" : "Post thread"}
          </button>
        </div>
      </form>
      {isPosting && <PostingThread isPosting={isPosting} />}
      {threadId && <ThreadPosted threadId={threadId} />}
    </div>
  );
}

export default ThreadForm;
