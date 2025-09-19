// src/components/Showcase.jsx
import React from "react";

export default function Showcase() {
  return (
    <section id="community" className="bg-wanderLight py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-8 text-gray-800">
          See your trips on the map
        </h3>
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"
          alt="Trip Showcase"
          className="rounded-xl shadow-lg mx-auto"
        />
      </div>
    </section>
  );
}
