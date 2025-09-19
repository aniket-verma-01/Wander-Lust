// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import socket from "../Socket";


export default function DashboardPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [myChats, setMyChats] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Make sure you store this at login

useEffect(() => {
  const uid = localStorage.getItem("userId");
  if (uid) {
    if (!socket.connected) socket.connect();
    socket.emit("joinRoom", { userId: uid });

    // 🔹 Listen for live inbox updates
    socket.on("newInboxMessage", (msg) => {
      setMyChats((prev) => {
        // Optional: Move sender to top if exists
        const updated = prev.filter(c => c._id !== msg.senderId);
        return [{ _id: msg.senderId, senderName: msg.senderName || "User", lastMessage: msg.text }, ...updated];
      });
    });
  }

  return () => {
    socket.off("newInboxMessage");
  };
}, []);


  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://tripsage-backend.onrender.com/api/history", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) return console.error("Failed to fetch history");

        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, [token]);

  // Fetch related guides
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch("https://tripsage-backend.onrender.com/api/guides/all");
        if (!res.ok) return console.error("Failed to fetch guides");

        const data = await res.json();
        if (Array.isArray(data)) {
          const matchedGuides = data.filter((guide) =>
            history.some((item) =>
              guide.location.toLowerCase().includes(item.location.toLowerCase())
            )
          );
          setRelatedGuides(matchedGuides);
        }
      } catch (err) {
        console.error("Error fetching related guides:", err);
      }
    };
    if (history.length > 0) fetchRelated();
  }, [history]);

  // Fetch my messages (Inbox)
  useEffect(() => {
            const fetchChats = async () => {
          try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://tripsage-backend.onrender.com/api/chat/inbox/${userId}`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Add token
              }
            });
            if (!res.ok) throw new Error("Failed to fetch chats");
            const data = await res.json();
            setMyChats(data);
          } catch (err) {
            console.error("Failed to fetch chats");
          }
        };

    if (userId) fetchChats();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">TripSage</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/plan-trip")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Plan new trip
          </button>
          <button
            onClick={() => navigate("/create-guide")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Create guide
          </button>
          <div className="w-8 h-8 rounded-full bg-green-300 flex items-center justify-center cursor-pointer">
            <span className="font-bold text-white">A</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow">
        {/* Recently Viewed */}
        <section className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-2 bg-green-100 px-3 py-1 rounded">
            Recently Viewed
          </h2>
          {history.length === 0 ? (
            <p>
              You haven’t searched anything yet.{" "}
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => navigate("/plan-trip")}
              >
                Plan a new trip.
              </span>
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="bg-white p-3 shadow rounded cursor-pointer hover:bg-green-50"
                  onClick={() => navigate(`/destination/${item.location}`)}
                >
                  <span className="text-green-700 font-medium">
                    {item.location}
                  </span>{" "}
                  <span className="text-gray-500 text-sm">
                    ({new Date(item.date).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* World Map */}
        <section className="max-w-5xl mx-auto p-6">
          <div className="h-64 w-full rounded overflow-hidden shadow">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
            </MapContainer>
          </div>
        </section>

        {/* Related Guides */}
        <section className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-2 bg-green-100 px-3 py-1 rounded">
            Guides Related to You
          </h2>
          {relatedGuides.length === 0 ? (
            <p>No related guides found based on your searches.</p>
          ) : (
            <ul className="space-y-3">
              {relatedGuides.map((guide, index) => (
                <li
                  key={index}
                  className="bg-white p-3 shadow rounded cursor-pointer hover:bg-green-50"
                  onClick={() =>
                    navigate(`/guide/${encodeURIComponent(guide.location)}`)
                  }
                >
                  {guide.photos && guide.photos.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {guide.photos.slice(0, 2).map((photo, i) => {
                        const photoUrl =
                          typeof photo === "string"
                            ? `https://tripsage-backend.onrender.com${photo}`
                            : `https://tripsage-backend.onrender.com${photo.url}`;
                        return (
                          <img
                            key={i}
                            src={photoUrl}
                            alt="Guide"
                            className="w-16 h-16 object-cover rounded"
                          />
                        );
                      })}
                    </div>
                  )}
                  <strong>{guide.location}</strong> —{" "}
                  {guide.content.slice(0, 80)}...
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Messages Inbox */}
        <section className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-2 bg-green-100 px-3 py-1 rounded">
            My Messages
          </h2>
          {myChats.length === 0 ? (
            <p>No new messages.</p>
          ) : (
            <ul className="space-y-2">
              {myChats.map((chat, idx) => (
                <li
                  key={idx}
                  className="bg-white p-3 shadow rounded cursor-pointer hover:bg-green-50"
                  onClick={() => navigate(`/chat/${chat._id || chat.senderId}`)}
                >
                  <strong>{chat.senderName || "User"}:</strong>{" "}
                  {chat.lastMessage.slice(0, 40)}...
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
