import { createThread } from "@/services/threadApi";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
// Modal Component
function PostImageInCommunityModal({ medias, setMedias, setModalOpened }) {
  const { inviteLink } = useParams();
  const queryClient = useQueryClient();

  function closeModal() {
    setModalOpened(false);
    setMedias([]);
  }

  const [content, setContent] = useState("");

  const {
    mutate,
    isPending: isPosting,
    error: postError,
  } = useMutation({
    mutationFn: createThread,
    onSuccess: (data) => {
      setModalOpened(false);
      setMedias([]);
      queryClient.invalidateQueries(["community", inviteLink]);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("threadType", "community");
    formData.append("inviteLink", inviteLink);

    if (medias.length > 0) {
      medias.forEach((media) => {
        formData.append("medias", media);
      });
    }

    mutate(formData);
  }

  if (postError) return <Error />;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-[100]  bg-black bg-opacity-50">
      <div className="relative bg-[#202020] w-full max-w-[500px] h-auto mx-8 sm:h-[60vh] lg:h-[65vh] p-6 rounded-lg shadow-lg overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Post Media</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))]  gap-2 mb-4">
          {Array.from(medias).map((file, index) => (
            <Image
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              height={0}
              width={0}
              sizes="100vw"
              className="object-cover h-full w-auto rounded-md"
            />
          ))}
        </div>

        <div>
          <label htmlFor="caption">caption</label>
          <textarea
            id="caption"
            placeholder=""
            className="mt-1 block w-full outline-none bg-black px-4 py-4 rounded-md shadow-xl sm:text-sm"
            rows={1}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="absolute top-2 text-3xl  right-2 text-white hover:text-red-500"
            onClick={closeModal}
          >
            ✕
          </button>

          <div className="flex gap-3 items-center">
            <button
              className="bg-[#140303] text-white font-bold mt-4 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              onClick={closeModal}
            >
              cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white font-bold mt-4 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              onClick={handleSubmit}
            >
              {isPosting ? "posting..." : "post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostImageInCommunityModal;
