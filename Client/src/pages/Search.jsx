import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Search() {
  const [searchparams, setsearchparams] = useState({
    searchTerm: "",
    parking: false,
    type: "all",
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listings, setListings] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (
      e.target.id === "sell" ||
      e.target.id === "rent" ||
      e.target.id === "all"
    ) {
      setsearchparams({
        ...searchparams,
        type: e.target.id,
      });
    }
    if (e.target.id === "searchTerm") {
      setsearchparams({
        ...searchparams,
        searchTerm: e.target.value,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setsearchparams({
        ...searchparams,
        [e.target.id]: e.target.checked || e.target.checked === "true",
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setsearchparams({
        ...searchparams,
        sort,
        order,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchparams.searchTerm);
    urlParams.set("parking", searchparams.parking);
    urlParams.set("type", searchparams.type);
    urlParams.set("furnished", searchparams.furnished);
    urlParams.set("offer", searchparams.offer);
    urlParams.set("sort", searchparams.sort);
    urlParams.set("order", searchparams.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setsearchparams({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchData = async () => {
      const searchQuery = urlParams.toString();
      console.log(searchQuery);
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      console.log(data);
    };
    fetchData();
  }, [location.search]);
  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-b-2 p-7 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="text-gray-300 flex items-center gap-2">
            <label>Search</label>
            <input
              type="text"
              id="searchTerm"
              className="rounded w-full p-1 bg-transparent border focus:outline-none"
              placeholder="Search..."
              value={searchparams.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap text-gray-200">
            <label className="font-semibold">Type:</label>
            <div className="flex flex-wrap gap-2 flex-1">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-4"
                  onChange={handleChange}
                  checked={searchparams.type === "all"}
                />
                <span className="text-gray-300">Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-4"
                  onChange={handleChange}
                  checked={searchparams.type === "rent"}
                />
                <span className="text-gray-300">Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sell"
                  className="w-4"
                  onChange={handleChange}
                  checked={searchparams.type === "sell"}
                />
                <span className="text-gray-300">Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-4"
                  onChange={handleChange}
                  checked={searchparams.offer === true}
                />
                <span className="text-gray-300">Offer</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap text-gray-200">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                onChange={handleChange}
                checked={searchparams.parking === true}
              />
              <span className="text-gray-300">Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                onChange={handleChange}
                checked={searchparams.furnished === true}
              />
              <span className="text-gray-300">Furnished</span>
            </div>
          </div>
          <div className="text-gray-200 flex gap-2 items-center">
            <label className="font-semibold">Sort</label>
            <select
              id="sort_order"
              className="text-gray-200 bg-transparent p-1 border rounded-lg"
              onChange={handleChange}
              defaultValue={"a_desc"}
            >
              <option className="text-black" value="regularPrice_desc">
                Price High to Low
              </option>
              <option className="text-black" value="regularPrice_asc">
                Price Low to High
              </option>
              <option className="text-black" value="createdAt_desc">
                Latest
              </option>
              <option className="text-black" value="createdAt_asc">
                Oldest
              </option>
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
