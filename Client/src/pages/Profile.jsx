import { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSucces, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleEdit = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateSuccess(false);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      } else {
        dispatch(signOutUserSuccess(data));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full size-20 object-cover cursor-pointer self-center mt-7"
        />
        <p className="text-sm text-center">
          {fileError ? (
            <span className="text-red-500">Error in upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-red-500">{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-400">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-2 rounded-lg shadow-md"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleEdit}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-2 rounded-lg shadow-md"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleEdit}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2 rounded-lg shadow-md"
          id="password"
          onChange={handleEdit}
        />
        <button
          disabled={loading}
          className="bg-blue-700 p-3 rounded-lg text-white text-xl uppercase opacity-95 hover:opacity-100
        disabled:opacity-75 "
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-500 p-3 rounded-lg text-white uppercase text-center hover:bg-white hover:text-green-500 hover:border-green-500 transition-all duration-200 cursor-pointer hover:border"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex items-center justify-between mt-5">
        <span
          className="text-red-600 hover:text-red-700 cursor-pointer"
          onClick={handleDelete}
        >
          Delete Account?
        </span>
        <span
          className="text-red-600 hover:text-red-700 cursor-pointer"
          onClick={handleSignOut}
        >
          Logout
        </span>
      </div>
      <div>
        <p className="text-red-500 mt-5">{error ? error : ""}</p>
        <p className="text-green-400 mt-5">
          {updateSucces ? "Updated successfully" : ""}
        </p>
      </div>
    </div>
  );
}
