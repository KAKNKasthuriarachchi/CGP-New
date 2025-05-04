'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaStar, FaChevronLeft, FaChevronRight, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
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

// Define the Ad interface
interface Ad {
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
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
const TutorCard: React.FC<{ tutor: Tutor; scale: number }> = ({ tutor, scale }) => {
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
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${starSizeClass} ${index < Math.round(tutor.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <h3 className={`${textSizeClass} font-semibold text-gray-800 text-center`}>{tutor.name}</h3>
      <p className={`${streamSizeClass} text-gray-500 text-center`}>{tutor.stream} - {tutor.section}</p>
    </div>
  );
};

// Dashboard Component for Logged-In Users
export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adError, setAdError] = useState<string | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [currentTutorIndex, setCurrentTutorIndex] = useState<number>(0);
  const [isAdHovered, setIsAdHovered] = useState<boolean>(false);
  const [adDimensions, setAdDimensions] = useState<{ width: number; height: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch tutors and ads
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tutor?page=1&limit=12');
        const data = await response.json();
        console.log('Raw tutor data:', data);

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

    const fetchAds = async () => {
      try {
        const response = await fetch('/api/ad');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch ads');
        }

        if (data.success) {
          setAds(data.ads);
          // Initialize dimensions array with placeholders
          setAdDimensions(data.ads.map(() => ({ width: 0, height: 0 })));
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

  // Load image dimensions dynamically
  useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensionsPromises = ads.map((ad) => {
        return new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.src = ad.imageUrl;
          img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = () => {
            // Fallback dimensions if image fails to load
            resolve({ width: 672, height: 448 }); // Default to 3:2 aspect ratio
          };
        });
      });

      const dimensions = await Promise.all(dimensionsPromises);
      setAdDimensions(dimensions);
    };

