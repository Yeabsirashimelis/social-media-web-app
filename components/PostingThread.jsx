import React, { useState } from "react";

const PostingThread = ({ isPosting }) => {
  if (!isPosting) return null;

  return (
    <div className="absolute inset-5 flex justify-center items-center h-screen ">
      {isPosting && (
        <div className="relative flex flex-col items-center justify-center p-10 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-lg">
          {/* Loader */}
          <div className="loader"></div>
          {/* Loading Text */}
          <h2 className="text-2xl font-bold text-gray-200 mt-4">
            Posting your thread...
          </h2>
        </div>
      )}
    </div>
  );
};

export default PostingThread;
