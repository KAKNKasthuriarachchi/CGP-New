'use client';

import Link from 'next/link';
import { FaLeaf } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaLeaf className="w-8 h-8 text-green-700 mr-2" />
            <h1 className="text-2xl font-bold text-green-800">TutorMatch</h1>
          </div>
          <nav className="flex space-x-4">
            <Link href="/auth/login" className="text-green-700 hover:text-green-900">
              Login
            </Link>
            <Link href="/auth/signup" className="text-green-700 hover:text-green-900">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between">
          {/* Left Side: Text and Button */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Find Your Perfect Tutor with Ease
            </h2>
            <p className="text-lg text-green-700 mb-8">
              Connect with expert tutors to boost your learning journey, anytime, anywhere.
            </p>
            <Link href="/auth/login">
              <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none">
                Get Started
              </button>
            </Link>
          </div>

          {/* Right Side: Decorative Elements */}
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center relative">
            {/* Placeholder for Decorative Images */}
            <div className="w-64 h-64 bg-green-200 rounded-lg flex items-center justify-center text-green-700">
              [Placeholder: Add a decorative image here, e.g., a tutor or student illustration]
            </div>
            {/* Additional Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-green-300 rounded-full flex items-center justify-center text-green-700">
              [Placeholder: Add a smaller image, e.g., a book or pencil icon]
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-400 rounded-lg flex items-center justify-center text-green-700">
              [Placeholder: Add a screenshot or icon, e.g., a chat bubble]
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Logo */}
      <footer className="bg-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaLeaf className="w-6 h-6 text-green-700 mr-2" />
            <span className="text-green-800 font-semibold">TutorMatch</span>
          </div>
          <p className="text-green-700">© 2025 TutorMatch</p>
        </div>
      </footer>
    </div>
  );
}