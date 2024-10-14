import { editCommunityInfo } from "@/services/communityApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function EditCommunityInfo({ inviteLink, community, onCancel }) {
  const [communityName, setCommunityName] = useState(community.communityName);
  const [description, setDescription] = useState(community.description);
  const [communityType, setCommunityType] = useState(community.communityType);
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: editCommunityInfo,
    onSuccess: () => {
      //I will make something there like a toaster
      onCancel();
      queryClient.invalidateQueries(["community", inviteLink]);
    },
    onError: () => {
      //I will make something there like a toaster
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("communityName", communityName);
    formData.append("description", description);
    formData.append("communityType", communityType);

    mutate({ formData, inviteLink });
  }

  return (
    <div className="mt-9">
      <h3 className="text-xl font-bold mb-4">Edit Community Info</h3>
      <form onSubmit={handleSubmit}>
        {/* Example input fields for editing community */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Community Name
          </label>
          <input
            type="text"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            className="w-full px-3 py-2 bg-[#333]  text-white 
            rounded-md focus:outline-none
             hover:scale-105 transition-transform"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[#333] text-white 
             rounded-md focus:outline-none 
             hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-white">
            <input
              type="radio"
              name="communityType"
              value="public"
              checked={communityType === "public"}
              onChange={() => setCommunityType("public")}
            />
            <span className="ml-2">Public</span>
          </label>
          <label className="text-white">
            <input
              type="radio"
              name="communityType"
              value="private"
              checked={communityType === "private"}
              onChange={() => setCommunityType("private")}
            />
            <span className="ml-2">Private</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          {!isPending && (
            <button
              type="button"
              className="bg-gray-500 text-white font-bold mt-4 py-2 px-4 rounded-md outline-none hover:scale-105 transition-transform"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-black text-white font-bold mt-4 py-2 px-4 rounded-md outline-none hover:scale-105 transition-transform"
            disabled={isPending}
          >
            {isPending ? "Updating Info..." : "update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCommunityInfo;
