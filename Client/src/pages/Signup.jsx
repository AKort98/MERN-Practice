import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h3 className="text-4xl my-7 text-center font-semibold">Signup</h3>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          id="username"
          className="border p-2 rounded-lg"
          placeholder="username"
        />
        <input
          type="text"
          name="email"
          id="email"
          className="border p-2 rounded-lg"
          placeholder="email"
        />
        <input
          type="text"
          name="password"
          id="password"
          className="border p-2 rounded-lg"
          placeholder="password"
        />
        <button className="bg-green-500 p-2 rounded-lg text-white uppercase hover:opacity-90 disabled:opacity-70">
          Sign up
        </button>
      </form>
      <div className="flex gap-1 mt-4">
        <p>Have an account? </p>
        <Link to="/sign-in">
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
