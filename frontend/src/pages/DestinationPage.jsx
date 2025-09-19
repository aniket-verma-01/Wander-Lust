// src/pages/DestinationPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DestinationPage() {
  const { location } = useParams();
  const [photos, setPhotos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Photos
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${location}&client_id=${
            import.meta.env.VITE_UNSPLASH_KEY
          }&per_page=6`
        );
        const data = await res.json();
        setPhotos(data.results || []);
      } catch (err) {
        console.error("Error fetching photos", err);
      }
    }
    fetchPhotos();
  }, [location]);

  // Save Search to Backend
  useEffect(() => {
    async function saveSearch() {
      try {
        const token = localStorage.getItem("token"); // optional for auth
        await fetch("https://tripsage-backend.onrender.com/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: JSON.stringify({ location })
        });
      } catch (err) {
        console.error("Error saving search", err);
      }
    }
    saveSearch();
  }, [location]);

  // Generate Itinerary
  const handleGenerateItinerary = async () => {
    if (!startDate || !endDate || !budget) {
      alert("Please fill all fields before generating itinerary.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://tripsage-backend.onrender.com/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, startDate, endDate, budget }),
      });

      const data = await res.json();
      setItinerary(data.itinerary || "No itinerary generated");
    } catch (err) {
      console.error("Error generating itinerary", err);
      setItinerary("Error generating itinerary");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">TripSage</h1>
        <nav className="flex gap-6 items-center">
          <a href="#" className="hover:text-green-600">Features</a>
          <a href="#" className="hover:text-green-600">Community</a>
          <a href="#" className="hover:text-green-600">About</a>
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white cursor-pointer">
            A
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1">
        {/* LEFT: Photos + Form + Itinerary */}
        <div className="w-2/3 p-6 overflow-y-auto">
          {/* Photos */}
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Photos of {location}
          </h2>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="rounded shadow"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Unable to fetch photos</p>
          )}

          {/* Dates & Budget Section */}
          <section className="max-w-6xl mx-auto mt-6 p-4 bg-white shadow rounded-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Dates */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Enter Dates</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Enter Budget (₹)</label>
                <input
                  type="number"
                  placeholder="Budget in Rupees"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="border p-2 rounded w-40"
                />
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <button
                  onClick={handleGenerateItinerary}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {loading ? "Generating..." : "Generate Itinerary"}
                </button>
              </div>
            </div>
          </section>

          {/* AI Itinerary Output */}
          {itinerary && (
            <section className="mt-6 p-4 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-green-700">
                Suggested Itinerary
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{itinerary}</p>
            </section>
          )}
        </div>

        {/* RIGHT: Map */}
        <div className="w-1/3 h-screen sticky top-0">
          <iframe
            title="map"
            src={`https://www.google.com/maps?q=${location}&z=5&output=embed`}
            className="w-full h-full border-0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
