import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserSearchPage() {
  return (
    <div className="mx-auto px-3 py-2  rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-white mb-4">Search</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          className="block w-full bg-[#080808] border text-gray-600   py-2 px-4 pl-10 outlineborder border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:text-sm-none "
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
}

export default UserSearchPage;
