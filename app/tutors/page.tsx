'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaStar } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/footer';

// Define the Tutor interface
interface Tutor {
  id: string;
  name: string;
  stream: string;
  section: string;
  rating: number;
  photo?: string;
}

// Custom hook for Intersection Observer
const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current && observerRef.current) {
          observerRef.current.unobserve(ref.current);
        }
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, options);
    observerRef.current = observer;

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current && observerRef.current) {
        observerRef.current.unobserve(ref.current);
      }
    };
  }, [observerCallback, options]);

  return { ref, isVisible };
};

// ScrollReveal Component to wrap sections
const ScrollReveal: React.FC<{ children: React.ReactNode; stagger?: boolean; index?: number }> = ({ children, stagger = false, index = 0 }) => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.05,
    rootMargin: '-50px',
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ${
        isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'
      }`}
      style={stagger ? { animationDelay: `${index * 0.2}s` } : {}}
    >
      {children}
    </div>
  );
};

// Tutor Card Component with typed props
const TutorCard: React.FC<{ tutor: Tutor; index: number; scale?: number }> = ({ tutor, index, scale = 1 }) => {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);

  const handleClick = () => {
    router.push(`/tutor/${tutor.id}`);
  };

  const iconSizeClass = scale >= 1 ? 'w-40 h-40' : 'w-32 h-32';
  const textSizeClass = scale >= 1 ? 'text-lg' : 'text-base';
  const streamSizeClass = scale >= 1 ? 'text-xs' : 'text-[10px]';
  const starSizeClass = scale >= 1 ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <ScrollReveal stagger={true} index={index}>
      <div
        onClick={handleClick}
        className="p-3 bg-white rounded-lg shadow-md w-48 flex-shrink-0 cursor-pointer hover:shadow-lg transition-all flex flex-col items-center"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        <div className="mb-4">
          <div className={`${iconSizeClass} border border-gray-300 flex items-center justify-center rounded-md`}>
            {tutor.photo && !imageFailed ? (
              <img
                src={tutor.photo}
                alt={`${tutor.name}'s photo`}
                className="w-full h-full object-contain rounded-md"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <FaUserCircle className={`${iconSizeClass} text-gray-400`} />
            )}
          </div>
        </div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, starIndex) => (
            <FaStar
              key={starIndex}
              className={`${starSizeClass} ${starIndex < Math.round(tutor.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <h3 className={`${textSizeClass} font-semibold text-gray-800 text-center`}>{tutor.name}</h3>
        <p className={`${streamSizeClass} text-gray-500 text-center`}>{tutor.stream} - {tutor.section}</p>
      </div>
    </ScrollReveal>
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
          rating: Math.random() * (5 - 4) + 4,
          photo: tutor.picture || undefined,
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
  }, [keyword]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <Header/>

      {/* Tutors Section - Added top padding to prevent header overlap */}
      <ScrollReveal>
        <section className="bg-white pt-20">
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
              {tutors.map((tutor, index) => (
                <div key={tutor.id} className="flex justify-center">
                  <TutorCard tutor={tutor} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <ScrollReveal>
   <Footer/>
      </ScrollReveal>
    </div>
  );
}