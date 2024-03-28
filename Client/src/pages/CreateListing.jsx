import React from "react";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { app } from "../firebase.js";
export default function () {
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "sell",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadErrors, setImageUploadErrors] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);

  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadErrors(false);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadErrors(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadErrors("Error");
          setUploading(false);
        });
    } else {
      setImageUploadErrors("You can only upload 6 images");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
          setLoading(true);
        },
        (error) => {
          reject(error);
          setImageUploadErrors(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const deleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6">
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-col gap-3 flex-1 ">
          <input
            type="text"
            name=""
            id="name"
            placeholder="Name"
            className="border shadow-lg p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            name=""
            id="description"
            placeholder="Description"
            className="border shadow-lg p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            name=""
            id="address"
            placeholder="Address"
            className="border shadow-lg p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-3 flex-wrap w-full ">
            <div className="flex gap-2 align-middle">
              <input
                type="checkbox"
                id="sell"
                className="w-6"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />

              <span>Sell</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input
                type="checkbox"
                id="rent"
                className="w-6"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input
                type="checkbox"
                id="parking"
                className="w-6"
                onChange={handleChange}
                checked={formData.parking === true}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input
                type="checkbox"
                id="furnished"
                className="w-6"
                onChange={handleChange}
                checked={formData.furnished === true}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input
                type="checkbox"
                id="offer"
                className="w-6"
                onChange={handleChange}
                checked={formData.offer === true}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex mx-auto gap-3 flex-wrap">
            <div className="flex-col flex gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="bedrooms"
                  min={1}
                  max={10}
                  required
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="border border-slate-700 rounded-md text-center p-1 shadow-lg w-24"
                />
                <span>Bedrooms</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="bathrooms"
                  min={1}
                  max={10}
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                  className="border border-slate-700 rounded-md text-center p-1 shadow-lg w-24"
                />
                <span>Bathrooms</span>
              </div>
            </div>
            <div className="flex-col flex gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="regularPrice"
                  required
                  value={formData.regularPrice}
                  onChange={handleChange}
                  className="border border-slate-700 rounded-md text-center p-1 shadow-lg max-w-24"
                />
                <span>Price</span>
                <span className="font-xs">{"($/month)"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="border border-slate-700 rounded-md text-center p-1 shadow-lg max-w-24"
                />
                <span>Discounted Price</span>
                <span className="font-xs">{"($/month)"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 ml-12">
          <p className="font-semibold ">
            Images:
            <span className="font-normal text-gray-400 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="mt-3 flex justify-between py-3 border bg-slate-200 rounded-lg p-2">
            <input
              type="file"
              name="Images"
              id="images"
              accept="images/*"
              multiple
              className=""
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              onClick={handleImageUpload}
              className="bg-green-500 uppercase
               text-white rounded-md p-1  hover:bg-green-600"
              type="button"
            >
              {uploading ? (
                "uploading"
              ) : (
                <span className="uppercase text-sm p-2">Upload</span>
              )}
            </button>
          </div>
          <p className="text-red-600">
            {imageUploadErrors ? imageUploadErrors : ""}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => (
              <div
                key={i}
                className="flex items-center justify-between divide-y"
              >
                <img
                  src={url}
                  alt=""
                  className="w-[200px] h-[200px] object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="bg-red-700 p-2 text-white uppercase rounded-lg"
                  onClick={() => deleteImage(i)}
                >
                  delete
                </button>
              </div>
            ))}

          <button
            className="bg-blue-500 p-2 rounded-lg text-white uppercase hover:opacity-100 opacity-90 mt-3"
            disabled={loading}
          >
            {loading ? "Loading..." : "Create new listing"}
          </button>
          <p className="text-red-400"> {error ? error : ""}</p>
        </div>
      </form>
    </main>
  );
}
