import React from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">

      {/* Left branding panel */}

      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-red-500 to-red-600 text-white p-12">

        <h1 className="text-4xl font-bold mb-6">
          DriveManager
        </h1>

        <p className="text-lg text-red-100 text-center max-w-md">
          Secure cloud storage platform for uploading,
          organizing, and sharing files with real-time access.
        </p>

      </div>

      {/* Right auth section */}

      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6">
        {children}
      </div>

    </div>
  );
}