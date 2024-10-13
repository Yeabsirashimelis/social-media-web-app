import { promoteToAdmin } from "@/services/communityApi";
import { faMinus, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";

function ControlFollowers({ follower, isAdmin, inviteLink, onPromote }) {
  console.log(isAdmin);
  const { mutate, isLoading, error } = useMutation({
    mutationFn: promoteToAdmin,
    onSuccess: () => {
      onPromote(follower); // Call the promote function on success
    },
    onError: () => {
      //I could do something here
    },
  });

  function handleSubmit() {
    const formData = new FormData();
    formData.append("followerId", follower);

    mutate({ inviteLink, formData });
  }

  return (
    <div className="absolute text-sm top-0 right-4 mt-1 space-y-1 bg-[#2b2929] p-3 rounded-lg shadow-lg w-[10rem] z-50">
      <button
        className="flex items-center text-gray-300 text-left hover:text-white w-full transition-all"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
        <p>{!isAdmin ? "promote to admin" : "dismiss admin"}</p>
      </button>
      <button className="text-red-600 flex items-center text-left font-semibold hover:text-red-700 w-full transition-all">
        <FontAwesomeIcon
          icon={faMinus}
          className="border rounded-full mr-2 border-red-600"
        />
        <p>remove user</p>
      </button>
    </div>
  );
}

export default ControlFollowers;
