// src/pages/GuideDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function GuideDetailsPage() {
  const { location } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const res = await fetch(`https://tripsage-backend.onrender.com/api/guides/${encodeURIComponent(location)}`);
        if (!res.ok) throw new Error("Failed to fetch guide");
        const data = await res.json();
        setGuide(data);

        // ✅ Filter photos belonging to guide's author
        if (data.photos && data.userId) {
          const filtered = data.photos.filter(photo => {
            if (typeof photo === "string") return false; // old photo format without userId
            return photo.userId === data.userId;
          });
          setUserPhotos(filtered);
        }
      } catch (err) {
        console.error("Error fetching guide:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [location]);

  if (loading) return <p className="text-center p-6">Loading guide...</p>;
  if (!guide) return <p className="text-center p-6 text-red-500">Guide not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold text-green-600 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          TripSage
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* Left: Guide Details */}
        <div className="w-2/3 bg-white shadow p-6 rounded">
          <h2 className="text-3xl font-bold text-green-700 mb-3">{guide.location}</h2>
          <p className="text-gray-600 italic mb-4">
            Author: {guide.authorName ? guide.authorName : "User"}
          </p>
          <p className="text-gray-700 mb-4">{guide.content}</p>

          <button
            onClick={() => {
              if (guide.userId) {
                navigate(`/chat/${guide.userId}`); // ✅ Correct param
              } else {
                alert("Author ID missing!");
              }
            }}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Chat with Author
          </button>



          {/* Photos uploaded by the author */}
          <h3 className="text-xl font-semibold mb-2">Author's Photos</h3>
          {userPhotos.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {userPhotos.map((photo, i) => (
                <img
                  key={i}
                  src={`https://tripsage-backend.onrender.com${photo.url}`}
                  alt="Guide"
                  className="rounded shadow h-32 object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No photos uploaded by this author.</p>
          )}
        </div>

        {/* Right: Map */}
        <div className="w-1/3 h-[400px] sticky top-6 bg-white shadow rounded overflow-hidden">
          <iframe
            title="map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(guide.location)}&z=5&output=embed`}
            className="w-full h-full border-0"
            allowFullScreen
          ></iframe>
        </div>
      </main>
    </div>
  );
}
