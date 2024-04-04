import React from "react";
import { Link } from "react-router-dom";
import { FaBath, FaSquareParking, FaLocationDot } from "react-icons/fa6";
import Listing from "../../../Api/models/listing.model";

export default function ListingCard({ listing }) {
  return (
    <div className="flex flex-col overflow-hidden bg-myblack h-[500px] rounded-lg w-full sm:w-[250px] sm:h-[400px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt=""
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 duration-300"
        />
        <div className="p-3 w-full flex flex-col gap-2">
          <p className="text-lg capitalize text-gray-200">{listing.name}</p>
          <p className="flex items-center gap-1 text-sm capitalize text-gray-300 truncate">
            <span>
              <FaLocationDot color="green" className="size-3" />
            </span>
            {listing.address}
          </p>
          <p className="text-sm text-gray-300 line-clamp-2">
            {listing.description}
          </p>
          <p className="font-semibold text-gray-300">
            {listing.offer
              ? "$ " + listing.discountPrice.toLocaleString("en-US")
              : "$ " + listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
        </div>
      </Link>
    </div>
  );
}
