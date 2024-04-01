import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ReactLoading from "react-loading";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaRegCopy, FaBed } from "react-icons/fa";
import { FaBath, FaSquareParking, FaLocationDot } from "react-icons/fa6";
import { SiApachecouchdb } from "react-icons/si";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listings() {
  SwiperCore.use([Navigation]);
  const listingid = useParams();
  const [listingData, setListingData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchDatatoUpdate = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/listing/get/${listingid.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListingData(data);
        setLoading(false);
        setError(false);
        console.log(data);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchDatatoUpdate();
  }, [listingid.id]);

  return (
    <main>
      {loading ? (
        <ReactLoading
          type="spin"
          color="green"
          className="text-center mt-5 mx-auto"
        />
      ) : (
        ""
      )}
      {error ? "Oops! Something went wrong" : ""}
      {listingData && !error && !loading && (
        <div>
          <Swiper navigation>
            {listingData.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="fixed top-[13%] right-[3%] z-10 rounded-full w-12 h-12 flex justify-center items-center bg-transparent text-slate-300 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1000);
            }}
          >
            <FaRegCopy />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="w-3/4 mx-auto mt-4 flex flex-col p-2">
            <p className="text-2xl font-semibold text-gray-300 capitalize">
              {listingData.name} - ${" "}
              {listingData.offer
                ? listingData.regularPrice.toLocaleString("en-US")
                : listingData.discountPrice.toLocaleString("en-US")}
              {listingData.type === "rent" ? " / month" : ""}
            </p>
            <p className="flex items-center gap-2 mt-7 capitalize text-gray-300">
              <span>
                <FaLocationDot color="green" />
              </span>
              {listingData.address}
            </p>
            <div className="flex gap-3 mt-2">
              <p className="bg-red-800 w-full h-12 rounded-lg text-xl text-red-200 flex items-center justify-center">
                {listingData.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listingData.discountPrice > 0 ? (
                <p className="bg-green-800 w-full h-12 rounded-lg text-xl text-green-200 flex items-center justify-center">
                  {"$" + listingData.discountPrice + " Discount"}
                </p>
              ) : (
                ""
              )}
            </div>
            <p className="my-3 text-gray-400">
              <span className="text-gray-300 font-semibold">Description: </span>
              {listingData.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-3 sm:flex sm:gap-4 flex-wrap text-gray-300">
              <div className="flex items-center gap-2">
                <span>
                  <FaBed className="text-green-600 size-6" />
                </span>
                <span>
                  {listingData.bedrooms > 1
                    ? listingData.bedrooms + " Bedrooms"
                    : 1 + " Bedroom"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <FaBath className="text-green-600 size-6" />
                </span>
                <span>{listingData.bathrooms + " Bathrooms"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <FaSquareParking className="text-green-600 size-6" />
                </span>
                <span>
                  {listingData.parking
                    ? "Parking Available"
                    : "No Parking Available"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <SiApachecouchdb className="text-green-600 size-6" />
                </span>
                <span>
                  {listingData.furnished ? "Furnished" : "Not Furnished"}
                </span>
              </div>
            </div>
            {currentUser &&
              listingData.userRef !== currentUser._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-blue-950 text-blue-200 text-xl h-12 rounded-lg hover:bg-blue-900 p-2"
                >
                  Message Landlord
                </button>
              )}
            {contact && <Contact listing={listingData} />}
          </div>
        </div>
      )}
    </main>
  );
}
