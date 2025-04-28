'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaInfoCircle, FaBook, FaHeadset, FaSignOutAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const router = useRouter();
  const { status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <header className="bg-green-700 text-white shadow-md p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer flex items-center" onClick={() => router.push('/')}>
          <img src="/logo1.ico" alt="TutorMart Logo" className="w-8 h-8 mr-2" />
          TutorMart
        </h1>
        
        <nav className="flex space-x-6">
          {status !== 'loading' && (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-white hover:text-green-200 focus:outline-none flex items-center gap-2"
              >
                <FaHome />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => router.push('/about')}
                className="text-white hover:text-green-200 focus:outline-none flex items-center gap-2"
              >
                <FaInfoCircle />
                <span>About</span>
              </button>
              
              <button
                onClick={() => router.push('/user/myenrollments')}
                className="text-white hover:text-green-200 focus:outline-none flex items-center gap-2"
              >
                <FaBook />
                <span>My Enrollments</span>
              </button>
              
              <button
                onClick={() => router.push('/contacts')}
                className="text-white hover:text-green-200 focus:outline-none flex items-center gap-2"
              >
                <FaHeadset />
                <span>Contact Us</span>
              </button>
              
              {status === 'authenticated' && (
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-green-200 focus:outline-none flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}