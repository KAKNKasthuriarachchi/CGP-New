'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaStar } from 'react-icons/fa';

// Define the Tutor interface
interface Tutor {
  id: string;
  name: string;
  stream: string;
  section: string;
  rating: number;
}

// Tutor Card Component with typed props
const TutorCard: React.FC<{ tutor: Tutor }> = ({ tutor }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tutor/${tutor.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
    >
      <div className="flex items-center mb-2">
        <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{tutor.name}</h3>
          <p className="text-sm text-gray-500">{tutor.stream} - {tutor.section}</p>
        </div>
      </div>
      <div className="flex items-center">
        <FaStar className="text-yellow-500 mr-1" />
        <span className="text-gray-700">{tutor.rating.toFixed(1)}</span>
      </div>
    </div>
  );
};

// Tutors Page Component
export default function Tutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>('');

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: 'all',
        ...(keyword && { keyword }),
      });
      const response = await fetch(`/api/tutor?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tutors');
      }

      if (data.success) {
        const transformedTutors: Tutor[] = data.tutors.map((tutor: any) => ({
          id: tutor._id,
          name: `${tutor.firstName} ${tutor.lastName}`,
          stream: tutor.stream || 'Unknown Stream',
          section: tutor.section || 'Unknown Section',
          rating: Math.random() * (5 - 4) + 4, // Mock rating
        }));
        setTutors(transformedTutors);
      } else {
        throw new Error('Failed to fetch tutors');
      }
    } catch (err: any) {
      console.error('Error fetching tutors:', err);
      setError(err.message || 'An unexpected error occurred while fetching tutors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, [keyword]); // Refetch when keyword changes

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">TutorMatch</h1>
          <nav className="flex space-x-4">
            <a href="/dashboard" className="text-gray-600 hover:text-green-700">Home</a>
            <a href="#" className="text-gray-600 hover:text-green-700">Things</a>
            <a href="#" className="text-gray-600 hover:text-green-700">Zip</a>
            <a href="/signup" className="text-gray-600 hover:text-green-700">Sign Up</a>
          </nav>
        </div>
      </header>

      {/* Tutors Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">All Tutors</h2>

          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Search by name, section, or subject..."
              value={keyword}
              onChange={handleSearchChange}
              className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading && <p className="text-gray-600 text-center mb-4">Loading tutors...</p>}
          {!loading && tutors.length === 0 && !error && (
            <p className="text-gray-600 text-center mb-4">No tutors found.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">TutorMatch</h4>
              <p>Who We Are</p>
              <p>The Mission</p>
              <p>Our Blog</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Join the Community</h4>
              <p>Students</p>
              <p>Tutors</p>
              <p>Partners</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <p>Help Center</p>
              <p>Contact Us</p>
              <p>FAQs</p>
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
          <p className="text-center mt-8">© 2025 TutorMatch</p>
        </div>
      </footer>
    </div>
  );
}