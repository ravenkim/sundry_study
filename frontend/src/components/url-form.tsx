import React from 'react';

type Props = {};

const UrlForm = (props: Props) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Github PR/Commit Link
      </label>
      <div className="flex flex-row">
        <input
          type="text"
          id="github_url"
          className="grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="https://github.com/fika-dev/fika-cli/pull/331"
          required
        />
        <div className="w-4"></div>
        <button
          type="submit"
          className="text-cyan-300 bg-sky-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-sky-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UrlForm;
