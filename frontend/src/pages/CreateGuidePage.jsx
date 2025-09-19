// src/pages/CreateGuidePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateGuidePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const handleStartWriting = () => {
    if (!location.trim()) {
      alert("Please enter a location!");
      return;
    }
    navigate(`/guide-destination/${encodeURIComponent(location)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Write a travel guide
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Help fellow travelers by writing up your tips or a past itinerary.
      </p>

      {/* Input */}
      <div className="w-full max-w-lg flex flex-col">
        <label className="font-semibold text-gray-800 mb-2">
          For where?
        </label>
        <input
          type="text"
          placeholder="e.g. Paris, Hawaii, Japan"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Start Writing Button */}
      <button
        onClick={handleStartWriting}
        className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
      >
        Start writing
      </button>

      {/* Secondary Option */}
      <p
        className="mt-4 text-gray-500 cursor-pointer hover:underline"
        onClick={() => navigate("/plan-trip")}
      >
        Or start planning a trip
      </p>
    </div>
  );
}
