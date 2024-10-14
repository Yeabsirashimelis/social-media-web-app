import { useApp } from "@/appContext";
import { faArrowLeft, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import CommunityFollowers from "./CommunityFollowers";
import { useParams } from "next/navigation";
import { Gallery, Item } from "react-photoswipe-gallery";
import CommunityOperations from "./CommunityOperations";
import EditCommunityInfo from "./EditCommunityInfo";

function CommunityInfo({ community, numberOfFollowers }) {
  const [communityOperationsOpened, setCommunityOperationsOpened] =
    useState(false);
  const [editMode, setEditMode] = useState(false); // New state for editing mode
  const { setCommunityInfoOpened } = useApp();
  const { inviteLink } = useParams();

  const {
    data: {
      user: { id },
    },
  } = useSession();

  const isOwner = id?.toString() === community?.owner?.toString();
  const isAdmin = community?.Admins?.includes(id);
  const administer = isOwner || isAdmin;

  function closeModal() {
    setCommunityInfoOpened(false);
  }

  // Motion variants for smooth transitions
  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="absolute inset-0  flex items-start justify-center bg-black bg-opacity-50 z-[100]"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <motion.div
        className="relative bg-[#202020] mt-4 h-full max-w-[500px]
         w-full px-4 py-6 rounded-lg shadow-lg overflow-y-auto"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Back Arrow for Closing */}
        <div
          className="absolute top-4 left-4 cursor-pointer"
          onClick={closeModal}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-white text-2xl hover:text-gray-400 transition-colors"
          />
        </div>

        {/* Ellipsis Icon for community Options */}
        <div className="absolute top-4 right-4 cursor-pointer ">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="text-white text-2xl hover:text-gray-400 transition-colors"
            onClick={() => setCommunityOperationsOpened((prev) => !prev)}
          />
          {communityOperationsOpened && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 p-4 rounded-lg shadow-lg"
            >
              <CommunityOperations
                onEditClick={() => {
                  setCommunityOperationsOpened(false); // Close operations menu
                  setEditMode(true); // Open edit form
                }}
                inviteLink={inviteLink}
                owner={community.owner}
              />
            </motion.div>
          )}
        </div>

        {/* Conditionally Render Edit Form or Community Info */}
        {editMode ? (
          <EditCommunityInfo
            inviteLink={inviteLink}
            community={community}
            onCancel={() => setEditMode(false)} // Close edit mode
          />
        ) : (
          <div className="flex flex-col items-center mt-8 space-y-4">
            {/* Community Profile Picture and Info */}
            <div className="flex items-center gap-4">
              <Gallery>
                <Item
                  original={community?.profilePicture}
                  thumbnail={community?.profilePicture}
                  width="800"
                  height="1000"
                  className="rounded-full"
                >
                  {({ ref, open }) => (
                    <img
                      ref={ref}
                      onClick={open}
                      src={community?.profilePicture}
                      alt={community?.communityName}
                      className="w-16 h-16 rounded-xl shadow-lg object-cover"
                    />
                  )}
                </Item>
              </Gallery>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">
                  {community?.communityName}
                </h2>
                <p className="text-gray-400">{numberOfFollowers} followers</p>
                <p className="text-sm text-gray-500 capitalize mt-1">
                  {community?.communityType} community
                </p>
              </div>
            </div>

            {/* Community Description */}
            {community?.description && (
              <div className="w-full px-4 text-center">
                <h3 className="text-lg font-semibold text-white">
                  Description
                </h3>
                <p className="text-gray-300 mt-2">{community?.description}</p>
              </div>
            )}

            {/* Invite Link (For Public Communities) */}
            {community?.inviteLink && (
              <div className="w-full px-4 py-3 bg-[#252525] rounded-lg flex justify-between items-center hover:bg-[#353535] transition-colors cursor-pointer">
                <p className="font-semibold text-blue-500">Invite Link:</p>
                <p className="text-gray-300">{community?.inviteLink}</p>
              </div>
            )}

            <div
              className={`w-full grid mt-6 text-center ${
                administer ? "grid-cols-4" : "grid-cols-3"
              }`}
            >
              {administer && <div className="">Followers</div>}
              <div className="">Media</div>
              <div className="">Links</div>
              <div className="">Voice</div>
            </div>

            {administer && (
              <div className="w-full">
                <CommunityFollowers inviteLink={inviteLink} />
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default CommunityInfo;
