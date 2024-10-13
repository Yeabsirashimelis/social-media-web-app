"use client";
import Image from "next/image";
import logo from "../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareInstagram } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHome,
  faNewspaper,
  faPlus,
  faSearch,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "next-auth/react";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <div
      className="fixed md:relative z-50 bottom-0 left-0 w-full md:w-auto
     md:h-full bg-black md:bg-transparent p-2 flex
      md:flex-col justify-around md:justify-start items-center
       md:items-start gap-4  md:mt-16"
    >
      <div className="flex md:flex-col md:gap-6 gap-4">
        <Link href="/">
          <NavItem icon={faHome} text="Home" />
        </Link>
        <Link href="/search-users">
          <NavItem icon={faSearch} text="Search" />
        </Link>
        <Link href={"/activity"}>
          <NavItem icon={faHeart} text="Activities" />
        </Link>
        <Link href="/create-thread">
          <NavItem icon={faPlus} text="Create Thread" />
        </Link>
        <Link href="/communities">
          <NavItem icon={faUsers} text="Communities" />
        </Link>
        <Link href={`/profile/${session?.user?.username}`}>
          <NavItem icon={faUser} text="Profile" />
        </Link>
      </div>
    </div>
  );
}

function NavItem({ icon, text }) {
  return (
    <div
      className="flex gap-2 items-center text-gray-300 hover:text-white transition-colors
     duration-300 hover:bg-[#1d1c1c] px-3 py-3 rounded-lg cursor-pointer"
    >
      <FontAwesomeIcon icon={icon} className="h-6 w-6 text-[#494141]" />
      <span className="hidden between-md-lg:inline">{text}</span>
    </div>
  );
}

export default NavBar;
