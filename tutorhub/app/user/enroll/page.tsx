"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  description: string;
  rating: number;
  contactNumber: string;
  email: string;
  subject: { name: string; place: string }[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function EnrollmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();
  const currentUrl = searchParamsString ? `${pathname}?${searchParamsString}` : pathname;

  // Extract query parameters
  const tutorId = searchParams.get("tutorId");
  const description = searchParams.get("description");
  const rating = searchParams.get("rating");
  const contactNumber = searchParams.get("contactNumber");
  const email = searchParams.get("email");

  // State for tutor data
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [tutorFetchError, setTutorFetchError] = useState<string | null>(null);

  // State for current user
  const [user, setUser] = useState<User | null>(null);
  const [userFetchError, setUserFetchError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    subjectName: "Mathematics",
    location: "Online",
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
  });
  const [formErrors, setFormErrors] = useState({
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Enrollment fee
  const enrollmentFee = 10; // $10

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }

        if (data.success) {
          setUser(data.user);
          // Pre-fill email if user is logged in
          setFormData((prev) => ({ ...prev, email: data.user.email || "" }));
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setUserFetchError(
          err.message || "An unexpected error occurred while fetching user"
        );
      }
    };

    fetchUser();
  }, []);

  // Set tutor details from query parameters or fetch from API
  useEffect(() => {
    const fetchTutor = async () => {
      if (!tutorId) {
        setTutorFetchError("Tutor ID is missing");
        return;
      }

      try {
        const response = await fetch(`/api/tutor?id=${tutorId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tutor");
        }

        if (data.success) {
          const transformedTutor: Tutor = {
            ...data.tutor,
            description: description ? decodeURIComponent(description) : data.tutor.description,
            rating: rating ? parseFloat(rating) : (Math.random() * (5 - 4) + 4),
            contactNumber: contactNumber ? decodeURIComponent(contactNumber) : data.tutor.contactNumber,
            email: email ? decodeURIComponent(email) : data.tutor.email,
            subject: data.tutor.subject || [], // Ensure subject is always an array
          };
          setTutor(transformedTutor);

          // Pre-fill subject and location if tutor has specific subjects
          if (transformedTutor.subject.length > 0) {
            setFormData((prev) => ({
              ...prev,
              subjectName: transformedTutor.subject[0].name || prev.subjectName,
              location: transformedTutor.subject[0].place || prev.location,
            }));
          }
        } else {
          throw new Error("Failed to fetch tutor");
        }
      } catch (err: any) {
        console.error("Error fetching tutor:", err);
        setTutorFetchError(
          err.message || "An unexpected error occurred while fetching tutor"
        );
      }
    };

    fetchTutor();
  }, [tutorId, description, rating, contactNumber, email]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate payment fields
    if (name === "cardNumber") {
      const cardNumber = value.replace(/\s/g, "");
      if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        setFormErrors((prev) => ({
          ...prev,
          cardNumber: "Card number must be 16 digits",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, cardNumber: "" }));
      }
    } else if (name === "expirationDate") {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          expirationDate: "Expiration date must be in MM/YY format",
        }));
      } else {
        const [month, year] = value.split("/").map(Number);
        const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
        const currentMonth = new Date().getMonth() + 1; // 1-12
        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          setFormErrors((prev) => ({
            ...prev,
            expirationDate: "Card is expired",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, expirationDate: "" }));
        }
      }
    } else if (name === "securityCode") {
      if (!/^\d{3,4}$/.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          securityCode: "Security code must be 3 or 4 digits",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, securityCode: "" }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for form errors
    if (
      formErrors.cardNumber ||
      formErrors.expirationDate ||
      formErrors.securityCode
    ) {
      setError("Please fix the errors in the form before submitting");
      return;
    }

    if (!tutorId) {
      setError("Tutor ID is missing. Please select a tutor.");
      return;
    }

    if (!tutor) {
      setError("Tutor details not loaded. Please try again.");
      return;
    }

    if (!user) {
      setError("You must be logged in to enroll. Please log in and try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tutorName = `${tutor.firstName} ${tutor.lastName}`;
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId,
          studentId: user.id, // Use the logged-in user's ID
          tutorName,
          subject: formData.subjectName,
          place: formData.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll");
      }

      setSuccess(data.message || "Enrollment successful!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred while enrolling");
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={handleBack}
          className="mb-4 text-green-600 hover:underline flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {tutorFetchError && (
          <p className="text-red-500 text-center mb-4">{tutorFetchError}</p>
        )}
        {userFetchError && (
          <p className="text-red-500 text-center mb-4">{userFetchError}</p>
        )}

        {tutor && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Enroll with {tutor.firstName} {tutor.lastName}
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Description:</strong> {tutor.description}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Rating:</strong> {tutor.rating.toFixed(1)}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Contact:</strong> {tutor.contactNumber}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> {tutor.email}
            </p>
            {tutor.subject.length > 0 && (
              <div>
                <p className="text-gray-600 mb-2">
                  <strong>Subjects:</strong>
                </p>
                <ul className="list-disc list-inside">
                  {tutor.subject.map((subj, index) => (
                    <li key={index} className="text-gray-600">
                      {subj.name} ({subj.place})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Enrollment Form
          </h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
                required
                disabled={!!user} // Disable if user is logged in
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your address"
                required
              />
            </div>
            <div>
              <label htmlFor="subjectName" className="block text-gray-700">
                Subject
              </label>
              {tutor && tutor.subject.length > 0 ? (
                <select
                  id="subjectName"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {tutor.subject.map((subj, index) => (
                    <option key={index} value={subj.name}>
                      {subj.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="subjectName"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter the subject"
                  required
                />
              )}
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-700">
                Location
              </label>
              {tutor && tutor.subject.length > 0 ? (
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {tutor.subject.map((subj, index) => (
                    <option key={index} value={subj.place}>
                      {subj.place}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                </select>
              )}
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Payment Information
              </h4>
              <p className="text-gray-600 mb-2">
                Enrollment Fee: ${enrollmentFee}
              </p>
              <div>
                <label htmlFor="cardNumber" className="block text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formErrors.cardNumber
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-500"
                  }`}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                {formErrors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.cardNumber}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="expirationDate"
                    className="block text-gray-700"
                  >
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.expirationDate
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500"
                    }`}
                    placeholder="MM/YY"
                    required
                  />
                  {formErrors.expirationDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.expirationDate}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="securityCode" className="block text-gray-700">
                    Security Code
                  </label>
                  <input
                    type="text"
                    id="securityCode"
                    name="securityCode"
                    value={formData.securityCode}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.securityCode
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500"
                    }`}
                    placeholder="CVC"
                    required
                  />
                  {formErrors.securityCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.securityCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !user}
              className={`w-full p-2 text-white rounded-md transition ${
                loading || !user
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Submitting..." : "Enroll Now"}
            </button>
            {!user && (
              <p className="mt-2 text-sm">
                <a
                  href={`/login?callbackUrl=${encodeURIComponent(currentUrl)}`}
                  className="text-green-600 underline"
                >
                  Login to enroll
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}