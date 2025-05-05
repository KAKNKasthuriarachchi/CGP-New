// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react';
import { FaUser, FaBook, FaPlus, FaMinus, FaFileAlt, FaVideo, FaAd } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

function AddTutorMaterialsPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [subjectPlacePairs, setSubjectPlacePairs] = useState([]);
  const [selectedSubjectPlace, setSelectedSubjectPlace] = useState('');
  const [materials, setMaterials] = useState([{ type: 'Tute', file: null }]); // Changed from url to file
  const [errors, setErrors] = useState({});

  const [adFormData, setAdFormData] = useState({
    imageUrl: '',
    link: '',
  });
  const [showAdForm, setShowAdForm] = useState(false);
  const [adUploading, setAdUploading] = useState(false);
  const [adErrors, setAdErrors] = useState({});

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
    setErrors({});
  };

  const handleSubjectPlaceChange = (e) => {
    setSelectedSubjectPlace(e.target.value);
    setErrors({});
  };

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setMaterials(newMaterials);
    if (errors.materials || errors.general) {
      setErrors({
        ...errors,
        materials: '',
        general: '',
      });
    }
  };

  const addMaterialField = () => {
    setMaterials([...materials, { type: 'Tute', file: null }]);
  };

  const removeMaterialField = (index) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials.length > 0 ? newMaterials : [{ type: 'Tute', file: null }]);
    if (errors.materials || errors.general) {
      setErrors({
        ...errors,
        materials: '',
        general: '',
      });
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.target.classList.add('border-green-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.classList.remove('border-green-500');
  };

  const handleDrop = async (e, index) => {
    e.preventDefault();
    e.target.classList.remove('border-green-500');
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file, index);
    } else {
      alert('Please drop a valid file');
    }
  };

  const handleFileInputChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file, index);
    }
  };

  const handleFileUpload = async (file, index) => {
    if (!file) return;

    const validFileTypes = ['application/pdf', 'video/mp4', 'video/webm', 'video/ogg']; // Add more types as needed
    if (!validFileTypes.includes(file.type)) {
      setErrors({ ...errors, materials: 'Please upload a valid file (PDF, MP4, WEBM, OGG)' });
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      uploadData.append('folder', 'tutor-materials');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: uploadData,
        }
      );

      const data = await response.json();
      console.log('Cloudinary response:', data);
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to upload to Cloudinary');
      }

      handleMaterialChange(index, 'file', data.secure_url); 
      setErrors({ ...errors, materials: '' });
    } catch (err) {
      console.error('Error uploading material to Cloudinary:', err);
      setErrors({ ...errors, materials: 'Failed to upload material. Please try again.' });
    }
  };

  const handleAdChange = (e) => {
    const { id, value } = e.target;
    setAdFormData({
      ...adFormData,
      [id]: value,
    });
    if (adErrors[id] || adErrors.general) {
      setAdErrors({
        ...adErrors,
        [id]: '',
        general: '',
      });
    }
  };

  const handleAdFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      setAdErrors({ ...adErrors, adImageUrl: "Please upload a valid image (JPEG, PNG, GIF, WEBP)" });
      return;
    }

    setAdUploading(true);
    setAdErrors({ ...adErrors, adImageUrl: "" });

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      uploadData.append("folder", "ads");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();
      console.log('Cloudinary response:', data);
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to upload to Cloudinary");
      }

      setAdFormData({ ...adFormData, imageUrl: data.secure_url });
      setAdUploading(false);
    } catch (err) {
      console.error("Error uploading ad to Cloudinary:", err);
      setAdErrors({ ...adErrors, adImageUrl: "Failed to upload ad image. Please try again." });
      setAdUploading(false);
    }
  };

  const handleMaterialsSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!selectedTutor) errors.tutor = "Please select a tutor";
    if (!selectedSubjectPlace) errors.subjectPlace = "Please select a subject and place";
    if (!materials.some(m => m.file)) {
      errors.materials = "At least one material file is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const [subjectName, subjectPlace] = selectedSubjectPlace.split('|');

    const tutes = materials.filter(m => m.type === 'Tute').map(m => m.file).filter(url => url);
    const recordings = materials.filter(m => m.type === 'Recording').map(m => m.file).filter(url => url);
    const pastPapers = materials.filter(m => m.type === 'Past Paper').map(m => m.file).filter(url => url);

    const payload = {
      tutorId: selectedTutor,
      subjectName,
      subjectPlace,
      tutes: tutes.length > 0 ? tutes.join(',') : '',
      recordings: recordings.length > 0 ? recordings.join(',') : '',
      pastPapers: pastPapers.length > 0 ? pastPapers.join(',') : '',
    };

    try {
      const materialsResponse = await fetch('/api/tutor/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const materialsText = await materialsResponse.text();
      console.log('Raw materials response:', materialsText);

      if (!materialsResponse.ok) {
        throw new Error(`HTTP error! Status: ${materialsResponse.status}, Body: ${materialsText}`);
      }

      if (!materialsText) {
        throw new Error('Empty response received from server');
      }

      let materialsResult;
      try {
        materialsResult = JSON.parse(materialsText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error(`Invalid JSON response: ${materialsText}`);
      }

      if (!materialsResult.success) {
        throw new Error(materialsResult.error || 'Failed to add tutor materials');
      }

      alert('Tutor materials added successfully!');

      setMaterials([{ type: 'Tute', file: null }]);
      setSelectedSubjectPlace('');
      setSelectedTutor('');
      setSubjectPlacePairs([]);
      setErrors({});
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: error.message || 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!adFormData.imageUrl.trim()) {
      errors.adImageUrl = "Ad image is required";
    }
    if (adFormData.link && !/^(https?:\/\/)/i.test(adFormData.link)) {
      errors.adLink = "Please enter a valid URL (starting with http:// or https://)";
    }

    if (Object.keys(errors).length > 0) {
      setAdErrors(errors);
      return;
    }

    const adPayload = {
      imageUrl: adFormData.imageUrl,
      link: adFormData.link || '',
    };

    try {
      const adResponse = await fetch('/api/ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adPayload),
      });

      const adText = await adResponse.text();
      console.log('Raw ad response:', adText);

      if (!adResponse.ok) {
        throw new Error(`HTTP error! Status: ${adResponse.status}, Body: ${adText}`);
      }

      let adResult;
      try {
        adResult = JSON.parse(adText);
      } catch (parseError) {
        console.error('Error parsing ad JSON:', parseError);
        throw new Error(`Invalid JSON response: ${adText}`);
      }

      if (!adResult.success) {
        throw new Error(adResult.error || 'Failed to add advertisement');
      }

      alert('Advertisement added successfully!');

      setAdFormData({ imageUrl: '', link: '' });
      setShowAdForm(false);
      setAdErrors({});
    } catch (error) {
      console.error('Error in handleAdSubmit:', error);
      setAdErrors({ general: error.message || 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleViewMaterials = () => {
    router.push('/admin/tutor/materials/view');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-100">
      <div className="container max-w-2xl bg-white p-10 rounded-2xl shadow-2xl">
        <div className="flex items-center text-2xl text-green-700 font-bold font-serif mb-8">
          <FaUser className="text-3xl mr-2" />
          TutorHub Admin
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Tutor Materials</h2>

        <form onSubmit={handleMaterialsSubmit}>
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

          <div className="mb-5">
            <label className="block text-gray-500 mb-2">Materials</label>
            {materials.map((material, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <FaFileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.materials ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }`}
                    value={material.type}
                    onChange={(e) => handleMaterialChange(index, 'type', e.target.value)}
                  >
                    <option value="Tute">Tute</option>
                    <option value="Recording">Recording</option>
                    <option value="Past Paper">Past Paper</option>
                  </select>
                  <label
                    className={`absolute text-gray-500 left-10 transition-all duration-200 text-xs -top-2 bg-white px-1 left-3 text-green-700`}
                  >
                    Material Type
                  </label>
                </div>
                <div className="relative flex-1">
                  <FaVideo className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="file"
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.materials ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }`}
                    onChange={(e) => handleFileInputChange(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  />
                  <label
                    className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                      material.file ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                    }`}
                  >
                    {material.file ? 'File Uploaded' : ''}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {materials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterialField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaMinus />
                    </button>
                  )}
                  {index === materials.length - 1 && (
                    <button
                      type="button"
                      onClick={addMaterialField}
                      className="p-2 text-green-500 hover:text-green-700"
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {errors.materials && <p className="mt-1 text-xs text-red-500">{errors.materials}</p>}
          </div>

          {errors.general && <p className="mb-4 text-red-500 text-center">{errors.general}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              ADD MATERIALS
            </button>
            <button
              type="button"
              onClick={handleViewMaterials}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              VIEW MATERIALS
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowAdForm(!showAdForm)}
            className="flex items-center text-green-600 hover:text-green-700 focus:outline-none mb-4"
          >
            {showAdForm ? (
              <>
                <FaMinus className="mr-2" /> Hide Advertisement Form
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Add an Advertisement
              </>
            )}
          </button>

          {showAdForm && (
            <form onSubmit={handleAdSubmit} className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Advertisement</h2>

              <div className="mb-5 relative">
                <div className="relative">
                  <FaAd className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="file"
                    id="imageUrl"
                    accept="image/*"
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      adErrors.adImageUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    } ${adUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    placeholder=" "
                    onChange={handleAdFileChange}
                    disabled={adUploading}
                  />
                  <label
                    htmlFor="imageUrl"
                    className={`absolute text-gray-500 left-10 transition-all duration-200 top-3 ${
                      adUploading ? "text-gray-400" : ""
                    }`}
                  >
                    {adUploading ? "Uploading..." : ""}
                  </label>
                </div>
                {adErrors.adImageUrl && <p className="mt-1 text-xs text-red-500">{adErrors.adImageUrl}</p>}

                {adFormData.imageUrl && (
                  <div className="mt-4">
                    <label className="block text-gray-500 mb-2">Advertisement Preview</label>
                    <a
                      href={adFormData.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={adFormData.imageUrl}
                        alt="Advertisement"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </a>
                  </div>
                )}
              </div>

              <div className="mb-5 relative">
                <div className="relative">
                  <FaAd className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    id="link"
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      adErrors.adLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder=" "
                    value={adFormData.link}
                    onChange={handleAdChange}
                  />
                  <label
                    htmlFor="link"
                    className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                      adFormData.link ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                    }`}
                  >
                    Advertisement Link (Optional, e.g., https://example.com)
                  </label>
                </div>
                {adErrors.adLink && <p className="mt-1 text-xs text-red-500">{adErrors.adLink}</p>}
              </div>

              {adErrors.general && <p className="mb-4 text-red-500 text-center">{adErrors.general}</p>}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
                disabled={adUploading}
              >
                ADD ADVERTISEMENT
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddTutorMaterialsPage;