'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaLeaf, FaUserCircle, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

// Define the Tutor interface
interface Tutor {
  id: string;
  name: string;
  stream: string;
  section: string;
  rating: number;
}

// Define the Ad interface
interface Ad {
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
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
      className="p-4 bg-white rounded-lg shadow-md flex-shrink-0 w-64 cursor-pointer hover:shadow-lg transition"
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

// Homepage Component for Non-Logged-In Users
export default function Homepage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adError, setAdError] = useState<string | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);

  useEffect(() => {
    // Redirect to /dashboard if user is logged in
    if (status === 'authenticated') {
      router.push('/dashboard');
      return;
    }

    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tutor?page=1&limit=6');
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

    const fetchAds = async () => {
      try {
        const response = await fetch('/api/ads');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch ads');
        }

        if (data.success) {
          setAds(data.ads);
        } else {
          throw new Error('Failed to fetch ads');
        }
      } catch (err: any) {
        console.error('Error fetching ads:', err);
        setAdError(err.message || 'An unexpected error occurred while fetching ads');
      }
    };

    fetchTutors();
    fetchAds();
  }, [status, router]);

  const handleViewAllTutors = () => {
    router.push('/tutors');
  };

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const nextAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  // If loading session, show a loading state
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If authenticated, the redirect will happen in useEffect; render nothing here
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">TutorMatch</h1>
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-green-700">Things</a>
            <a href="#" className="text-gray-600 hover:text-green-700">Zip</a>
            <button
              onClick={handleSignUp}
              className="text-gray-600 hover:text-green-700 focus:outline-none"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-4">
            <FaLeaf className="w-12 h-12 text-green-700" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Enhance your learning with the right tutor</h2>
          <button
            onClick={handleGetStarted}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Get Started
          </button>

          {/* Advertisement Slider */}
          <div className="mt-12">
            {adError && <p className="text-red-500 text-center mb-4">{adError}</p>}
            {ads.length === 0 && !adError && (
              <p className="text-gray-600 text-center mb-4">No advertisements available.</p>
            )}
            {ads.length > 0 && (
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
                  >
                    {ads.map((ad, index) => (
                      <div key={index} className="min-w-full flex justify-center">
                        <div
                          className={`block w-full transition-all duration-300 ${
                            currentAdIndex === index ? 'max-w-2xl' : 'max-w-xl'
                          } mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden`}
                        >
                          <img
                            src={ad.imageUrl}
                            alt="Advertisement"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={prevAd}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all"
                >
                  <FaChevronLeft size={20} />
                </button>

                <button
                  onClick={nextAd}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all"
                >
                  <FaChevronRight size={20} />
                </button>

                <div className="flex justify-center mt-4 space-x-2">
                  {ads.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAdIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        currentAdIndex === index ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Join TutorMatch community and connect with educators and learners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"I found the perfect tutor and improved my grades"</p>
              <div className="flex items-center">
                <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
                <p className="text-gray-800 font-semibold">Priya R.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"This platform helped me find the best tutor for my needs"</p>
              <div className="flex items-center">
                <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
                <p className="text-gray-800 font-semibold">John K.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"Teaching is my passion, I enjoy personalized tutoring"</p>
              <div className="flex items-center">
                <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
                <p className="text-gray-800 font-semibold">Sarah M.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"Empowering students through personalized tutoring"</p>
              <div className="flex items-center">
                <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
                <p className="text-gray-800 font-semibold">David L.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutor Preview Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">Choose Your Tutor</h3>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading && <p className="text-gray-600 text-center mb-4">Loading tutors...</p>}
          {!loading && tutors.length === 0 && !error && (
            <p className="text-gray-600 text-center mb-4">No tutors found.</p>
          )}
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {tutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleViewAllTutors}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              View All Tutors
            </button>
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