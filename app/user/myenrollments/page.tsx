// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book, X } from "lucide-react";

export default function MyEnrollments() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showMaterialsPopup, setShowMaterialsPopup] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [materials, setMaterials] = useState(null);

  // Fetch user data and enrollments
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }

        setUser({
          id: data.user.id,
          name: data.user.name,
          enrollments: data.user.enrollments || [],
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message || "An unexpected error occurred while fetching user");
        if (err.message === "Unauthorized") {
          router.push("/auth/login");
        }
      }
    };

    fetchUser();
  }, [router]);

  // Fetch materials from the API
  const fetchMaterials = async (tutorName, subject, place) => {
    try {
      const response = await fetch(
        `/api/materials?tutorName=${encodeURIComponent(tutorName)}&subject=${encodeURIComponent(subject)}&place=${encodeURIComponent(place)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch materials");
      }

      return data.materials;
    } catch (err) {
      console.error("Error fetching materials:", err);
      // Return null values as a fallback
      return { tutes: null, recordings: null, pastPapers: null };
    }
  };

  // Handle "View Materials" button click
  const handleViewMaterials = async (enrollment) => {
    // Fetch materials for the selected tutor, subject, and place
    const materialsData = await fetchMaterials(enrollment.tutorName, enrollment.subject, enrollment.place);
    setSelectedEnrollment(enrollment);
    setMaterials(materialsData);
    setShowMaterialsPopup(true);
  };

  // Close the popup
  const closePopup = () => {
    setShowMaterialsPopup(false);
    setSelectedEnrollment(null);
    setMaterials(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">My Enrollments</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="/tutor-marketplace" className="hover:underline">Tutors</a>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
            <a href="/auth/logout" className="hover:underline">Logout</a>
          </nav>
          <button
            onClick={() => router.push("/tutor-marketplace")}
            className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition"
          >
            Find Tutors
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Welcome Header */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            {user ? `Dear ${user.name}, Here Are Your Enrollments` : "Loading..."}
          </h2>
        </section>

        {/* Enrollments Section */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
            <p>{error}</p>
          </div>
        )}

        {user ? (
          user.enrollments.length > 0 ? (
            <div className="space-y-6">
              {user.enrollments.map((enrollment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={enrollment.tutorPicture}
                      alt={enrollment.tutorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {enrollment.tutorName}
                      </h4>
                      <p className="text-gray-600">
                        <strong>Subject:</strong> {enrollment.subject}
                      </p>
                      <p className="text-gray-600">
                        <strong>Location:</strong> {enrollment.place}
                      </p>
                      <button
                        onClick={() => handleViewMaterials(enrollment)}
                        className="mt-4 flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        <Book size={16} className="mr-2" />
                        View Materials
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">
                You have not enrolled in any classes yet.
              </p>
              <button
                onClick={() => router.push("/tutor-marketplace")}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Find Tutors
              </button>
            </div>
          )
        ) : (
          !error && (
            <div className="text-center text-gray-600">
              Loading enrollments...
            </div>
          )
        )}

        {/* Materials Popup */}
        {showMaterialsPopup && selectedEnrollment && materials && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-transparent border border-gray-300 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-lg w-full mx-4 relative">
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>

              {/* Popup Content */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Materials for {selectedEnrollment.subject} - {selectedEnrollment.place}
              </h3>

              {/* Tutes */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Tutes</h4>
                {materials.tutes ? (
                  <div>
                    <a
                      href={materials.tutes}
                      className="text-green-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Tute
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-600">No tutes available.</p>
                )}
              </div>

              {/* Recordings */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Recordings</h4>
                {materials.recordings ? (
                  <div>
                    <a
                      href={materials.recordings}
                      className="text-green-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Recording
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-600">No recordings available.</p>
                )}
              </div>

              {/* Past Papers */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Past Papers</h4>
                {materials.pastPapers ? (
                  <div>
                    <a
                      href={materials.pastPapers}
                      className="text-green-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Past Paper
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-600">No past papers available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white p-6 mt-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">About TutorMatch</h3>
            <p className="text-green-100">Established in 2018</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">What We Do</h3>
            <ul className="space-y-2 text-green-100">
              <li>Our Mission</li>
              <li>Join Our Team</li>
              <li>Quality Tutors</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Our Community</h3>
            <ul className="space-y-2 text-green-100">
              <li>Student Center</li>
              <li>Register as Mentor</li>
              <li>Tweet with us</li>
              <li>Brand Resources</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Connect with Us</h3>
            <ul className="space-y-2 text-green-100">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
              <li>Email Newsletter</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}