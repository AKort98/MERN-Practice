import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState();
  const [message, setMessage] = useState("");
  console.log(listing.userRef);
  useEffect(() => {
    const getLandlordDetails = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        console.log(data);
      } catch (error) {}
    };
    getLandlordDetails();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="text-slate-200 flex flex-col gap-3">
          <p>
            Contact
            <span className="capitalize">{" " + landlord.username + " "}</span>
            for <span className="capitalize">{listing.name + " "}</span>
          </p>
          <textarea
            className="w-full bg-transparent border border-blue-950 rounded-lg p-3 focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
          ></textarea>
          <Link
            className="bg-blue-950 p-3 rounded-lg text-center"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
