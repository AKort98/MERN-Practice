import React from "react";
import g from "../assets/g.svg";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      className="bg-red-700 text-red-200 p-3 rounded-lg flex items-center justify-center opacity-90 hover:opacity-100 uppercase gap-2"
      onClick={handleGoogleAuth}
    >
      <span>
        <img className="w-5" src={g} alt="" />
      </span>
      Continue with Google
    </button>
  );
}
