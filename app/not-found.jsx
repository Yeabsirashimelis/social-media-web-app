import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function NotFoundPage() {
  return (
    <section className="bg-black min-h-screen flex-grow">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-black px-6 py-24 mb-4 shadow-md rounded-md border border-gray-700 m-4 md:m-0">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-yellow-400 text-8xl h-[100px]"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mt-4 mb-2 text-white">
              Page Not Found
            </h1>
            <p className="text-gray-300 text-xl mb-10">
              The page you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
    </section>
  );
}

export default NotFoundPage;
