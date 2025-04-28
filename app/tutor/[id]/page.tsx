'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaUserCircle, FaStar } from 'react-icons/fa';

interface Tutor {
  _id: string;
  firstName: string;
  lastName: string;
  picture: string;
  description: string;
  qualifications: string;
  subject: { name: string; place: string }[];
  contactNumber: string;
  email: string;
  stream: string;
  section: string;
  rating: number;
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

// Tutor Card Component for related tutors
const TutorCard: React.FC<{ tutor: Tutor; index: number }> = ({ tutor, index }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tutor/${tutor._id}`);
  };

  return (
    <ScrollReveal stagger={true} index={index}>
      <div
        onClick={handleClick}
        className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
      >
        <div className="flex items-center mb-2">
          <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{`${tutor.firstName} ${tutor.lastName}`}</h3>
            <p className="text-sm text-gray-500">{tutor.stream} - {tutor.section}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="text-gray-700">{tutor.rating.toFixed(1)}</span>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default function TutorDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [relatedTutors, setRelatedTutors] = useState<Tutor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/tutor?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tutor');
        }

        if (data.success) {
          const transformedTutor: Tutor = {
            ...data.tutor,
            rating: Math.random() * (5 - 4) + 4,
          };
          setTutor(transformedTutor);
        } else {
          throw new Error('Failed to fetch tutor');
        }
      } catch (err: any) {
        console.error('Error fetching tutor:', err);
        setError(err.message || 'An unexpected error occurred while fetching tutor');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  useEffect(() => {
    const fetchRelatedTutors = async () => {
      if (!tutor) return;
      try {
        setRelatedLoading(true);
        const response = await fetch(`/api/tutor?stream=${tutor.stream}&section=${tutor.section}&excludeId=${tutor._id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch related tutors');
        }

        if (data.success) {
          const transformedRelatedTutors: Tutor[] = data.tutors.map((relatedTutor: any) => ({
            ...relatedTutor,
            rating: Math.random() * (5 - 4) + 4,
          }));
          setRelatedTutors(transformedRelatedTutors);
        } else {
          throw new Error('Failed to fetch related tutors');
        }
      } catch (err: any) {
        console.error('Error fetching related tutors:', err);
        setError(err.message || 'An unexpected error occurred while fetching related tutors');
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedTutors();
  }, [tutor]);

  const handleBack = () => {
    router.back();
  };

  const handleEnroll = () => {
    if (tutor) {
      router.push(`/user/enroll?tutorId=${tutor._id}&description=${encodeURIComponent(tutor.description)}&rating=${tutor.rating}&contactNumber=${encodeURIComponent(tutor.contactNumber)}&email=${encodeURIComponent(tutor.email)}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading tutor...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!tutor) {
    return <div className="min-h-screen flex items-center justify-center">Tutor not found.</div>;
  }

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
      <header className="bg-green-700 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <FaArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">TutorMart</h1>
          </div>
          <nav className="flex space-x-4">
            <a href="/dashboard" className="hover:text-gray-200">Home</a>
            <a href="#" className="hover:text-gray-200">About</a>
            <a href="#" className="hover:text-gray-200">Contact Us</a>
            <div className="flex items-center space-x-2">
              <FaUserCircle className="w-6 h-6" />
              <span>Hi, User</span>
              <a href="#" className="hover:text-gray-200">Log Out</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Tutor Details Section */}
      <ScrollReveal>
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Tutor Image */}
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                {tutor.picture ? (
                  <img src={tutor.picture} alt={`${tutor.firstName} ${tutor.lastName}`} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <FaUserCircle className="w-24 h-24 text-gray-400" />
                )}
              </div>

              {/* Tutor Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{`${tutor.firstName} ${tutor.lastName}`}</h2>
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={handleEnroll}
                    className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                  >
                    Enroll Now
                  </button>
                </div>

                {/* Brief Intro */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-600">{tutor.description}</p>
                </div>

                {/* Subjects and Locations */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Subjects & Locations</h3>
                  {tutor.subject && tutor.subject.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-600">
                      {tutor.subject.map((subj, index) => (
                        <li key={index}>{`${subj.name} - ${subj.place}`}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No subjects listed.</p>
                  )}
                </div>

                {/* Qualifications */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Qualifications</h3>
                  <p className="text-gray-600">{tutor.qualifications}</p>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Details</h3>
                  <p className="text-gray-600"><strong>Email:</strong> {tutor.email || 'Not provided'}</p>
                  <p className="text-gray-600"><strong>Contact Number:</strong> {tutor.contactNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Related Tutors Section */}
      <ScrollReveal>
        <section className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
              Other Tutors in {tutor.stream} - {tutor.section}
            </h3>
            {relatedLoading && <p className="text-gray-600 text-center mb-4">Loading related tutors...</p>}
            {!relatedLoading && relatedTutors.length === 0 && (
              <p className="text-gray-600 text-center mb-4">No other tutors found in this stream and section.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTutors.map((relatedTutor, index) => (
                <TutorCard key={relatedTutor._id} tutor={relatedTutor} index={index} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <ScrollReveal>
        <footer className="bg-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">TutorMatch</h3>
                <p>Who We Are</p>
                <p>The Mission</p>
                <p>Our Blog</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Join the Community</h3>
                <p>Students</p>
                <p>Tutors</p>
                <p>Partners</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <p>Help Center</p>
                <p>Contact Us</p>
                <p>FAQs</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Download the App</h3>
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
      </ScrollReveal>
    </div>
  );
}