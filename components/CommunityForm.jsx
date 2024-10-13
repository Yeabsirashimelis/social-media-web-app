import { useApp } from "@/appContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { createCommunity } from "@/services/communityApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SmallSpinner from "./SmallSpinner";
import { motion } from "framer-motion";

function CommunityForm() {
  const { communityFormOpened, closeCommunityForm } = useApp();
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [communityType, setCommunityType] = useState("public");
  const queryClient = useQueryClient();

  if (!communityFormOpened) return null;

  const ref = useOutsideClick(closeCommunityForm);

  // Handle Profile Image Selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const { mutate, isPending: isCreatingCommunity } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      setProfilePicture(null);
      setPreview(null);
      setCommunityName("");
      setDescription("");
      setCommunityType("public");
      queryClient.invalidateQueries(["communitiesRelatedToYou"]);
    },
    onError: (err) => alert(err),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("communityName", communityName);
    formData.append("description", description);
    formData.append("communityType", communityType);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    mutate(formData);
  }

  // Motion variants for staggered form fields
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
        staggerChildren: 0.1, // Stagger form fields appearance
      },
    },
  };

  // Motion variants for modal transitions
  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="absolute inset-0  flex items-center justify-center z-[100]  bg-black bg-opacity-50 backdrop-blur-sm"
      ref={ref}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <motion.div
        className="relative bg-[#202020]  max-w-[700px]   mx-8 h-[90vh] sm:h-[75vh]  p-6 rounded-lg shadow-lg overflow-y-auto"
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} // Optional: Limit the drag area
        dragElastic={0.5} // Optional: Control the elasticity of the drag
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Profile Preview Section */}
          <div className="sm:w-[30%] w-full sm:mr-6 flex flex-col items-center mb-6 sm:mb-0">
            <div className="w-[150px] h-[150px] bg-[#333] rounded-2xl flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-white text-sm">Add Profile</span>
              )}
            </div>
            <label
              htmlFor="profilePicture"
              className="mt-4 text-white cursor-pointer text-sm bg-black px-4 py-2 rounded-md hover:bg-opacity-80"
            >
              Upload Profile
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>

          {/* Form Section */}
          <motion.div
            className="sm:w-[70%] w-full"
            initial="hidden"
            animate="visible"
            variants={formVariants} // Apply stagger animation
          >
            <h1 className="text-white text-xl mb-4">Create Community</h1>

            <button
              className="absolute top-2 text-3xl lg:text-4xl right-2 text-white hover:text-red-500"
              onClick={closeCommunityForm}
            >
              ✕
            </button>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Community Name Input */}
              <motion.div variants={formVariants}>
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor="communityName"
                >
                  Community Name
                </label>
                <input
                  type="text"
                  id="communityName"
                  className="w-full px-3 py-2 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-black hover:scale-105 transition-transform"
                  placeholder="Enter community name"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  required
                />
              </motion.div>

              {/* Description Input */}
              <motion.div variants={formVariants}>
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  className="w-full px-3 py-2 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-black hover:scale-105 transition-transform"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </motion.div>

              {/* Community Type Selection */}
              <motion.div variants={formVariants}>
                <label className="block text-white text-sm font-bold mb-2">
                  Community Type
                </label>
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
              </motion.div>

              <motion.div
                variants={formVariants}
                className="bg-[#080808] px-4 py-2"
              >
                <p>
                  We will create an invite link for your community and you can
                  rename it once it's created. 👋
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={formVariants} className="flex justify-end">
                {isCreatingCommunity ? (
                  <SmallSpinner />
                ) : (
                  <motion.button
                    type="submit"
                    className="bg-black text-white font-bold mt-4 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black hover:scale-105 transition-transform"
                    whileTap={{ scale: 0.95 }} // Shrink effect on tap
                    disabled={isCreatingCommunity}
                  >
                    Create Community
                  </motion.button>
                )}
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CommunityForm;
