'use client';

import Link from 'next/link';
import { FaLeaf } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: "url('/bg.jpeg')" }}
      />

      {/* Content on top of background */}
      <div className="relative flex flex-col min-h-screen">

        {/* Global styles for floating animation */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-float-delay-1 {
            animation: float 4s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          .animate-float-delay-2 {
            animation: float 4s ease-in-out infinite;
            animation-delay: 1s;
          }
          @keyframes pulse-glow {
            0% {
              box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(22, 163, 74, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
            }
          }
          .animate-pulse-glow {
            animation: pulse-glow 2s infinite;
          }
          @keyframes bounce-subtle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          .animate-bounce-subtle {
            animation: bounce-subtle 1.5s ease-in-out infinite;
          }
        `}</style>

        {/* Header - Adjusted for logo to fit properly */}
        <header className="bg-white shadow-sm h-16">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
            {/* Logo and Brand - Adjusted spacing and sizing */}
            <div className="flex items-center">
              <div className="h-12 w-12 flex items-center justify-center mr-2">
                <img
                  src="/logo.ico"
                  alt="TutorMatch Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-green-800">TutorMatch</h1>
            </div>

            {/* Navigation Links - Made bold and adjusted sizing */}
            <nav className="flex items-center space-x-6">
              <Link 
                href="/auth/login" 
                className="text-base font-bold text-green-700 hover:text-green-900 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-4 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between">
            {/* Left Side: Text and Button */}
            <div className="md:w-1/2 text-center md:text-left md:pr-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Perfect Tutor with Ease
              </h2>
              <p className="text-lg text-gray-200 mb-8">
                Connect with expert tutors to boost your learning journey, anytime, anywhere.
              </p>
              <Link href="/auth/login">
                <button className="ml-0 mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 focus:outline-none cursor-pointer relative group">
                  <span className="relative z-10 flex items-center justify-center animate-bounce-subtle">
                    Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 rounded-full bg-green-600 animate-pulse-glow"></span>
                </button>
              </Link>
            </div>

            {/* Right Side: Decorative Images with Floating Effect */}
            <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center relative p-12">
              {/* Main Image */}
              <div className="w-96 h-96 rounded-lg overflow-hidden animate-float">
                <img
                  src="/student.jpeg"
                  alt="student"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Small Image */}
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full overflow-hidden animate-float-delay-1">
                <img
                  src="/duo2.jpeg"
                  alt="tutor Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Medium Image */}
              <div className="absolute bottom-[-3rem] right-[-3rem] w-72 h-72 rounded-lg overflow-hidden animate-float-delay-2">
                <img
                  src="/duo.jpeg"
                  alt="Chat Bubble"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Updated Footer with Logo Image */}
        <footer className="bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 flex items-center justify-center mr-2">
                <img
                  src="/logo.ico"
                  alt="TutorMatch Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-green-800 font-semibold">TutorMart</span>
            </div>
            <p className="text-green-700">© 2025 TutorMart</p>
          </div>
        </footer>

      </div> {/* Closing relative content div */}
    </div>   /* Closing main wrapper div */
  );
}