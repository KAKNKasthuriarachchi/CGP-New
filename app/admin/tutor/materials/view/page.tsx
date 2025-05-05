// @ts-nocheck

'use client'

import React, { useState, useEffect } from 'react';
import { FaUser, FaBook, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

function ViewTutorMaterialsPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [subjectPlacePairs, setSubjectPlacePairs] = useState([]);
  const [selectedSubjectPlace, setSelectedSubjectPlace] = useState('');
  const [materials, setMaterials] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch('/api/tutor');
        const data = await response.json();
        if (data.success) {
          setTutors(data.tutors);
        } else {
          setErrors({ general: 'Failed to fetch tutors' });
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setErrors({ general: 'An unexpected error occurred while fetching tutors' });
      }
    };
    fetchTutors();
  }, []);

  const handleTutorChange = (e) => {
    const tutorId = e.target.value;
    setSelectedTutor(tutorId);
    const tutor = tutors.find(t => t._id === tutorId);
    if (tutor) {
      setSubjectPlacePairs(tutor.subject);
      setSelectedSubjectPlace('');
    } else {
      setSubjectPlacePairs([]);
      setSelectedSubjectPlace('');
    }
    setMaterials(null);
    setErrors({});
  };

  const handleSubjectPlaceChange = (e) => {
    const value = e.target.value;
    setSelectedSubjectPlace(value);
    setErrors({});
    if (value) {
      fetchMaterials(value);
    } else {
      setMaterials(null);
    }
  };

  const fetchMaterials = async (subjectPlace) => {
    const [subjectName, subjectPlaceValue] = subjectPlace.split('|');
    try {
      const response = await fetch(`/api/tutor/materials?tutorId=${selectedTutor}&subjectName=${subjectName}&subjectPlace=${subjectPlaceValue}`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data.success) {
        setMaterials(data.materials);
        setErrors({});
      } else {
        setErrors({ general: 'Failed to fetch materials' });
        setMaterials(null);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setErrors({ general: 'An unexpected error occurred while fetching materials' });
      setMaterials(null);
    }
  };

  const handleBackToAdd = () => {
    router.push('/admin/tutor/materials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-100">
      <div className="container max-w-2xl bg-white p-10 rounded-2xl shadow-2xl">
        <div className="flex items-center text-2xl text-green-700 font-bold font-serif mb-8">
          <FaUser className="text-3xl mr-2" />
          TutorHub Admin
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">View Tutor Materials</h2>

        <div className="mb-5 relative">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              id="tutor"
              className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                errors.tutor ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
              }`}
              value={selectedTutor}
              onChange={handleTutorChange}
            >
              <option value="">Select a Tutor</option>
              {tutors.map(tutor => (
                <option key={tutor._id} value={tutor._id}>
                  {tutor.firstName} {tutor.lastName}
                </option>
              ))}
            </select>
            <label
              className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                selectedTutor ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
              }`}
            >
          
            </label>
          </div>
          {errors.tutor && <p className="mt-1 text-xs text-red-500">{errors.tutor}</p>}
        </div>

        <div className="mb-5 relative">
          <div className="relative">
            <FaBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              id="subjectPlace"
              className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                errors.subjectPlace ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
              }`}
              value={selectedSubjectPlace}
              onChange={handleSubjectPlaceChange}
              disabled={!selectedTutor}
            >
              <option value="">Select Subject and Place</option>
              {subjectPlacePairs.map((sp, index) => (
                <option key={index} value={`${sp.name}|${sp.place}`}>
                  {sp.name} at {sp.place}
                </option>
              ))}
            </select>
            <label
              className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                selectedSubjectPlace ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
              }`}
            >
             
            </label>
          </div>
          {errors.subjectPlace && <p className="mt-1 text-xs text-red-500">{errors.subjectPlace}</p>}
        </div>

        {materials ? (
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Materials for {selectedSubjectPlace.split('|')[0]} at {selectedSubjectPlace.split('|')[1]}
            </h3>
            {materials.tutes && materials.tutes.length > 0 ? (
              <div className="mb-3">
                <h4 className="text-md font-medium text-gray-600">Tutes:</h4>
                <ul className="list-disc pl-5">
                  {materials.tutes.split(',').map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Tute {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No tutes available.</p>
            )}
            {materials.recordings && materials.recordings.length > 0 ? (
              <div className="mb-3">
                <h4 className="text-md font-medium text-gray-600">Recordings:</h4>
                <ul className="list-disc pl-5">
                  {materials.recordings.split(',').map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Recording {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No recordings available.</p>
            )}
            {materials.pastPapers && materials.pastPapers.length > 0 ? (
              <div className="mb-3">
                <h4 className="text-md font-medium text-gray-600">Past Papers:</h4>
                <ul className="list-disc pl-5">
                  {materials.pastPapers.split(',').map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Past Paper {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No past papers available.</p>
            )}
          </div>
        ) : selectedTutor && selectedSubjectPlace ? (
          <p className="text-gray-500 mb-5">No materials available for this subject.</p>
        ) : (
          <p className="text-gray-500 mb-5">Select a tutor and subject to view materials.</p>
        )}

        {errors.general && <p className="mb-4 text-red-500 text-center">{errors.general}</p>}

        <button
          type="button"
          onClick={handleBackToAdd}
          className="w-full py-3.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          BACK TO ADD MATERIALS
        </button>
      </div>
    </div>
  );
}

export default ViewTutorMaterialsPage;