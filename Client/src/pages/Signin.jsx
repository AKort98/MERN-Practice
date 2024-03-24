import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice.js";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      //dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h3 className="text-4xl my-7 text-center font-semibold">Sign in</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="email"
          id="email"
          className="border p-2 rounded-lg"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          className="border p-2 rounded-lg"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-green-500 p-2 rounded-lg text-white uppercase hover:opacity-90 disabled:opacity-70"
        >
          {loading ? "loading...." : "Sign in"}
        </button>
      </form>
      <div className="flex gap-1 mt-4">
        <p>{"Don't "}have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-600">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
