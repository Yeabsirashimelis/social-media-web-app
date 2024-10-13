"use client";
import { useApp } from "@/appContext";
import { faSquareInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommunityForm from "./CommunityForm";

function Logo() {
  const { data: session } = useSession(); // Correctly invoke useSession
  const [providers, setProviders] = useState(null);
  const { communityFormOpened, openCommunityForm } = useApp();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setAuthProviders();
  }, []);

  return (
    <div className="flex justify-center md:gap-2 md:justify-start px-6 md:px-8 py-2 between-md-lg:flex between-md-lg:gap-2 items-center md:flex">
      <Link href="/">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faSquareInstagram} className="h-8 w-8" />
          <h1 className="text-lg font-semibold ml-2">YabuGram</h1>
        </div>
      </Link>
      <div className="ml-auto">
        {!session ? (
          providers &&
          Object.values(providers).map((provider, idx) => (
            <button
              key={idx}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => signIn(provider.id)}
            >
              Register or Sign In
            </button>
          ))
        ) : (
          <div className="flex items-center gap-4">
            <button
              className="hidden sm:block px-4 py-2  bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
            <div>
              <button
                className="px-2 py-2 text-sm  border text-white rounded-lg "
                onClick={openCommunityForm}
              >
                create community
              </button>
            </div>
            {communityFormOpened && <CommunityForm />}
            {/* <div className="flex items-center gap-2">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt="Profile Picture"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-white hidden sm:block">
                {session.user.name}
              </span>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Logo;
