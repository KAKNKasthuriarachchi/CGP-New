"use client";
import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

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
    <div className="flex flex-col min-h-screen relative bg-white">
      {/* Scoped Styles */}
      <style jsx>{`
        /* Scoped to this component using a unique class */
        .contact-us-container {
          background: white !important;
        }

        @keyframes moveUp {
          0% {
            bottom: 0;
            opacity: 0;
            transform: translateX(0) scale(1);
          }
          20% {
            opacity: 0.4;
            transform: translateX(10px) scale(1.2);
          }
          80% {
            opacity: 0.4;
            transform: translateX(-10px) scale(0.8);
          }
          100% {
            bottom: 100%;
            opacity: 0;
            transform: translateX(20px) scale(1);
          }
        }
        .contact-us-container .animate-move-up-1 {
          animation: moveUp 5s linear infinite;
        }
        .contact-us-container .animate-move-up-2 {
          animation: moveUp 7s linear infinite;
          animation-delay: 1s;
        }
        .contact-us-container .animate-move-up-3 {
          animation: moveUp 9s linear infinite;
          animation-delay: 2s;
        }
        .contact-us-container .animate-move-up-4 {
          animation: moveUp 6s linear infinite;
          animation-delay: 0.5s;
        }
        .contact-us-container .animate-move-up-5 {
          animation: moveUp 8s linear infinite;
          animation-delay: 1.5s;
        }
        .contact-us-container .animate-move-up-6 {
          animation: moveUp 4s linear infinite;
          animation-delay: 0.2s;
        }
        .contact-us-container .animate-move-up-7 {
          animation: moveUp 10s linear infinite;
          animation-delay: 2.5s;
        }
        @keyframes contactFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .contact-us-container .animate-contact-fade-in-up {
          animation: contactFadeInUp 0.8s ease-out forwards;
        }
        @keyframes inputFocus {
          0% {
            transform: scale(1);
            border-color: #d1d5db;
          }
          100% {
            transform: scale(1.02);
            border-color: #15803d;
          }
        }
        .contact-us-container .animate-input-focus:focus {
          animation: inputFocus 0.3s ease forwards;
        }
      `}</style>

      {/* Wrap content in a container with a unique class */}
      <div className="contact-us-container">
        {/* Fallback Background Layer */}
        <div className="fixed inset-0 bg-white z-[-2]"></div>

        {/* Background with Upward-Moving Circles */}
        <div className="fixed inset-0 z-[-1] overflow-hidden">
          <span className="absolute w-16 h-16 bg-green-600/20 rounded-full left-10 bottom-0 animate-move-up-1" />
          <span className="absolute w-24 h-24 bg-green-300/20 rounded-full left-1/4 bottom-0 animate-move-up-2" />
          <span className="absolute w-20 h-20 bg-green-600/20 rounded-full left-1/2 bottom-0 animate-move-up-3" />
          <span className="absolute w-18 h-18 bg-green-300/20 rounded-full right-1/4 bottom-0 animate-move-up-4" />
          <span className="absolute w-22 h-22 bg-green-600/20 rounded-full right-10 bottom-0 animate-move-up-5" />
          <span className="absolute w-14 h-14 bg-green-500/20 rounded-full left-1/3 bottom-0 animate-move-up-6" />
          <span className="absolute w-26 h-26 bg-green-400/20 rounded-full right-1/3 bottom-0 animate-move-up-7" />
        </div>

        <Header />

        <main className="flex-grow p-6 pt-16 bg-white relative z-[1]">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Page Header */}
            <div className="text-center animate-contact-fade-in-up" style={{ animationDelay: "0s" }}>
              <h1 className="text-3xl font-bold text-green-800 mb-4">Contact Us</h1>
              <p className="text-gray-600">We’re here to help! Reach out to us with any questions or inquiries.</p>
            </div>

            {/* Send us a Message Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md max-w-3xl mx-auto animate-contact-fade-in-up" style={{ animationDelay: "0.2s" }}>
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
                    className="border border-gray-300 rounded-lg p-3 w-full text-black animate-input-focus"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-3 w-full text-black animate-input-focus"
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
                    className="border border-gray-300 rounded-lg p-3 w-full text-black animate-input-focus"
                  />
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-3 w-full text-black animate-input-focus"
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
                  className="border border-gray-300 rounded-lg p-3 w-full h-32 text-black animate-input-focus"
                  required
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-500 hover:scale-105 flex items-center justify-center gap-2 shadow-md transition-all duration-300"
                >
                  Send Message ✈️
                </button>
              </form>
            </div>

            {/* Email Us Section */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto animate-contact-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-xl font-semibold mb-2 text-green-800">Email Us</h2>
              <p className="break-words text-gray-600">tutormatch123@gmail.com</p>
              <p className="mt-2 text-sm text-gray-600">Response within 24 hours</p>
              <p className="text-sm text-gray-600">Support available in English and Sinhala</p>
            </div>

            {/* Connect With Us Section */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto animate-contact-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <h2 className="text-xl font-semibold mb-4 text-green-800">Connect With Us</h2>
              <div className="flex justify-center space-x-6 text-2xl">
                <a href="#" aria-label="Facebook" className="text-green-800 hover:text-green-600">🌐</a>
                <a href="#" aria-label="Twitter" className="text-green-800 hover:text-green-600">🐦</a>
                <a href="#" aria-label="LinkedIn" className="text-green-800 hover:text-green-600">💼</a>
                <a href="#" aria-label="Instagram" className="text-green-800 hover:text-green-600">📸</a>
              </div>
            </div>
          </div>
        </main>

        <div className="relative z-[1] py-6 bg-white animate-contact-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
}