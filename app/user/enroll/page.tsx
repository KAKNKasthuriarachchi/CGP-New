// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  description: string;
  rating: number;
  contactNumber: string;
  email: string;
  picture?: string;
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

  const tutorId = searchParams.get("tutorId");
  const description = searchParams.get("description");
  const rating = searchParams.get("rating");
  const contactNumber = searchParams.get("contactNumber");
  const email = searchParams.get("email");

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [tutorFetchError, setTutorFetchError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userFetchError, setUserFetchError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    subjectName: "Mathematics",
    location: "Online",
  });
  const [success, setSuccess] = useState<string | null>(null);

  const enrollmentFee = 10;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch user");

        if (data.success) {
          setUser(data.user);
          setFormData((prev) => ({ ...prev, email: data.user.email || "" }));
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (err) {
        setUserFetchError(err.message || "An error occurred while fetching user");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!tutorId) {
        setTutorFetchError("Tutor ID is missing");
        return;
      }

      try {
        const response = await fetch(`/api/tutor?id=${tutorId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch tutor");

        if (data.success) {
          const transformedTutor: Tutor = {
            ...data.tutor,
            description: description ? decodeURIComponent(description) : data.tutor.description,
            rating: rating ? parseFloat(rating) : Math.random() * (5 - 4) + 4,
            contactNumber: contactNumber ? decodeURIComponent(contactNumber) : data.tutor.contactNumber,
            email: email ? decodeURIComponent(email) : data.tutor.email,
            picture: data.tutor.picture || "https://img.icons8.com/?size=100&id=WNS8XGkd1Rhp&format=png&color=000000",
            subject: data.tutor.subject || [],
          };
          setTutor(transformedTutor);

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
      } catch (err) {
        setTutorFetchError(err.message || "An error occurred while fetching tutor");
      }
    };

    fetchTutor();
  }, [tutorId, description, rating, contactNumber, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    router.back();
  };

  const handlePaymentSuccess = () => {
    setSuccess("Payment successful! Redirecting to dashboard...");
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={handleBack}
          className="mb-4 text-green-600 hover:underline flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {tutorFetchError && <p className="text-red-500 text-center mb-4">{tutorFetchError}</p>}
        {userFetchError && <p className="text-red-500 text-center mb-4">{userFetchError}</p>}

        {tutor && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-start space-x-4">
            <img
              src={tutor.picture}
              alt={`${tutor.firstName} ${tutor.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Enroll with {tutor.firstName} {tutor.lastName}
              </h2>
              <p className="text-gray-600 mb-2"><strong>Description:</strong> {tutor.description}</p>
              <p className="text-gray-600 mb-2"><strong>Rating:</strong> {tutor.rating.toFixed(1)}</p>
              <p className="text-gray-600 mb-2"><strong>Contact:</strong> {tutor.contactNumber}</p>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> {tutor.email}</p>
              {tutor.subject.length > 0 && (
                <div>
                  <p className="text-gray-600 mb-2"><strong>Subjects:</strong></p>
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
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Enrollment Form</h3>
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form className="space-y-4">
            {/* form fields */}
            {/* ...same as before... */}

            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment</h4>
            <p className="text-gray-600 mb-4">Enrollment Fee: LKR2500.00</p>

            {!user ? (
              <p className="mt-2 text-sm">
                <a href="/login" className="text-green-600 underline">
                  Login to pay
                </a>
              </p>
            ) : (
              <PayPalScriptProvider
                options={{
                  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                  currency: "USD",
                  components: "buttons",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical", color: "gold", shape: "pill" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: { value: enrollmentFee.toString() },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    console.log("Payment approved:", details);
                    handlePaymentSuccess();
                  }}
                  onError={(err) => {
                    console.error("PayPal Checkout Error:", err);
                    alert("Payment failed. Please try again.");
                  }}
                />
              </PayPalScriptProvider>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
