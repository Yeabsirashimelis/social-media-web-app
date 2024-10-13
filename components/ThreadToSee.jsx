"use client";

import { getThreadById } from "@/services/threadApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Spinner from "./Spinner";
import ThreadCard from "./ThreadCard";
import Comments from "./Comments";

function ThreadToSee() {
  const { id: threadId } = useParams();

  const {
    data: thread,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getThreadById(threadId),
    queryKey: ["thread", threadId],
  });

  if (isLoading) return <Spinner isLoading={isLoading} />;
  return (
    <div>
      <ThreadCard thread={thread} />
      <Comments threadId={threadId} />
    </div>
  );
}

export default ThreadToSee;
