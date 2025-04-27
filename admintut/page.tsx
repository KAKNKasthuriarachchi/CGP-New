// @ts-nocheck

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaBook, FaChalkboardTeacher, FaCamera, FaGraduationCap, FaInfoCircle, FaPlus, FaMinus, FaMapMarkerAlt } from 'react-icons/fa';

function AddTutorPage() {
  const router = useRouter();

  // Define the type of formData using JSDoc to fix the ts(2339) error
  /** @type {[ { firstName: string, lastName: string, email: string, contactNumber: string, section: string, stream: string, subject: { name: string, place: string }[], picture: string, qualifications: string, description: string }, React.Dispatch<React.SetStateAction<any>> ]} */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    section: '',
    stream: '',
    subject: [{ name: '', place: '' }],
    picture: '',
    qualifications: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    const newSubjects = [...formData.subject];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setFormData({
      ...formData,
      subject: newSubjects,
    });
    if (errors.subject || errors.general) {
      setErrors({
        ...errors,
        subject: '',
        general: '',
      });
    }
  };

  const handleOtherChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    if (errors[id] || errors.general) {
      setErrors({
        ...errors,
        [id]: '',
        general: '',
      });
    }
  };

  const addSubjectField = () => {
    setFormData({
      ...formData,
      subject: [...formData.subject, { name: '', place: '' }],
    });
  };

  const removeSubjectField = (index) => {
    const newSubjects = formData.subject.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subject: newSubjects.length > 0 ? newSubjects : [{ name: '', place: '' }],
    });
    if (errors.subject || errors.general) {
      setErrors({
        ...errors,
        subject: '',
        general: '',
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
    if (!Array.isArray(formData.subject) || formData.subject.length === 0 || formData.subject.some(s => !s.name.trim() || !s.place.trim())) {
      errors.subject = "Each subject must have a valid name and place";
    }
    if (!formData.picture.trim()) errors.picture = "Picture URL is required";
    if (!formData.qualifications.trim()) errors.qualifications = "Qualifications are required";
    if (!formData.description.trim()) errors.description = "Description is required";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('Raw response:', text);

      const result = JSON.parse(text);

      if (result.success) {
        alert('Tutor added successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          contactNumber: '',
          section: '',
          stream: '',
          subject: [{ name: '', place: '' }],
          picture: '',
          qualifications: '',
          description: '',
        });
        setErrors({});
      } else {
        setErrors(result.errors || { general: 'Failed to add tutor' });
      }
    } catch (error) {
      console.error('Error adding tutor:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleAddMaterials = () => {
    router.push('/admin/tutor/materials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-100">
      <div className="container max-w-2xl bg-white p-10 rounded-2xl shadow-2xl">
        <div className="flex items-center text-2xl text-green-700 font-bold font-serif mb-8">
          <FaGraduationCap className="text-3xl mr-2" />
          TuitionFinder Admin
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
                  className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                    errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                  }}
                  placeholder=" "
                  value={formData.firstName}
                  onChange={handleOtherChange}
                />
                <label
                  htmlFor="firstName"
                  className={absolute text-gray-500 left-10 transition-all duration-200 ${
                    formData.firstName ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                  }}
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
                  className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                    errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                  }}
                  placeholder=" "
                  value={formData.lastName}
                  onChange={handleOtherChange}
                />
                <label
                  htmlFor="lastName"
                  className={absolute text-gray-500 left-10 transition-all duration-200 ${
                    formData.lastName ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                  }}
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
                className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                }}
                placeholder=" "
                value={formData.email}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="email"
                className={absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.email ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                }}
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
                className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.contactNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                }}
                placeholder=" "
                value={formData.contactNumber}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="contactNumber"
                className={absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.contactNumber ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                }}
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
                className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.section ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                }}
                placeholder=" "
                value={formData.section}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="section"
                className={absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.section ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                }}
              >
                Section (e.g., Primary, Advanced Level)
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
                className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.stream ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                }}
                placeholder=" "
                value={formData.stream}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="stream"
                className={absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.stream ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                }}
              >
                Stream (e.g., AL Maths Stream)
              </label>
            </div>
            {errors.stream && <p className="mt-1 text-xs text-red-500">{errors.stream}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-gray-500 mb-2">Subjects and Locations</label>
            {formData.subject.map((sub, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <FaBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }}
                    placeholder=" "
                    value={sub.name}
                    onChange={(e) => handleChange(e, index, 'name')}
                  />
                  <label
                    className={absolute text-gray-500 left-10 transition-all duration-200 ${
                      sub.name ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                    }}
                  >
                    Subject {index + 1} (e.g., Mathematics)
                  </label>
                </div>
                <div className="relative flex-1">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }}
                    placeholder=" "
                    value={sub.place}
                    onChange={(e) => handleChange(e, index, 'place')}
                  />
                  <label
                    className={absolute text-gray-500 left-10 transition-all duration-200 ${
                      sub.place ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                    }}
                  >
                    Place for Subject {index + 1} (e.g., Colombo)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {formData.subject.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubjectField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaMinus />
                    </button>
                  )}
                  {index === formData.subject.length - 1 && (
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
                type="text"
                id="picture"
                className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.picture ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                }}
                placeholder=" "
                value={formData.picture}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="picture"
                className={absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.picture ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                }}
              >
                Picture URL
              </label>
            </div>
            {errors.picture && <p className="mt-1 text-xs text-red-500">{errors.picture}</p>}
          </div>

          <div className="mb-5 relative">
            <div className="relative">
              <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="qualifications"
                className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.qualifications ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                }}
                placeholder=" "
                value={formData.qualifications}
                onChange={handleOtherChange}
              />
              <label
                htmlFor="qualifications"
                className={absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.qualifications ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                }}
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
                className={w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                }}
                placeholder=" "
                value={formData.description}
                onChange={handleOtherChange}
                rows={4}
              />
              <label
                htmlFor="description"
                className={absolute text-gray-500 left-10 transition-all duration-200 ${
                  formData.description ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                }}
              >
                Description
              </label>
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="mb-5 relative">
  <div className="relative">
    <FaUpload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
    <input
      id="file"
      type="file"
      className="w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 border-gray-200 focus:ring-green-500 focus:border-green-500"
      onChange={handleFileChange} // <-- new function for files
    />
    <label
      htmlFor="file"
      className="absolute text-gray-500 left-10 transition-all duration-200 top-3"
    >
      Upload Profile Picture
    </label>
  </div>
  {errors.file && <p className="mt-1 text-xs text-red-500">{errors.file}</p>}
</div>


          {errors.general && <p className="mb-4 text-red-500 text-center">{errors.general}</p>}
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
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