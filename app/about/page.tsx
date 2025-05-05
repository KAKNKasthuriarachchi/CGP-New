"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/footer";

export default function AboutUsPage() {
  const router = useRouter();

  const handleExploreTutors = () => {
    router.push("/tutors");
  };

  return (

    
    <div className="bg-gray-50 min-h-screen">
      {/* Custom CSS for Animation */}
      <style>{`
        @keyframes fadeInSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInSlideUp {
          animation: fadeInSlideUp 0.8s ease-out forwards;
        }
      `}</style>
      <Header/>

      {/* Hero Section - Fade In with Upward Slide */}

      <section
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-20 animate-fadeInSlideUp"
        style={{ animationDelay: "0s" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About TutorHub</h1>
            <p className="text-lg md:text-xl mb-6">
            Tutor Hub is a comprehensive platform designed to help students easily find and connect with the best tutors for their academic and personal learning needs. We recognize that every learner is different, so Tutor Hub offers a flexible and user-friendly experience to match students with tutors based on subject, location, availability, and teaching preferences.

From detailed tutor profiles and verified ratings to personalized course offerings and secure online payments, Tutor Hub makes the entire enrollment process smooth and transparent. Students can browse tutor information, review their qualifications, check their schedules, and even access study materials—all in one place.

Whether you’re looking for academic support, test preparation, or skill development, Tutor Hub ensures that students have the tools and access they need to learn confidently and effectively.


            </p>
            <button
              onClick={handleExploreTutors}
              className="bg-white text-green-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Explore Tutors
            </button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            {/* Placeholder for Hero Image */}
            <div className="w-full h-64 md:h-96 bg-gray-300 rounded-lg flex items-center justify-center">
              <img
                src="/about1.jpeg"
                alt="Students Learning"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Fade In with Upward Slide */}
      <section
        className="py-16 animate-fadeInSlideUp"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            {/* Placeholder for Mission Image */}
            <div className="w-full h-64 md:h-80 bg-gray-300 rounded-lg flex items-center justify-center">
              <img
                src="/about4.jpg"
                alt="Student and Tutor Collaborating"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8 text-cnter md:text-left">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg">
            At Tutor Hub, our mission is to simplify access to quality education by connecting students with the right tutors—quickly, reliably, and affordably. We aim to empower learners of all ages to achieve their academic goals by offering a platform where trust, convenience, and personalized learning come together. Through technology and transparency, we strive to support both students and educators in building meaningful, productive learning experiences.


            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Fade In with Upward Slide */}
      <section
       className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-20 animate-fadeInSlideUp"
        style={{ animationDelay: "1s" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose TutorHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="text-center p-6 bg-gray-50 rounded-lg shadow-md animate-fadeInSlideUp"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-2c2.2 0 4 1.8 4 4s-1.8 4-4-1.8-4-4 1.8-4 4-4zm0-4C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2"> Advertising Oppertunity</h3>
              <p className="text-gray-600">
                    Show your Tutor career to the public through us with an eye catching advertisement
              </p>
            </div>
            <div
              className="text-center p-6 bg-gray-50 rounded-lg shadow-md animate-fadeInSlideUp"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a2 2 0 00-2-2h-3v4zm-2 0h-2v-4h-3a2 2 0 00-2 2v2h7zM4 20h2v-2a2 2 0 00-2-2H4v4zM3 4v12h18V4H3zm9 7a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Local Tutors</h3>
              <p className="text-gray-600">
                Connect with experienced tutors across Sri Lanka, offering both online and in-person sessions.
              </p>
            </div>
            <div
              className="text-center p-6 bg-gray-50 rounded-lg shadow-md animate-fadeInSlideUp"
              style={{ animationDelay: "1.6s" }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Enrollments</h3>
              <p className="text-gray-600">
              Enroll with ease and with secure payment methods on Tutorhub
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Fade In with Upward Slide */}
    <section
      className="py-16 bg-gray-50 animate-fadeInSlideUp"
      style={{ animationDelay: "1.5s" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "1.7s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="John Doe"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Meraj B</h3>
          <p className="text-gray-600"></p>
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "1.9s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Jane Smith"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Shanuka J</h3>
     
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "2.1s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Emily Perera"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Minidi S</h3>
    
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "2.3s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Michael Fernando"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Heshani S</h3>
         
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "2.5s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Sophia Lee"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800"> Kavindi N</h3>
       
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "2.7s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Daniel Silva"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Tharusha D</h3>
       
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "2.9s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Ayesha Kumar"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Sandani F</h3>
          
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "3.1s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Liam Perera"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Chamod R</h3>
       
        </div>
        <div
          className="text-center animate-fadeInSlideUp"
          style={{ animationDelay: "3.3s" }}
        >
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
            <img
            src="/profile.jpg"
            alt="Naveen Jayasuriya"
            className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Tharindi J</h3>
          
        </div>
        </div>
      </div>
    </section>

      {/* CTA Section - Fade In with Upward Slide */}
      <section
       className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-20 animate-fadeInSlideUp"
        style={{ animationDelay: "2s" }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8">
            Join thousands of students in Sri Lanka who trust TutorHub for quality education.
          </p>
          <button
            onClick={handleExploreTutors}
            className="bg-white text-green-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Find a Tutor Today
          </button>
        </div>
      </section>

      {/* Footer Section - Fade In with Upward Slide */}
      <Footer></Footer>
    </div>
  );
}