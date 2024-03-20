import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Zillow</span>
            <span className="text-green-600">Clone</span>
          </h1>
        </Link>
        <form
          action=""
          className="bg-slate-100 p-2 rounded-md flex items-center"
        >
          <input
            type="text"
            name="search"
            id=""
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-400" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className="sm:inline text-slate-700 hover:underline cursor-pointer">
              Sign in
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
