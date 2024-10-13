function Reply({ reply }) {
  const {
    commenter: { name, profilePicture, username },
    content,
  } = reply;

  return (
    <div>
      <div className="flex items-center gap-3">
        {/* Profile Picture */}
        <img
          src={profilePicture}
          alt={`${name}'s profile`}
          className="w-8 h-8 rounded-lg"
        />

        <div className="flex flex-row items-center gap-2">
          <p>{name}</p>
          <span className="text-gray-400 text-sm">@{username}</span>
        </div>
      </div>
      <p className="ml-12">{content}</p>
    </div>
  );
}

export default Reply;
