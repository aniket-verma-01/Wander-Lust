// src/pages/GuideDestinationPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function GuideDestinationPage() {
  const { location } = useParams();
  const [photos, setPhotos] = useState([]);
  const [guideContent, setGuideContent] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Decode JWT to get userId
  let userId = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    } catch (e) {
      console.error("Invalid token");
    }
  }

  // Fetch Unsplash photos
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
        console.error("Error fetching Unsplash photos", err);
      }
    }
    fetchPhotos();
  }, [location]);

  // Fetch uploaded photos from DB
  useEffect(() => {
    async function fetchUploadedPhotos() {
      try {
        const res = await fetch(
          `https://tripsage-backend.onrender.com/api/guides/photos?location=${encodeURIComponent(
            location
          )}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await res.json();
        setUploadedPhotos(data.photos || []);
      } catch (err) {
        console.error("Error fetching uploaded photos", err);
      }
    }
    fetchUploadedPhotos();
  }, [location]);

  // Save guide text
  const handleSaveGuide = async () => {
    if (!guideContent.trim()) {
      alert("Please write something before saving!");
      return;
    }
    try {
      const res = await fetch("https://tripsage-backend.onrender.com/api/guides", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ location, content: guideContent }),
      });
      if (res.ok) {
        alert("Guide saved successfully!");
        setGuideContent("");
      } else {
        alert("Failed to save guide");
      }
    } catch (err) {
      console.error("Error saving guide:", err);
    }
  };

  // Upload photos
  const handleUploadPhotos = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    formData.append("location", location);
    for (let file of files) {
      formData.append("photos", file);
    }

    try {
      setLoading(true);
      const res = await fetch("https://tripsage-backend.onrender.com/api/guides/upload-photos", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadedPhotos(data.photos || []);
      } else {
        alert("Failed to upload photos");
      }
    } catch (err) {
      console.error("Error uploading photos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Separate photos by user
  const yourPhotos = uploadedPhotos.filter(p => p.userId === userId);
  const publicPhotos = uploadedPhotos.filter(p => p.userId !== userId);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        {/* LEFT: Photos + Guide Writing */}
        <div className="w-2/3 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Photos of {location}
          </h2>

          {/* Unsplash Photos */}
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

          {/* Write Guide Section */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              Write a guide/tips for traveling to {location}
            </h3>
            <textarea
              value={guideContent}
              onChange={(e) => setGuideContent(e.target.value)}
              className="w-full h-32 border p-2 rounded"
              placeholder="Share your travel tips, best places to visit, food, culture, etc."
            />
            <button
              onClick={handleSaveGuide}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Guide
            </button>
          </div>

          {/* Upload & Display Your Photos */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              Your photos in {location}:
            </h3>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              className="hidden"
              id="upload-photos"
              onChange={handleUploadPhotos}
            />
            <label
              htmlFor="upload-photos"
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 inline-block"
            >
              {loading ? "Uploading..." : "Upload Photos"}
            </label>

            {yourPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {yourPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={`https://tripsage-backend.onrender.com${photo.url}`}
                    alt="Your Uploaded"
                    className="rounded shadow h-24 object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">You haven’t uploaded any photos yet.</p>
            )}
          </div>

          {/* Public Photos Section */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              All photos in {location}:
            </h3>
            {publicPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {publicPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={`https://tripsage-backend.onrender.com${photo.url}`}
                    alt="Public Uploaded"
                    className="rounded shadow h-24 object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No public photos yet.</p>
            )}
          </div>
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
