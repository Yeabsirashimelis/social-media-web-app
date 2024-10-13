"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { editProfile, getProfile } from "@/services/ProfileApi";
import Spinner from "./Spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function EditProfile() {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getProfile(session?.user?.username),
    queryKey: ["profile", session?.user?.username],
  });
  useEffect(() => {
    if (data) {
      setValue("name", data.user?.name);
      setValue("interestedIn", data.user?.interestedIn);
      setValue("bio", data.user?.bio);
      setValue("phoneNumber", data.user?.phoneNumber);

      // Ensure the date is in YYYY-MM-DD format
      const formattedDate = new Date(data?.user?.dateOfBirth)
        .toISOString()
        .split("T")[0];
      setValue("dateOfBirth", formattedDate);
    }
  }, [data]);

  const { mutate, isPending: isEditting } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/profile");
    },
    onError: (err) => alert(err),
  });

  console.log(isEditting);

  function onSubmit(e) {
    const formData = new FormData();
    const values = getValues(); // Get the form values

    formData.append("name", values?.name);
    formData.append("bio", values?.bio);
    formData.append("phoneNumber", values?.phoneNumber);
    // formData.append("dateOfBirth", values.dateOfBirth);
    formData.append("interestedIn", values?.interestedIn);

    mutate(formData);
  }

  if (isLoading) return <Spinner loading={isLoading} />;
  return (
    <div className="min-h-screen">
      <form className="mx-auto px-3 py-2" onSubmit={handleSubmit(onSubmit)}>
        {/* Profile Header */}
        <div className="flex  items-center justify-between">
          <div className="rounded-lg shadow-lg flex  items-center">
            {/* Profile Picture */}
            <Image
              src={data?.user?.profilePicture}
              alt="Profile"
              height={0}
              width={0}
              sizes="100vw"
              className="h-16 w-16 object-cover rounded-lg"
            />
            <div className="ml-6">
              <label htmlFor="name" className="text-3xl font-bold">
                Name:
              </label>
              <input
                {...register("name")}
                id="name"
                name="name"
                type="text"
                className="ml-2 l bg-[#080808] text-white p-2 rounded-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#080808] px-4 py-2 rounded-md"
            disabled={isEditting}
          >
            <FontAwesomeIcon
              icon={faEdit}
              className="h-4 w-4 text-blue-400 hover:text-blue-500"
            />
            <p>{!isEditting ? "Save" : "editing Ur profile"}</p>
          </button>
        </div>

        <div className="flex mt-6 items-center bg-black px-2 py-1 rounded-md">
          <label htmlFor="bio" className="text-white">
            Interested In:
          </label>
          <input
            {...register("interestedIn")}
            id="interestedIn"
            name="interestedIn"
            type="text"
            className="ml-2 bg-[#080808] w-full text-white p-2 rounded-lg"
          />
        </div>

        <div className="mt-6 bg-[#080808] p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center bg-black px-2 py-1 rounded-md">
              <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-2" />
              <label htmlFor="bio" className="text-white">
                Bio:
              </label>
              <input
                {...register("bio")}
                id="bio"
                name="bio"
                type="text"
                className="ml-2 w-full bg-[#080808] text-white p-2 rounded-lg"
              />
            </div>
            <div className="flex items-center bg-black px-2 py-1 rounded-md">
              <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-2" />
              <label htmlFor="dateOfBirth" className="text-white">
                Birth Date:
              </label>
              <input
                {...register("dateOfBirth")}
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className="ml-2 bg-[#080808] text-white p-2 rounded-lg"
              />
            </div>
            <div className="flex items-center bg-black px-2 py-1 rounded-md">
              <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-2" />
              <label htmlFor="phoneNumber" className="text-white">
                Call:
              </label>
              <input
                {...register("phoneNumber")}
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="ml-2 bg-[#080808] text-white p-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/profile">
            <p className="text-blue-400 hover:underline">Cancel</p>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
