import Image from "next/image";
import img1 from "../../assets/images/img2.jpg";

const activities = [
  "dagim replied to your thread",
  "shimelis replied to your thread",
  "Abiyot replied to your thread",
  "buchi replied to your thread",
];

function Page() {
  return (
    <div className="mx-auto px-3 py-2 rounded-lg shadow-lg ">
      <h1 className="text-2xl font-semibold mb-4">Activity</h1>

      {activities.map((activity, idx) => {
        const [username, ...rest] = activity.split(" ");
        const message = rest.join(" ");

        return (
          <div
            key={idx}
            className="bg-[#080808] flex gap-2 items-center rounded-md mb-2 px-4 py-2"
          >
            <Image
              src={img1}
              width={0}
              height={0}
              sizes="100vw"
              className="h-5 w-5 rounded-full"
            />
            <span className=" font-normal text-blue-400 hover:text-blue-700">
              {username}
            </span>
            {message}
          </div>
        );
      })}
    </div>
  );
}

export default Page;
