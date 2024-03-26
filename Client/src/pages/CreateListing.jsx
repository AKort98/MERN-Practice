import React from "react";

export default function () {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6">
        Create Listing
      </h1>
      <form className="flex flex-col gap-3 sm:flex-row">
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
          />
          <input
            type="text"
            name=""
            id="description"
            placeholder="Description"
            className="border shadow-lg p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name=""
            id="Address"
            placeholder="Address"
            className="border shadow-lg p-3 rounded-lg"
            required
          />
          <div className="flex gap-3 flex-wrap w-full justify-evenly">
            <div className="flex gap-2 align-middle">
              <input type="checkbox" id="sale" className="w-6" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input type="checkbox" id="rent" className="w-6" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input type="checkbox" id="parking" className="w-6" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input type="checkbox" id="furnished" className="w-6" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 align-middle">
              <input type="checkbox" id="offer" className="w-6" />
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
                  defaultValue={1}
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
                  defaultValue={1}
                  className="border border-slate-700 rounded-md text-center p-1 shadow-lg w-24"
                />
                <span>Bathrooms</span>
              </div>
            </div>
            <div className="flex-col flex gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="price"
                  required
                  defaultValue={1}
                  className="border border-slate-700 rounded-md text-center p-1 shadow-lg max-w-24"
                />
                <span>Price</span>
                <span className="font-xs">{"($/month)"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discount"
                  required
                  defaultValue={1}
                  className="border border-slate-700 rounded-md text-center p-1 shadow-lg max-w-24"
                />
                <span>Discounted Pirce</span>
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
          <div className="mt-3 flex justify-between py-3">
            <input
              type="file"
              name="Images"
              id="images"
              accept="images/*"
              multiple
              className=""
            />
            <button className="bg-green-500 uppercase text-white rounded-md p-1 font-semibold">
              Upload
            </button>
          </div>
          <button className="bg-blue-500 p-2 rounded-lg text-white uppercase hover:opacity-100 opacity-90 mt-3">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
