"use client";
import ThreadCard from "./ThreadCard";

function ContentInProfile({ data }) {
  const { user } = data;
  let threads = [];

  data.threads.map((d) => {
    let thread = {
      ...d,
      poster: {
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    };
    threads.push(thread);
  });

  if (!data.threads.length) return null;

  return (
    <div>
      {threads.map((thread, idx) => (
        <ThreadCard thread={thread} key={idx} />
      ))}
    </div>
  );
}

export default ContentInProfile;
