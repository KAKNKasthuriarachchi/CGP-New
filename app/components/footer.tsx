'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaPhone, FaHome, FaInfoCircle, FaBook, FaHeadset, FaSignOutAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

export default function Footer() {
  const router = useRouter();
  const { status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <footer className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <p className="mb-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-white hover:text-green-200"
              >
                <FaHome className="mr-2" />
                Dashboard
              </button>
            </p>
            <p className="mb-2">
              <button
                onClick={() => router.push('/about')}
                className="flex items-center text-white hover:text-green-200"
              >
                <FaInfoCircle className="mr-2" />
                About
              </button>
            </p>
            <p className="mb-2">
              <button
                onClick={() => router.push('/user/myenrollments')}
                className="flex items-center text-white hover:text-green-200"
              >
                <FaBook className="mr-2" />
                My Enrollments
              </button>
            </p>
            <p className="mb-2">
              <button
                onClick={() => router.push('/support')}
                className="flex items-center text-white hover:text-green-200"
              >
                <FaHeadset className="mr-2" />
                Contact Us
              </button>
            </p>
            {status === 'authenticated' && (
              <p className="mb-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-green-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign Out
                </button>
              </p>
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="mb-2 flex items-center">
              <FaEnvelope className="mr-2" />
              <a href="mailto:support@tutormatch.com" className="hover:text-green-200">
                support@tutorhub.com
              </a>
            </p>
            <p className="mb-2 flex items-center">
              <FaPhone className="mr-2" />
              <a href="tel:+94712345678" className="hover:text-green-200">
                +94 71 234 5678
              </a>
            </p>
            <p className="mb-2">
              <a href="/support" className="hover:text-green-200">Visit Help Center</a>
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <p className="mb-2">Students</p>
            <p className="mb-2">Tutors</p>
            <p className="mb-2">Partners</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Download the App</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white">
                <img src="https://via.placeholder.com/120x40?text=App+Store" alt="App Store" />
              </a>
              <a href="#" className="text-white">
                <img src="https://via.placeholder.com/120x40?text=Google+Play" alt="Google Play" />
              </a>
            </div>
          </div>
        </div>
        <p className="text-center mt-8">© 2025 TutorHub</p>
      </div>
    </footer>
  );
}