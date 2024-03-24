import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full size-20 object-cover cursor-pointer self-center mt-7"
        />
        <input
          type="text"
          placeholder="username"
          className="border p-2 rounded-lg shadow-md"
          id="username"
          value={currentUser.username}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-2 rounded-lg shadow-md"
          id="email"
          value={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2 rounded-lg shadow-md"
          id="password"
        />
        <button
          className="bg-blue-700 p-3 rounded-lg text-white text-xl uppercase opacity-95 hover:opacity-100
        disabled:opacity-75 "
        >
          Update
        </button>
      </form>
      <div className="flex items-center justify-between mt-5">
        <span className="text-red-600 hover:text-red-700 cursor-pointer">
          Delete Account ?
        </span>
        <span className="text-red-600 hover:text-red-700 cursor-pointer">
          Logout
        </span>
      </div>
    </div>
  );
}
