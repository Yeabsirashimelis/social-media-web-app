"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useMutation } from "@tanstack/react-query";
import { createFullProfile } from "@/services/ProfileApi";

export default function ModalProfileComplete() {
  const [name, setName] = useState("yeabsira");
  const [bio, setBio] = useState("i love dorowot");
  const [phoneNumber, setPhoneNumber] = useState("0942110161");
  const [dateOfBirth, setDateOfBirth] = useState("2024-09-12");
  const [interestedIn, setInterestedIn] = useState("software development");
  const [profilePicture, setProfilePicture] = useState(null);

  const { data: session, status } = useSession();
  const [isProfileComplete, setProfileComplete] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if the user's profile is incomplete (based on session.user.isProfileComplete)
      setProfileComplete(session.user.isProfileComplete);
    }
  }, [session, status]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createFullProfile,
    onSuccess: () => {
      // alert("Profile updated successfully!");
      session.user.isProfileComplete = true; // Update the session status
      setProfileComplete(true); // Hide the modal after completion
    },
    onError: (err) => alert(err),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("phoneNumber", phoneNumber);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("interestedIn", interestedIn);
    formData.append("profilePicture", profilePicture);

    mutate(formData);
  }

  // Show a spinner while session status is loading
  if (status === "loading") {
    return (
      <div>
        <Spinner loading={true} />
      </div>
    );
  }

  // If the profile is complete, don't show the modal
  if (isProfileComplete || !session === true) return null;

  // Modal content to complete profile
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-100">
      <div className="relative z-[10000] bg-[#080808] text-white rounded-lg p-8 shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2.5"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2.5"
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2.5"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2.5"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          {/* Interested In / Job*/}
          <div>
            <label className="block text-sm font-medium mb-2">
              A bit about your Job/ Interested In
            </label>
            <input
              type="text"
              name="interestedInOrJob"
              className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2.5"
              required
              value={interestedIn}
              onChange={(e) => setInterestedIn(e.target.value)}
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePicture"
              className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2.5"
              accept="image/*"
              required
              onChange={handleImageChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            disabled={isPending}
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}
