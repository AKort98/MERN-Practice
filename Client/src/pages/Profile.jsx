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
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState(null);
  const [deleteListingsLoading, setdeleteListingsLoading] = useState(false);
  const [deleteListingsError, setdeleteListingsError] = useState(null);
  const [deleteListingsSuccess, setdeleteListingsSuccess] = useState(null);
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

  const handleViewListings = async () => {
    try {
      setListingsError(null);
      setListingsLoading(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingsError(data.message);
        setListingsLoading(false);
        return;
      }
      setListingsLoading(false);
      setListings(data);
    } catch (error) {
      setListingsLoading(false);
      setListingsError(error.message);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      setdeleteListingsLoading(true);
      setdeleteListingsError(null);
      setdeleteListingsSuccess(null);
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setdeleteListingsError(data.message);
        setdeleteListingsLoading(false);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setdeleteListingsSuccess(true);
    } catch (error) {
      setdeleteListingsError(data.message);
      setdeleteListingsLoading(false);
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
        <p className="text-green-500 text-center uppercase font-semibold">
          {deleteListingsSuccess ? "Listing deleted Successfully" : ""}{" "}
        </p>
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
          className="border p-2 rounded-lg shadow-md bg-transparent text-gray-300 focus:outline-none"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleEdit}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-2 rounded-lg shadow-md  bg-transparent text-gray-300 focus:outline-none"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleEdit}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2 rounded-lg shadow-md  bg-transparent text-gray-300 focus:outline-none"
          id="password"
          onChange={handleEdit}
        />
        <button
          disabled={loading}
          className="bg-blue-950 p-3 rounded-lg text-blue-200 uppercase opacity-95 hover:opacity-100
        disabled:opacity-75 "
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-800 p-3 rounded-lg text-green-200 uppercase text-center hover:opacity-90"
        >
          Create Listing
        </Link>
      </form>

      <button
        onClick={handleViewListings}
        className="bg-gray-800 w-full mt-3 p-3 rounded-lg text-gray-300 uppercase text-center"
      >
        {listingsLoading ? "loading..." : "View Listings"}
      </button>
      <div className="text-red-600 mt-2 text-xl text-center">
        {listingsError ? listingsError : ""}
      </div>
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
      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-3xl font-semibold">Your Listings</h1>
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border shadow-md flex justify-between items-center gap-4 p-2 font-semibold"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt=""
                  className="size-40 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="truncate flex-1 text-slate-600 hover:underline "
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleDeleteListing(`${listing._id}`)}
                  className="bg-red-600 p-1 rounded-md text-gray-200 uppercase"
                >
                  {deleteListingsLoading ? "deleting" : "Delete"}
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-blue-700 p-1 rounded-md text-gray-200 uppercase">
                    update
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
