"use client";

import Header from "../components/Header";
import Footer from "../components/footer"; // <== Import Footer here

import { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(form);
    // You can add your API call here
  };

  return (
    <div className="flex flex-col min-h-screen mx-4 mt-8 mb-8">
      <Header /> {/* <== Add Header at the top */}

      <main className="flex-grow bg-white p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Left Section */}
          <div className="space-y-12">
            <div className="bg-gray-100 p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-2 text-green-800">Email Us</h2>
              <p className="break-words text-gray-600">tutormatch123@gmail.com</p>
              <p className="mt-2 text-sm text-gray-600">Response within 24 hours</p>
              <p className="text-sm text-gray-600">Support available in English and Sinhala</p>
            </div>

            <div className="bg-gradient-to-r from-green-300 to-blue-300 p-6 rounded-lg shadow text-white mb-6">
              <h2 className="text-xl font-semibold mb-4">Connect With Us</h2>
              <div className="flex space-x-4 text-2xl">
                <a href="#" aria-label="Facebook" className="hover:text-gray-300">🌐</a>
                <a href="#" aria-label="Twitter" className="hover:text-gray-300">🐦</a>
                <a href="#" aria-label="LinkedIn" className="hover:text-gray-300">💼</a>
                <a href="#" aria-label="Instagram" className="hover:text-gray-300">📸</a>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-gray-50 p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-green-800">Send us a Message</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you shortly.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full text-black"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full text-black"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full text-black"
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full text-black"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Donation">Donation</option>
                </select>
              </div>

              <textarea
                name="message"
                placeholder="Type your message here"
                value={form.message}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full h-32 text-black"
                required
              />

              <button
                type="submit"
                className="bg-gradient-to-r from-green-300 to-blue-400 text-white py-3 px-6 rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                Send Message ✈️
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer /> {/* <== Add Footer at the bottom */}
    </div>
  );
}
