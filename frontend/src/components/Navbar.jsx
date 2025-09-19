// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";


export default function Navbar() {
  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-green-600">TripSage</h1>
        <nav className="space-x-6 text-gray-600 font-medium hidden md:flex">
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#community" className="hover:text-green-600">Community</a>
          <a href="#about" className="hover:text-green-600">About</a>
          <Link to="/signup">
          <button className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600">
            Sign Up
            </button>
          </Link>

        </nav>
      </div>
    </header>
  );
}
