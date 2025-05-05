'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaStar, FaChevronLeft, FaChevronRight, FaPhone, FaEnvelope, FaUserGraduate, FaBook, FaHeadset } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import Footer from '../components/footer';

interface Tutor {
  id: string;
  name: string;
  stream: string;
  section: string;
  rating: number;
  photo?: string;
}

interface Ad {
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
}

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

const ScrollReveal: React.FC<{ children: React.ReactNode; stagger?: boolean; index?: number }> = ({ children, stagger = false, index = 0 }) => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-50px',
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}
      style={stagger ? { animationDelay: `${index * 0.2}s` } : {}}
    >
      {children}
    </div>
  );
};

const TutorCard: React.FC<{ tutor: Tutor; scale: number }> = ({ tutor, scale }) => {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);

  const handleClick = () => {
    router.push(`/tutor/${tutor.id}`);
  };

  const iconSizeClass = scale >= 1 ? 'w-32 h-32' : 'w-24 h-24';
  const textSizeClass = scale >= 1 ? 'text-base' : 'text-sm';
  const streamSizeClass = scale >= 1 ? 'text-[10px]' : 'text-[8px]';
  const starSizeClass = scale >= 1 ? 'w-3 h-3' : 'w-2 h-2';

  return (
    <div
      onClick={handleClick}
      className="p-2 bg-gray-50 rounded-lg shadow-md w-48 flex-shrink-0 cursor-pointer hover:shadow-lg hover:scale-125 transition-all duration-300 flex flex-col items-center"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <div className="mb-2">
        <div className={`${iconSizeClass} border-2 border-emerald-600 flex items-center justify-center rounded-full`}>
          {tutor.photo && !imageFailed ? (
            <img
              src={tutor.photo}
              alt={`${tutor.name}'s photo`}
              className="w-full h-full object-cover rounded-full"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <FaUserCircle className={`${iconSizeClass} text-emerald-800`} />
          )}
        </div>
      </div>
      <div className="flex items-center mb-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${starSizeClass} ${index < Math.round(tutor.rating) ? 'text-yellow-400' : 'text-gray-400'}`}
          />
        ))}
      </div>
      <h3 className={`${textSizeClass} font-bold text-gray-900 text-center`}>{tutor.name}</h3>
      <p className={`${streamSizeClass} text-gray-700 text-center`}>{tutor.stream} - {tutor.section}</p>
    </div>
  );
};

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
  const [showCookiePopup, setShowCookiePopup] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('Session Status:', status);
    console.log('Session Data:', session);
  }, [status, session]);

  useEffect(() => {
    if (status !== 'authenticated') {
      console.log('Not authenticated yet, skipping cookie check');
      return;
    }

    console.log('User is authenticated, checking cookie consent');
    const consent = Cookies.get('cookieConsent');
    console.log('Cookie Consent Value:', consent);

    if (consent === undefined) {
      console.log('No cookieConsent found, showing popup');
      setShowCookiePopup(true);
    } else {
      console.log('cookieConsent exists, hiding popup');
      setShowCookiePopup(false);
    }
  }, [status]);

  useEffect(() => {
    console.log('showCookiePopup state:', showCookiePopup);
  }, [showCookiePopup]);

  const handleAcceptCookies = () => {
    console.log('User accepted cookies');
    Cookies.set('cookieConsent', 'true', { expires: 1/1440 });
    setShowCookiePopup(false);
  };

  const handleDeclineCookies = () => {
    console.log('User declined cookies');
    Cookies.set('cookieConsent', 'false', { expires: 1/1440 });
    setShowCookiePopup(false);
  };

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
            resolve({ width: 672, height: 448 });
          }
        });
      });

      const dimensions = await Promise.all(dimensionsPromises);
      setAdDimensions(dimensions);
    };

    if (ads.length > 0) {
      loadImageDimensions();
    }
  }, [ads]);

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
    console.log('Rendering: Loading state');
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    console.log('Rendering: Unauthenticated state, redirecting');
    return null;
  }

  console.log('Rendering: Authenticated state, dashboard content');
  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#ffffff' }}
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse 2s infinite;
        }
        @keyframes moveUp {
          0% { transform: translateY(100vh); }
          100% { transform: translateY(-100px); }
        }
        .moving-shape {
          position: absolute;
          opacity: 0.5;
          animation: moveUp 10s linear infinite;
        }
        .circle {
          width: 40px;
          height: 40px;
          background: rgba(6, 95, 70, 0.5);
          border-radius: 50%;
        }
        .triangle {
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 40px solid rgba(6, 95, 70, 0.5);
        }
      `}</style>
      {/* Moving Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="moving-shape circle" style={{ left: '5%', top: '5%', animationDelay: '0s' }}></div>
        <div className="moving-shape circle" style={{ left: '20%', top: '15%', animationDelay: '2s' }}></div>
        <div className="moving-shape triangle" style={{ left: '35%', top: '25%', animationDelay: '4s' }}></div>
        <div className="moving-shape circle" style={{ left: '50%', top: '35%', animationDelay: '6s' }}></div>
        <div className="moving-shape triangle" style={{ left: '65%', top: '45%', animationDelay: '8s' }}></div>
        <div className="moving-shape circle" style={{ left: '80%', top: '55%', animationDelay: '10s' }}></div>
        <div className="moving-shape triangle" style={{ left: '95%', top: '65%', animationDelay: '12s' }}></div>
      </div>

      <Header></Header>

      <ScrollReveal>
        <section className="relative flex flex-col items-center justify-center py-12">
          <div className="text-center mx-auto mt-12">
            <div className="flex flex-row items-center justify-center space-x-4">
              <img
                src="/logo.ico"
                alt="TutorHub"
                className="max-w-[100px] w-auto animate-pulse-slow"
              />
              <h1 className="text-4xl font-bold text-emerald-800 tracking-wide text-shadow-md">
                TutorHub
              </h1>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome, {session?.user?.name ?? 'User'}!
              </h2>
            </div>
            <p className="mt-3 text-xl text-gray-700 italic animate-bounce">
              "Your Learning Journey Starts Here"
            </p>
          </div>
          <div className="mt-8">
            <img
              src="/bg.jpeg"
              alt="Hero Tutor"
              className="w-full max-w-3xl rounded-xl shadow-lg animate-pulse-slow"
            />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-gray-50 border-2 border-emerald-600 rounded-xl shadow-md mx-3 my-6">
          <div className="max-w-6xl mx-auto px-3 py-8 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Discover TutorHub</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              TutorHub connects students with top-tier educators for personalized learning experiences. 
              Whether you're mastering a new subject or advancing your skills, our platform makes finding 
              the perfect tutor easy and seamless. Join our community and start your learning journey today!
            </p>
            <div className="mt-4 flex justify-center">
              <img 
                src="/duo.jpeg" 
                alt="Discover TutorMatch" 
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
            <button
              onClick={() => router.push('/about')}
              className="mt-4 px-5 py-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition"
            >
              About Us
            </button>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="relative py-6">
          <div className="max-w-[1200px] mx-auto px-2 text-center">
            <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-50 rounded-lg shadow-md mb-4 px-6 py-2">
              <h3 className="text-2xl font-bold text-green-800">
                Explore Our Offers
              </h3>
            </div>
            {adError && <p className="text-red-500 text-center mb-2">{adError}</p>}
            {ads.length === 0 && !adError && (
              <p className="text-gray-700 text-center mb-2">No advertisements available.</p>
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
                      const aspectRatio = dimensions.width / dimensions.height;
                      const maxWidth = '500px';
                      const maxHeight = `calc(${maxWidth} / ${aspectRatio})`;

                      return (
                        <div key={index} className="min-w-full flex justify-center items-center">
                          <div
                            className="relative block transition-all duration-300 hover:scale-105 mx-auto bg-white rounded-lg shadow-md border-4 border-emerald-600 overflow-hidden min-w-[200px] md:min-w-[350px]"
                            style={{ width: '100%', maxWidth, height: maxHeight }}
                          >
                            <img
                              src={ad.imageUrl}
                              alt="Advertisement"
                              className="w-full h-full object-cover bg-gray-200"
                              onError={(e) => (e.currentTarget.src = '/placeholder-ad.png')}
                            />
                            <button
                              onClick={prevAd}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-emerald-800 text-white p-2 rounded-full hover:bg-emerald-900 transition-all shadow-md"
                            >
                              <FaChevronLeft size={16} />
                            </button>
                            <button
                              onClick={nextAd}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-800 text-white p-2 rounded-full hover:bg-emerald-900 transition-all shadow-md"
                            >
                              <FaChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center mt-2 space-x-1">
                  {ads.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentAdIndex(index);
                        stopAutoSlide();
                        startAutoSlide();
                      }}
                      className={`w-2 h-2 rounded-full ${currentAdIndex === index ? 'bg-emerald-800' : 'bg-gray-300'} hover:bg-emerald-700 transition-all`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal index={1}>
        <section className="py-6">
          <div className="max-w-5xl mx-auto px-2 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Why Choose TutorHub</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-b from-white to-emerald-50 border-2 border-emerald-200 rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 w-full md:w-80 mx-auto">
                <FaUserGraduate className="text-green-600 w-8 h-8 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-green-600 mb-1">Expert Tutors</h4>
                <p className="text-gray-700 text-sm">Connect with top educators worldwide.</p>
              </div>
              <div className="bg-gradient-to-b from-white to-emerald-50 border-2 border-emerald-200 rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 w-full md:w-80 mx-auto">
                <FaBook className="text-green-600 w-8 h-8 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-green-600 mb-1">Personalized Learning</h4>
                <p className="text-gray-700 text-sm">Tailored sessions for your needs.</p>
              </div>
              <div className="bg-gradient-to-b from-white to-emerald-50 border-2 border-emerald-200 rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 w-full md:w-80 mx-auto">
                <FaHeadset className="text-green-600 w-8 h-8 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-green-600 mb-1">24/7 Support</h4>
                <p className="text-gray-700 text-sm">Always here to assist you.</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal index={2}>
        <section className="py-6">
          <div className="max-w-5xl mx-auto px-2 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Choose Your Tutor</h3>
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}
            {loading && <p className="text-gray-700 text-center mb-2">Loading tutors...</p>}
            {!loading && tutors.length === 0 && !error && (
              <p className="text-gray-700 text-center mb-2">No tutors found.</p>
            )}
            {tutors.length > 0 && (
              <div className="relative">
                <div className="flex items-center justify-center">
                  <button
                    onClick={prevTutor}
                    className="flex-none -ml-8 bg-emerald-800 text-white p-2 rounded-full hover:bg-emerald-900 transition-all shadow-md"
                    disabled={currentTutorIndex === 0}
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <div className="flex-1 overflow-x-hidden">
                    <div className="flex items-center justify-center">
                      <div
                        className="flex flex-nowrap transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(calc(50% - ${currentTutorIndex * 256}px - 128px))` }}
                      >
                        {tutors.map((tutor, index) => {
                          const distance = Math.abs(index - currentTutorIndex);
                          const scale = distance === 0 ? 1.2 : distance === 1 ? 1 : 0.8;
                          return (
                            <div key={tutor.id} className="flex-shrink-0 w-64 h-80 flex justify-center items-center">
                              <TutorCard tutor={tutor} scale={scale} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={nextTutor}
                    className="flex-none -mr-8 bg-emerald-800 text-white p-2 rounded-full hover:bg-emerald-900 transition-all shadow-md"
                    disabled={currentTutorIndex === tutors.length - 1}
                  >
                    <FaChevronRight size={16} />
                  </button>
                </div>
                <div className="flex justify-center mt-2 space-x-1">
                  {tutors.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTutorIndex(index)}
                      className={`w-2 h-2 rounded-full ${currentTutorIndex === index ? 'bg-emerald-800' : 'bg-gray-300'} hover:bg-emerald-700 transition-all`}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="text-center mt-3">
              <button
                onClick={handleViewAllTutors}
                className="px-4 py-1 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 transition-all shadow-md animate-pulse-slow"
              >
                View All Tutors
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal index={3}>
        <section className="py-6">
          <div className="max-w-6xl mx-auto px-2 text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Success Stories</h3>
            <div className="mb-4">
              <img
                src="/dinna.jpg"
                alt="Success Stories Hero"
                className="w-full max-w-3xl mx-auto rounded-lg shadow-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-96 mx-auto">
                <img
                  src="/one lamaya.jpg"
                  alt="Success Story 1"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <div>
                  <p className="text-gray-900 italic mb-2 text-sm">"My grades in mathematics improved significantly with TutorHub's personalized guidance over 2 years!"</p>
                  <p className="text-gray-700 font-semibold text-sm">Sean M.</p>
                  <p className="text-gray-600 text-xs">Subject: Mathematics | Duration: 2 years</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-96 mx-auto">
                <img
                  src="/lamaya2.jpg"
                  alt="Success Story 2"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <div>
                  <p className="text-gray-900 italic mb-2 text-sm">"The best tutoring experience for physics, boosting my grades in just 1 and half years with expert support!"</p>
                  <p className="text-gray-700 font-semibold text-sm">Kelly N.</p>
                  <p className="text-gray-600 text-xs">Subject: Physics | Duration: 1 and half years</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-96 mx-auto">
                <img
                  src="/lamaya3.jpg"
                  alt="Success Story 3"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <div>
                  <p className="text-gray-900 italic mb-2 text-sm">"Excelled in chemistry with tailored sessions over 11 months, thanks to TutorHub!"</p>
                  <p className="text-gray-700 font-semibold text-sm">Aisha M.</p>
                  <p className="text-gray-600 text-xs">Subject: Chemistry | Duration: 11 Months</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-96 mx-auto">
                <img
                  src="/lamaya4.jpg"
                  alt="Success Story 4"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <div>
                  <p className="text-gray-900 italic mb-2 text-sm">"Mastered programming skills in 8 months with incredible support from my tutor!"</p>
                  <p className="text-gray-700 font-semibold text-sm">John S.</p>
                  <p className="text-gray-600 text-xs">Subject: Programming | Duration: 8 months</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-96 mx-auto">
                <img
                  src="/lamaya5.jpg"
                  alt="Success Story 5"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <div>
                  <p className="text-gray-900 italic mb-2 text-sm">"Boosted my English skills in 6 months with engaging and interactive lessons!"</p>
                  <p className="text-gray-700 font-semibold text-sm">Harry T.</p>
                  <p className="text-gray-600 text-xs">Subject: English | Duration: 6 Months</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-96 mx-auto">
                <img
                  src="/lamaya6.jpg"
                  alt="Success Story 6"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <div>
                  <p className="text-gray-900 italic mb-2 text-sm">"Improved my history knowledge over 1 year with TutorHub's dedicated tutors!"</p>
                  <p className="text-gray-700 font-semibold text-sm">Sam L.</p>
                  <p className="text-gray-600 text-xs">Subject: History | Duration: 1 year</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal index={4}>
        <section className="py-6">
          <div className="max-w-5xl mx-auto px-2 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Get in Touch</h3>
            <p className="text-base text-gray-700 max-w-xl mx-auto mb-4">
              Have questions or need support? Our team is here to help you every step of the way.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-6">
              <div className="flex items-center animate-bounce">
                <FaEnvelope className="text-emerald-800 w-5 h-5 mr-1" />
                <a href="mailto:support@tutorhub.com" className="text-lg text-gray-900 hover:text-emerald-800">
                  support@tutorhub.com
                </a>
              </div>
              <div className="flex items-center animate-bounce">
                <FaPhone className="text-emerald-800 w-5 h-5 mr-1" />
                <a href="tel:+94712345678" className="text-lg text-gray-900 hover:text-emerald-800">
                  +94712345678
                </a>
              </div>
            </div>
            <button
              onClick={() => router.push('/support')}
              className="mt-4 px-4 py-1 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 transition-all shadow-md animate-pulse-slow"
            >
              Visit Help Center
            </button>
          </div>
        </section>
      </ScrollReveal>

      {showCookiePopup && (
        <div className="fixed bottom-0 w-full bg-emerald-700 border-t-4 border-emerald-900 shadow-xl p-3 z-50">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-700 text-sm mb-2 md:mb-0">
              We use cookies to enhance your experience. Learn more in our <a href="/privacy" className="text-white underline">Privacy Policy</a>
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDeclineCookies}
                className="px-3 py-1 border-2 border-emerald-200 text-white bg-transparent rounded-full hover:bg-emerald-600 transition"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptCookies}
                className="px-3 py-1 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 transition"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}