// src/pages/PlanTripPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlanTripPage() {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/destination/${encodeURIComponent(location)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-green-600">TripSage</h1>
        <nav className="flex gap-6 items-center">
          <a href="#" className="hover:text-green-600">Features</a>
          <a href="#" className="hover:text-green-600">Community</a>
          <a href="#" className="hover:text-green-600">About</a>
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </nav>
      </header>

      {/* Form */}
      <div className="max-w-lg w-full bg-white p-6 rounded shadow-lg mt-10">
        <h2 className="text-center text-2xl font-bold mb-6">Plan a New Trip</h2>
        
        <label className="block font-semibold mb-2">Where to?</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Paris, Hawaii, Japan"
          className="border p-3 rounded w-full mb-4"
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 w-full text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start Planning
        </button>
      </div>
    </div>
  );
}
