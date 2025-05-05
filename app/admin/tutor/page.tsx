// @ts-nocheck
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBook,
  FaChalkboardTeacher,
  FaCamera,
  FaGraduationCap,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaMapMarkerAlt,
  FaFileUpload,
} from "react-icons/fa";

function AddTutorPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    section: "",
    stream: "",
    subject: [{ name: "", place: "" }],
    picture: "",
    qualifications: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // Handle file upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (only allow images)
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      setErrors({ ...errors, picture: "Please upload a valid image (JPEG, PNG, GIF, WEBP)" });
      return;
    }

    setUploading(true);
    setErrors({ ...errors, picture: "" });

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to upload to Cloudinary");
      }

      // Make sure we preserve the subject array structure when updating the formData
      setFormData((prevData) => ({
        ...prevData,
        picture: data.secure_url
      }));
      
      setUploading(false);
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      setErrors({ ...errors, picture: "Failed to upload image. Please try again." });
      setUploading(false);
    }
  };

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    const newSubjects = [...(formData.subject || [])];
    if (!newSubjects[index]) {
      newSubjects[index] = { name: "", place: "" };
    }
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setFormData({
      ...formData,
      subject: newSubjects,
    });
    
    if (errors.subject || errors.general) {
      setErrors({
        ...errors,
        subject: "",
        general: "",
      });
    }
  };

  const handleOtherChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value || "",
    });
    if (errors[id] || errors.general) {
      setErrors({
        ...errors,
        [id]: "",
        general: "",
      });
    }
  };

  const addSubjectField = () => {
    setFormData({
      ...formData,
      subject: [...(formData.subject || []), { name: "", place: "" }],
    });
  };

  const removeSubjectField = (index) => {
    const newSubjects = (formData.subject || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subject: newSubjects.length > 0 ? newSubjects : [{ name: "", place: "" }],
    });
    
    if (errors.subject || errors.general) {
      setErrors({
        ...errors,
        subject: "",
        general: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
    };

    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    if (!formData.section.trim()) errors.section = "Section is required";
    if (!formData.stream.trim()) errors.stream = "Stream is required";
    if (
      !Array.isArray(formData.subject) ||
      formData.subject.length === 0 ||
      formData.subject.some((s) => !s.name.trim() || !s.place.trim())
    ) {
      errors.subject = "Each subject must have a valid name and place";
    }
    if (!formData.picture.trim()) errors.picture = "Picture is required";
    if (!formData.qualifications.trim()) errors.qualifications = "Qualifications are required";
    if (!formData.description.trim()) errors.description = "Description is required";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      const result = JSON.parse(text);

      if (result.success) {
        alert("Tutor added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
          section: "",
          stream: "",
          subject: [{ name: "", place: "" }],
          picture: "",
          qualifications: "",
          description: "",
        });
        setErrors({});
      } else {
        setErrors(result.errors || { general: "Failed to add tutor" });
      }
    } catch (error) {
      console.error("Error adding tutor:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };

  const handleAddMaterials = () => {
    router.push("/admin/tutor/materials");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-5 px-5">
      <div className="container max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-2xl">
        <div className="flex items-center text-2xl text-green-700 font-bold font-serif mb-8">
          <FaGraduationCap className="text-3xl mr-2" />
          TutorHub Admin
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Tutor</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <div className="w-full relative">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="firstName"
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                  }`}
                  placeholder=" "
                  value={formData.firstName || ""}
                  onChange={handleOtherChange}
                />
                <label
                  htmlFor="firstName"
                  className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                    formData.firstName ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                  }`}
                >
                  First Name
                </label>
              </div>
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div className="w-full relative">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="lastName"
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                  }`}
                  placeholder=" "
                  value={formData.lastName || ""}
                  onChange={handleOtherChange}
                />
                <label
                  htmlFor="lastName"
                  className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                    formData.lastName ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                  }`}
                >
                  Last Name
                </label>
              </div>
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                id="email"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                }`}
                placeholder=" "
                value={formData.email || ""}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="email"
                className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.email ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                }`}
              >
                Email
              </label>
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                id="contactNumber"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg text-blackbg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.contactNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                }`}
                placeholder=" "
                value={formData.contactNumber || ""}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="contactNumber"
                className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.contactNumber ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                }`}
              >
                Contact Number
              </label>
            </div>
            {errors.contactNumber && <p className="mt-1 text-xs text-red-500">{errors.contactNumber}</p>}
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaChalkboardTeacher className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="section"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.section
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                }`}
                placeholder=" "
                value={formData.section || ""}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="section"
                className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.section ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                }`}
              >
                Section 
              </label>
            </div>
            {errors.section && <p className="mt-1 text-xs text-red-500">{errors.section}</p>}
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaChalkboardTeacher className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="stream"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.stream
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                }`}
                placeholder=" "
                value={formData.stream || ""}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="stream"
                className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.stream ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                }`}
              >
                Stream 
              </label>
            </div>
            {errors.stream && <p className="mt-1 text-xs text-red-500">{errors.stream}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-gray-500 mb-2">Subjects and Locations</label>
            {(Array.isArray(formData.subject) ? formData.subject : []).map((sub, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <FaBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.subject
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                    }`}
                    placeholder=" "
                    value={sub.name || ""}
                    onChange={(e) => handleChange(e, index, "name")}
                  />
                  <label
                    className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                      sub.name ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                    }`}
                  >
                    Subject {index + 1} 
                  </label>
                </div>
                <div className="relative flex-1">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.subject
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                    }`}
                    placeholder=" "
                    value={sub.place || ""}
                    onChange={(e) => handleChange(e, index, "place")}
                  />
                  <label
                    className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                      sub.place ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                    }`}
                  >
                    Place for Subject {index + 1} 
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {(formData.subject || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubjectField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaMinus />
                    </button>
                  )}
                  {index === (formData.subject || []).length - 1 && (
                    <button
                      type="button"
                      onClick={addSubjectField}
                      className="p-2 text-green-500 hover:text-green-700"
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaCamera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="file"
                id="picture"
                accept="image/*"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg  bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.picture
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder=" "
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label
                htmlFor="picture"
                className={`absolute text-gray-500 left-10 transition-all duration-200 top-3 ${
                  uploading ? "text-gray-400" : ""
                }`}
              >
                {uploading ? "Uploading..." : "Upload Profile Picture"}
              </label>
            </div>
            {errors.picture && <p className="mt-1 text-xs text-red-500">{errors.picture}</p>}
            {formData.picture && (
              <div className="mt-2 flex justify-center">
                <img
                  src={formData.picture}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="qualifications"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.qualifications
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                }`}
                placeholder=" "
                value={formData.qualifications || ""}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="qualifications"
                className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.qualifications ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                }`}
              >
                Qualifications
              </label>
            </div>
            {errors.qualifications && <p className="mt-1 text-xs text-red-500">{errors.qualifications}</p>}
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaInfoCircle className="absolute left-3 top-3 text-gray-500" />
              <textarea
                id="description"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500 focus:border-green-500"
                }`}
                placeholder=" "
                value={formData.description || ""}
                onChange={handleOtherChange}
                rows={4}
              />
              <label
                htmlFor="description"
                className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.description ? "text-xs -top-2 bg-white px-1 left-3 text-green-700" : "top-3"
                }`}
              >
                Description
              </label>
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          {errors.general && <p className="mb-4 text-red-500 text-center">{errors.general}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
              disabled={uploading}
            >
              ADD TUTOR
            </button>
            <button
              type="button"
              onClick={handleAddMaterials}
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              ADD MATERIALS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTutorPage;