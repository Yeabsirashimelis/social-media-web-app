import { faDeleteLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteCommunity from "./DeleteCommunity";
import { useSession } from "next-auth/react";

function CommunityOperations({ onEditClick, inviteLink, owner }) {
  const { data: session } = useSession();

  const isOwner = owner.toString() === session?.user?.id;

  return (
    <div className="p-3 flex text-gray-300 flex-col w-[11rem] bg-[#2b2929] z-[110] text-sm rounded-lg shadow-lg">
      <button
        className="text-left flex items-center gap-2 hover:text-white transition-all"
        onClick={onEditClick}
      >
        <FontAwesomeIcon icon={faEdit} />
        <p>Edit Info</p>
      </button>
      {isOwner && <DeleteCommunity inviteLink={inviteLink} owner={owner} />}
    </div>
  );
}

export default CommunityOperations;
