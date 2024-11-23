import { useQuery } from "@tanstack/react-query";
import { getThreads } from "@/services/threadApi";
import Spinner from "./Spinner";
import ThreadCard from "./ThreadCard";

function Threads() {
  const {
    data: threads,
    isLoading,
    error,
  } = useQuery({ queryFn: getThreads, queryKey: ["threads"] });

  if (isLoading) return <Spinner loading={isLoading} />;
  if (error) return <p className="text-5xl">ERROR</p>;
  return (
    <>
      <div className="min-h-screen grid grid-cols-1 mx-auto gap-6">
        {threads.map((thread) => (
          <ThreadCard thread={thread} key={thread._id} />
        ))}
      </div>
    </>
  );
}

export default Threads;
