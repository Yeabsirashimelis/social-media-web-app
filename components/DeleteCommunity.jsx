import { useState } from "react";
import { removeCommunity } from "@/services/communityApi";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function DeleteCommunity({ inviteLink, owner }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending, error } = useMutation({
    mutationFn: removeCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries(["communitiesRelatedToYou"]);
      router.push("/communities");
      setShowConfirm(false);
    },
    onError: () => {
      setShowConfirm(false);
    },
  });

  function handleRemoveCommunity() {
    mutate(inviteLink);
  }

  function handleConfirm() {
    setShowConfirm(true);
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  return (
    <div>
      <button
        className="text-left flex items-center gap-2 hover:text-red-400 transition-all"
        onClick={handleConfirm}
        disabled={isPending}
      >
        <FontAwesomeIcon icon={faDeleteLeft} />
        <p>Delete Community</p>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-[#2b2929] p-6 rounded-md shadow-lg w-80 text-white">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this community?</p>
            <div className="mt-6 flex justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleRemoveCommunity}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Confirm"}
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteCommunity;
