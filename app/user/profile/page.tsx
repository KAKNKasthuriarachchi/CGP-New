"use client"

import { useState } from 'react';
import { Star, Search, ChevronDown, Calendar, Book, Award, Clock, Filter, User, FileText, Mail, Phone } from 'lucide-react';

// Define types for your data structures
interface Material {
  id: number;
  title: string;
  type: string;
}

interface Tutor {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  recommended?: boolean;
  experience?: string;
  subjects: string[];
  description: string;
  images?: string[];
  materials: Material[];
}

export default function TutorMarketplace() {
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [filter, setFilter] = useState<"all" | "recommended">("all");
  
  const tutors: Tutor[] = [
    {
      id: 1,
      name: "Tutor Services",
      rating: 5,
      reviews: 17,
      recommended: true,
      subjects: ["Chemistry", "Biology"],
      description: "Chem Professionals",
      images: ["/api/placeholder/80/80", "/api/placeholder/150/100"],
      materials: [
        { id: 1, title: "Chemistry Basics", type: "PDF" },
        { id: 2, title: "Biology Fundamentals", type: "Video" }
      ]
    },
    {
      id: 2,
      name: "Tutor & Co.",
      rating: 5,
      reviews: 24,
      experience: "7+ Years",
      subjects: ["Multiple subjects"],
      description: "Experienced tutors, diverse subjects. Great tutors available. Gets the job done before deadlines.",
      materials: [
        { id: 1, title: "Study Guide Collection", type: "PDF" },
        { id: 2, title: "Practice Tests", type: "Quiz" }
      ]
    },
    {
      id: 3,
      name: "Math Tutor",
      rating: 5,
      reviews: 98,
      recommended: true,
      subjects: ["Math"],
      description: "Math specialists here. This tutor is down-to-earth. Solid math help ever! The concepts were crystal clear.",
      images: ["/api/placeholder/150/100", "/api/placeholder/150/100"],
      materials: [
        { id: 1, title: "Algebra Formulas", type: "PDF" },
        { id: 2, title: "Calculus Practice", type: "Worksheet" },
        { id: 3, title: "Geometry Basics", type: "Video" }
      ]
    },
    {
      id: 4,
      name: "English Tutor",
      rating: 5,
      reviews: 45,
      experience: "4+ Years",
      subjects: ["English"],
      description: "The tutor is language wizard! Amazing English - will help make a genius of you!",
      images: ["/api/placeholder/150/100"],
      materials: [
        { id: 1, title: "Grammar Guide", type: "PDF" },
        { id: 2, title: "Essay Writing Tips", type: "Document" },
        { id: 3, title: "Literature Analysis", type: "Notes" }
      ]
    }
  ];

  const filteredTutors = filter === "all" ? tutors : tutors.filter(tutor => tutor.recommended);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Explore Tutors</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">Search Tutors</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
          <button className="bg-white text-green-500 px-4 py-2 rounded-md font-medium hover:bg-green-100 transition">
            Become Tutor
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 space-y-4">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-32 bg-cover bg-center" style={{backgroundImage: `url('/api/placeholder/400/150')`}}>
              <div className="absolute -bottom-10 left-4">
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
                  <img src="/api/placeholder/80/80" alt="Tutor" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="pt-12 px-4 pb-4">
              <h2 className="text-xl font-semibold">Tutor Name</h2>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <User size={16} className="mr-1" />
                <span>Student Profile</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <button className="w-full bg-green-500 text-white p-3 rounded-md font-medium hover:bg-green-600 transition flex items-center justify-center">
              <Search size={18} className="mr-2" /> Search Tutors
            </button>
            <button className="w-full bg-green-500 text-white p-3 rounded-md font-medium hover:bg-green-600 transition flex items-center justify-center">
              <Calendar size={18} className="mr-2" /> Book a Slot
            </button>
            <button className="w-full bg-green-500 text-white p-3 rounded-md font-medium hover:bg-green-600 transition flex items-center justify-center">
              <FileText size={18} className="mr-2" /> My Sessions
            </button>
            <button className="w-full bg-green-500 text-white p-3 rounded-md font-medium hover:bg-green-600 transition flex items-center justify-center">
              <Book size={18} className="mr-2" /> Learning Materials
            </button>
          </div>

          {/* Tutor Achievements */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-3">Tutor Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3">1</div>
                <span>Highest Ratings</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3">2</div>
                <span>Great Feedback</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3">3</div>
                <span>Educational Experience</span>
              </div>
            </div>
          </div>

          {/* Top Tutors */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-3">Top Tutors</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center">
                  <span className="w-4 mr-2">{rating}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(6 - rating) * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          {selectedTutor ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedTutor.name} - Materials</h2>
                <button 
                  onClick={() => setSelectedTutor(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  Back to Tutors
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(selectedTutor.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                  <span className="text-gray-600 ml-2">{selectedTutor.reviews} reviews</span>
                </div>
                
                <p className="text-gray-700">{selectedTutor.description}</p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Learning Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTutor.materials.map(material => (
                      <div key={material.id} className="border rounded-lg p-4 flex items-center hover:bg-gray-50 cursor-pointer transition">
                        <div className="p-3 bg-green-100 rounded-lg mr-4">
                          {material.type === 'PDF' && <FileText className="text-green-600" />}
                          {material.type === 'Video' && <div className="text-green-600">📹</div>}
                          {material.type === 'Quiz' && <div className="text-green-600">📝</div>}
                          {material.type === 'Worksheet' && <div className="text-green-600">📄</div>}
                          {material.type === 'Document' && <div className="text-green-600">📃</div>}
                          {material.type === 'Notes' && <div className="text-green-600">📒</div>}
                        </div>
                        <div>
                          <h4 className="font-semibold">{material.title}</h4>
                          <p className="text-sm text-gray-500">{material.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Filter Bar */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    className={`px-3 py-1 rounded-full ${filter === "all" ? "bg-green-100 text-green-700" : "text-gray-700"}`}
                    onClick={() => setFilter("all")}
                  >
                    All Tutors
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full ${filter === "recommended" ? "bg-green-100 text-green-700" : "text-gray-700"}`}
                    onClick={() => setFilter("recommended")}
                  >
                    Recommended
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Filter by:</span>
                  <select className="border rounded-md px-2 py-1 text-sm">
                    <option>Rating</option>
                    <option>Recent</option>
                    <option>Subjects</option>
                  </select>
                </div>
              </div>

              {/* Tutor Reviews */}
              <h2 className="text-xl font-semibold mb-4">Tutor Reviews</h2>
              <div className="space-y-4">
                {filteredTutors.map(tutor => (
                  <div key={tutor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                            <img src="/api/placeholder/40/40" alt={tutor.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{tutor.name}</h3>
                            <div className="flex">
                              {[...Array(tutor.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {tutor.reviews} Reviews
                          {tutor.recommended && <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Recommended</span>}
                          {tutor.experience && <div>{tutor.experience}</div>}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{tutor.description}</p>
                      {tutor.images && (
                        <div className="mt-3 flex space-x-2">
                          {tutor.images.map((img, idx) => (
                            <div key={idx} className="w-24 h-16 rounded-md overflow-hidden">
                              <img src={img} alt="Tutor material" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setSelectedTutor(tutor)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                        >
                          View Materials
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-center">
                <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition">
                  Load More Tutors
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-green-500 text-white p-6">
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