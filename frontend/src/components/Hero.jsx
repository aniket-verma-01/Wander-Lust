// src/components/Hero.jsx
import React from "react";

export default function Hero() {
  return (
    <section className="bg-wanderLight">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-20">
        {/* Left Text */}
        <div className="text-center md:text-left max-w-xl">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Plan your trips like a pro
          </h2>
          <p className="text-lg text-wanderGray mb-6">
            Collaborate, organize, and map your travels in one simple app.
          </p>
          <button className="bg-wanderGreen text-white px-8 py-3 rounded-full text-lg hover:bg-wanderGreenDark">
            Get Started
          </button>
        </div>

        {/* Right Image */}
        <div className="mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
            alt="Travel Map"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