    if (ads.length > 0) {
      loadImageDimensions();
    }
  }, [ads]);

  // Automatic sliding for ads
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3000);
  }, [ads.length]);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      startAutoSlide();
      return () => stopAutoSlide();
    }
  }, [ads, startAutoSlide, stopAutoSlide]);

  const nextAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    stopAutoSlide();
    startAutoSlide();
  };

  const prevAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
    stopAutoSlide();
    startAutoSlide();
  };

  const nextTutor = () => {
    setCurrentTutorIndex((prevIndex) => Math.min(prevIndex + 1, tutors.length - 1));
  };

  const prevTutor = () => {
    setCurrentTutorIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleViewAllTutors = () => {
    router.push('/tutors');
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-gray-0 relative"
      style={{
        background: `
          linear-gradient(135deg, #ffffff, #f0fdf4),
          repeating-linear-gradient(
            45deg,
            rgba(74, 222, 128, 0.1) 0px,
            rgba(74, 222, 128, 0.1) 10px,
            transparent 10px,
            transparent 20px
          )
        `,
      }}
    >
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

      <Header></Header>

      <section className="bg-white relative flex flex-col items-center justify-center py-12 max-w-full w-full">
        <div className="text-center mx-auto mt-16">
          <div className="flex flex-row items-center justify-center space-x-4">
            <img 
              src="/logo.ico" 
              alt="TutorHub" 
              className="max-w-[100px] w-auto"
            />
            <h1 className="text-3xl font-bold text-green-600">TutorHub</h1>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {session?.user?.name ?? 'User'}!
            </h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 italic">
            "Your Learning Journey Starts Here"
          </p>
        </div>
      </section>

      <ScrollReveal>
        <section className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Discover TutorMatch</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              TutorMatch connects students with top-tier educators for personalized learning experiences. 
              Whether you're mastering a new subject or advancing your skills, our platform makes finding 
              the perfect tutor easy and seamless. Join our community and start your learning journey today!
            </p>
            <button
              onClick={() => router.push('/about')}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              About Us
            </button>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-white relative">
          <div className="max-w-[1600px] mx-auto px-4 py-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">Explore Our Offers</h3>
            {adError && <p className="text-red-500 text-center mb-4">{adError}</p>}
            {ads.length === 0 && !adError && (
              <p className="text-gray-600 text-center mb-4">No advertisements available.</p>
            )}
            {ads.length > 0 && (
              <div className="relative">
                <div
                  className="overflow-hidden"
                  onMouseEnter={() => {
                    setIsAdHovered(true);
                    stopAutoSlide();
                  }}
                  onMouseLeave={() => {
                    setIsAdHovered(false);
                    startAutoSlide();
                  }}
                >
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
                  >
                    {ads.map((ad, index) => {
                      const dimensions = adDimensions[index] || { width: 672, height: 448 };
                      // Calculate the aspect ratio
                      const aspectRatio = dimensions.width / dimensions.height;
                      // Set a maximum width and calculate height based on aspect ratio
                      const maxWidth = '600px';
                      const maxHeight = `calc(${maxWidth} / ${aspectRatio})`;

                      return (
                        <div 
                          key={index} 
                          className="min-w-full flex justify-center items-center"
                        >
                          <div
                            className={`relative block transition-all duration-300 ${
                              currentAdIndex === index ? 'scale-100' : 'scale-90'
                            } mx-auto bg-white rounded-lg shadow-lg overflow-hidden min-w-[300px] md:min-w-[400px]`}
                            style={{
                              width: '100%',
                              maxWidth: maxWidth,
                              height: maxHeight,
                            }}
                          >
                            <img
                              src={ad.imageUrl}
                              alt="Advertisement"
                              className="w-full h-full object-contain bg-gray-200"
                              onError={(e) => (e.currentTarget.src = '/placeholder-ad.png')}
                            />
                            <button
                              onClick={prevAd}
                              className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all ${
                                isAdHovered ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              <FaChevronLeft size={24} />
                            </button>
                            <button
                              onClick={nextAd}
                              className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all ${
                                isAdHovered ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              <FaChevronRight size={24} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                  {ads.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentAdIndex(index);
                        stopAutoSlide();
                        startAutoSlide();
                      }}
                      className={`w-3 h-3 rounded-full ${
                        currentAdIndex === index ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-16">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">Choose Your Tutor</h3>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {loading && <p className="text-gray-600 text-center mb-4">Loading tutors...</p>}
            {!loading && tutors.length === 0 && !error && (
              <p className="text-gray-600 text-center mb-4">No tutors found.</p>
            )}
            {tutors.length > 0 && (
              <div className="relative">
                <div className="flex items-center justify-center">
                  <button
                    onClick={prevTutor}
                    className="flex-none -ml-12 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all"
                    disabled={currentTutorIndex === 0}
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <div className="flex-1 overflow-x-hidden">
                    <div className="flex items-center justify-center">
                      <div
                        className="flex flex-nowrap transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(calc(50% - ${currentTutorIndex * 320}px - 160px))`,
                        }}
                      >
                        {tutors.map((tutor, index) => {
                          const distance = Math.abs(index - currentTutorIndex);
                          const scale = distance === 0 ? 1.2 : distance === 1 ? 1 : 0.8;
                          return (
                            <div key={tutor.id} className="flex-shrink-0 w-80 h-96 flex justify-center items-center">
                              <TutorCard tutor={tutor} scale={scale} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={nextTutor}
                    className="flex-none -mr-12 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all"
                    disabled={currentTutorIndex === tutors.length - 1}
                  >
                    <FaChevronRight size={20} />
                  </button>
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                  {tutors.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTutorIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        currentTutorIndex === index ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
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
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
              What Our Community Says
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { text: "I found the perfect tutor and improved my grades", name: "Priya R." },
                { text: "This platform helped me find the best tutor for my needs", name: "John K." },
                { text: "Teaching is my passion, I enjoy personalized tutoring", name: "Sarah M." },
                { text: "Empowering students through personalized tutoring", name: "David L." },
              ].map((review, index) => (
                <ScrollReveal key={index} stagger={true} index={index}>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <p className="text-gray-600 mb-4">"{review.text}"</p>
                    <div className="flex items-center">
                      <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
                      <p className="text-gray-800 font-semibold">{review.name}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">Get in Touch</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Have questions or need support? Our team is here to help you every step of the way.
              Reach out to us via email or phone, or visit our Help Center for more resources.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <FaEnvelope className="text-green-600 w-6 h-6 mr-2" />
                <a href="mailto:support@tutormatch.com" className="text-gray-800 hover:text-green-700">
                  support@tutormatch.com
                </a>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-green-600 w-6 h-6 mr-2" />
                <a href="tel:+1234567890" className="text-gray-800 hover:text-green-700">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <button
              onClick={() => router.push('/support')}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Visit Help Center
            </button>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  );
}