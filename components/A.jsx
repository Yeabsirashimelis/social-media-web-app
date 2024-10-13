import Image from "next/image";

function A({ thread, setViewA }) {
  const {
    _id,
    poster: { name, username, profilePicture },
    content: threadContent,
  } = thread;

  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50">
      <div
        className="bg-[#1a1a1a] w-full max-w-xl h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[85vh] overflow-y-auto p-6 rounded-lg shadow-lg"
        // ref={ref}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src={profilePicture}
              alt={username}
              width={0}
              height={0}
              sizes="100vw"
              className="h-12 w-auto rounded-lg mr-4"
            />
            <div>
              <p className="text-lg font-semibold text-white">{name}</p>
            </div>
          </div>

          <button
            className="text-white hover:text-red-500"
            onClick={() => setViewA(false)}
          >
            ✕
          </button>
        </div>

        {/* Thread Info */}
        <div>
          <p className="mt-2 mb-2">{threadContent}</p>
          {thread.medias && (
            <div className="flex gap-2">
              {thread.medias.map((media) => (
                <div className="relative inset-0 w-1/2" key={media}>
                  <Image
                    src={media}
                    alt="media"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-lg w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <form>
          {/* Comment Input */}
          <textarea
            className="w-full p-2 mt-4 border bg-black rounded-lg"
            placeholder="Write your comment..."
            required
          ></textarea>
          {/* Media Add Field */}
          <div className="mt-4">
            <label className="block">Add Media</label>
            <input type="file" className="mt-2" />
          </div>

          <div className="flex justify-end mt-4">
            <button className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default A;
