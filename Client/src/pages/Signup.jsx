import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (data.success === false) {
        seterror(data);
        setLoading(false);
        return;
      }
      setLoading(false);
      seterror(null);
      navigate("/sign-in");
    } catch (error) {
      seterror(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h3 className="text-4xl my-7 text-center font-semibold">Signup</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          id="username"
          className="border p-2 rounded-lg"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
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
          {loading ? "loading...." : "Sign up"}
        </button>
      </form>
      <div className="flex gap-1 mt-4">
        <p>Have an account? </p>
        <Link to="/sign-in">
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-600">{error.message}</p>}
    </div>
  );
}
