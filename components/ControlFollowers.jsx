import { promoteToAdmin, removeFollower } from "@/services/communityApi";
import { faMinus, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function ControlFollowers({
  follower,
  isAdmin,
  onRemove,
  inviteLink,
  onPromote,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false); // State to handle confirmation

  const {
    mutate: mutateAdminStuff,
    isLoading: adminStuffLoading,
    error: adminStuffError,
  } = useMutation({
    mutationFn: promoteToAdmin,
    onSuccess: () => {
      onPromote(follower); // Update the array in useState after successful promotion
    },
    onError: () => {
      // Handle any error during promotion
    },
  });

  const {
    mutate: removeFollowerStuffMutate,
    isLoading: removeFollowerStuffLoading,
    error: removeFollowerStuffError,
  } = useMutation({
    mutationFn: removeFollower,
    onSuccess: () => {
      onRemove(follower); // Update the array in useState after successful removal
    },
    onError: () => {
      // Handle any error during removal
    },
  });

  function handlePromoteToAdmin() {
    const formData = new FormData();
    formData.append("followerId", follower);

    mutateAdminStuff({ inviteLink, formData });
  }

  function handleRemoveFollower() {
    if (confirmingDelete) {
      removeFollowerStuffMutate({ inviteLink, follower });
    } else {
      setConfirmingDelete(true); // Show confirmation prompt
    }
  }

  function cancelDelete() {
    setConfirmingDelete(false); // Cancel the deletion process
  }

  return (
    <div className="absolute text-sm top-0 right-4 mt-1 space-y-1 bg-[#2b2929] p-3 rounded-lg shadow-lg w-[10rem] z-50">
      <button
        className="flex items-center text-gray-300 text-left hover:text-white w-full transition-all"
        onClick={handlePromoteToAdmin}
        disabled={adminStuffLoading}
      >
        <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
        <p>{!isAdmin ? "promote to admin" : "dismiss admin"}</p>
      </button>
      {confirmingDelete ? (
        <div className="text-red-600 flex flex-col items-center space-y-2">
          <p>Are you sure?</p>
          <div className="flex space-x-2">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              onClick={handleRemoveFollower}
              disabled={removeFollowerStuffLoading}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
              onClick={cancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-red-600 flex items-center text-left font-semibold hover:text-red-700 w-full transition-all"
          onClick={handleRemoveFollower}
          disabled={removeFollowerStuffLoading}
        >
          <FontAwesomeIcon
            icon={faMinus}
            className="border rounded-full mr-2 border-red-600"
          />
          <p>remove user</p>
        </button>
      )}
    </div>
  );
}

export default ControlFollowers;
