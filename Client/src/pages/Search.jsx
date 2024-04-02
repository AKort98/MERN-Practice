import React from "react";

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-b-2 p-7 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-6">
          <div className="text-gray-300 flex items-center gap-2">
            <label>Search</label>
            <input
              type="text"
              id="searchterm"
              className="rounded w-full p-1 bg-transparent border focus:outline-none"
              placeholder="Search..."
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap text-gray-200">
            <label className="font-semibold">Type:</label>
            <div className="flex flex-wrap gap-2 flex-1">
              <div className="flex gap-2">
                <input type="checkbox" id="all" className="w-4" />
                <span className="text-gray-300">Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-4" />
                <span className="text-gray-300">Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="sell" className="w-4" />
                <span className="text-gray-300">Sale</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-4" />
                <span className="text-gray-300">Offer</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap text-gray-200">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" />
              <span className="text-gray-300">Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
              <span className="text-gray-300">Furnished</span>
            </div>
          </div>
          <div className="text-gray-200 flex gap-2 items-center">
            <label className="font-semibold">Sort</label>
            <select
              id="sort"
              className="text-gray-200 bg-transparent p-1 border rounded-lg"
            >
              <option className="text-black">Price High to Low</option>
              <option className="text-black">Price Low to High</option>
              <option className="text-black">Latest</option>
              <option className="text-black">Oldest</option>
            </select>
          </div>
          <button className="bg-green-900 p-2 text-green-200 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="text-white p-7">
        <h1 className="text-3xl font-semibold text-center">Search Results</h1>
      </div>
    </div>
  );
}
