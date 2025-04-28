"use client";
import Header from "../components/Header";
import Image from "next/image";
import { useState } from "react";
export default function Dashboard() {
  const [medium, setMedium] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [district, setDistrict] = useState("");

  const sriLankaDistricts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",

    "Vavuniya",
  ];

  // To be fetched by Backend
  const allPosts = [
    {
      name: "Tutor 1",
      medium: "English",
      section: "Primary",
      subject: "Maths",
      district: "Kandy",
    },
    {
      name: "Tutor 2",
      medium: "Sinhalese",
      section: "Secondary",
      subject: "Science",
      district: "Colombo",
    },
    // ...
  ];

  const invokeFilter = () => {
    const filtered = allPosts.filter((post) => {
      return (
        (medium ? post.medium === medium : true) &&
        (section ? post.section === section : true) &&
        (subject ? post.subject === subject : true) &&
        (district ? post.district === district : true)
      );
    });
    setFilteredPosts(filtered);
  };
  const [filteredPosts, setFilteredPosts] = useState(allPosts);
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Main Content */}
      <div className="flex p-8 ">
        {/* Filter Sidebar */}
        <div className="relative bg-white text-black shadow-lg p-4 rounded-md w-1/4">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/001/898/535/non_2x/books-and-stationery-on-the-desk-free-photo.jpg"
            alt="Background"
            fill
            className="object-cover opacity-30"
            style={{ zIndex: 0 }}
          />
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-4">Filter Your Tutor</h2>
            <div className="mb-4">
              <label className="block font-semibold">Medium</label>
              <select className="w-full p-2 border rounded">
                <option>Sinhalese</option>
                <option>English</option>
                <option>Tamil</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Section</label>
              <select className="w-full p-2 border rounded">
                <option>Primary</option>
                <option>Secondary</option>
                <option>AdvanceLevel</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Subject</label>
              <select className="w-full p-2 border rounded">
                <option>Maths</option>
                <option>Science</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">District</label>
              <select className="w-full p-2 border rounded">
                <option key="" value="" className="text-gray-600" disabled>
                  Select an District
                </option>
                {sriLankaDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                className="w-full bg-gradient-to-r from-green-400 to-green-600
                   text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out"
                onClick={invokeFilter}
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Tutor Listings */}
        <div className="flex-1 ml-8">
          {/* Search Bar */}
          <div className="flex items-center mb-6 ">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border rounded text-black"
            />
            <button className="ml-2 p-2 bg-gray-300 rounded">🔍</button>
          </div>

          {/* Tutor Cards Grid */}
         
        </div>
      </div>

      {/* Footer */}
      <div className="bg-green-300 h-12"></div>
    </div>
  );
}
