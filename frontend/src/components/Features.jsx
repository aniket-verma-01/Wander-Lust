// src/components/Features.jsx
import React from "react";

export default function Features() {
  const features = [
    {
      title: "Collaborative Planning",
      desc: "Plan with friends in real time.",
      img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Interactive Maps",
      desc: "Pin and visualize your entire trip.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Itinerary Management",
      desc: "Manage bookings, flights, and stays in one place.",
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-wanderLight p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <img src={f.img} alt={f.title} className="rounded-lg mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-gray-800">{f.title}</h4>
              <p className="text-wanderGray">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
