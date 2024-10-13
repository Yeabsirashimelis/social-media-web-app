"use client";
import Threads from "@/components/threads";
import Header from "@/customcomponents/Header";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter();
  console.log(router.pathname);
  return (
    <div className=" min-h-screen">
      <h1
        className="text-[50px] font-bold bg-gradient-to-t from-gray-300 to-white
       bg-clip-text text-transparent mb-3
      m-0 md:text-[40px] sm:text-[30px] xs:text-[20px]"
      >
        Threads
      </h1>
      <Threads />
    </div>
  );
}

export default HomePage;
