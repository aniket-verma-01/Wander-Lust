// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-green-50 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">TripSage</h2>
          <p className="text-gray-600 mt-2">
            Plan smarter. Travel better.
          </p>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact</h3>
          <p className="text-gray-600">Email: support@tripsage.com</p>
          <p className="text-gray-600">Phone: +91 82913 13902</p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <a href="#features" className="hover:text-green-700 transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#community" className="hover:text-green-700 transition-colors">
                Community
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-green-700 transition-colors">
                About
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm text-gray-600 mt-6">
        © {new Date().getFullYear()} TripSage. All rights reserved.
      </div>
    </footer>
  );
}
