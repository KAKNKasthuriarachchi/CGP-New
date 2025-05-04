// @ts-nocheck

"use client"

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const enrollmentFee = 1500; // Enrollment Fee in LKR

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

  const [tutor, setTutor] = useState(null);
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userFetchError, setUserFetchError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch user");

        if (data.success) {
          setUser(data.user);
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
        console.error("Tutor ID is missing");
        return;
      }

      try {
        const response = await fetch(`/api/tutor?id=${tutorId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch tutor");

        if (data.success) {
          const transformedTutor = {
            ...data.tutor,
            description: description ? decodeURIComponent(description) : data.tutor.description,
            rating: rating ? parseFloat(rating) : Math.random() * (5 - 4) + 4,
            contactNumber: contactNumber ? decodeURIComponent(contactNumber) : data.tutor.contactNumber,
            email: email ? decodeURIComponent(email) : data.tutor.email,
          };
          setTutor(transformedTutor);
        } else {
          throw new Error("Failed to fetch tutor");
        }
      } catch (err) {
        console.error(err.message || "An error occurred while fetching tutor");
      }
    };

    fetchTutor();
  }, [tutorId, description, rating, contactNumber, email]);

  const handlePaymentSuccess = () => {
    setSuccess("Payment successful! Redirecting to dashboard...");
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  const handlePayment = () => {
    if (!user) {
      alert("You must be logged in to make a payment.");
      return;
    }

    // PayHere payment details
    const paymentDetails = {
      merchant_id: "YOUR_PAYHERE_MERCHANT_ID", // Replace with your PayHere merchant ID
      return_url: `${currentUrl}/payment-success`, // Success URL
      cancel_url: `${currentUrl}/payment-cancel`, // Cancel URL
      notify_url: `${currentUrl}/payment-notify`, // Payment notification URL
      order_id: `${Date.now()}`, // Unique order ID (use timestamp for uniqueness)
      amount: enrollmentFee, // Enrollment fee in LKR
      currency: "LKR", // Currency in LKR
      first_name: user.name, // User's first name
      email: user.email, // User's email
      phone: user.phoneNumber, // User's phone number (if available)
      address: user.address, // User's address
    };

    // Load PayHere SDK
    const payhere = window.PayHere;

    payhere.on('payment-complete', (payment) => {
      console.log('Payment complete', payment);
      handlePaymentSuccess();
    });

    payhere.on('payment-failed', (error) => {
      console.error('Payment failed', error);
      alert("Payment failed. Please try again.");
    });

    // Trigger PayHere payment
    payhere.startPayment(paymentDetails);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => router.back()} className="mb-4 text-green-600 hover:underline flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {userFetchError && <p className="text-red-500 text-center mb-4">{userFetchError}</p>}

        {tutor && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-start space-x-4">
            <img
              src={tutor.picture || "https://img.icons8.com/?size=100&id=WNS8XGkd1Rhp&format=png&color=000000"}
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
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment</h4>
            <p className="text-gray-600 mb-4">Enrollment Fee: LKR {enrollmentFee}</p>

            {!user ? (
              <p className="mt-2 text-sm">
                <a href="/login" className="text-green-600 underline">
                  Login to pay
                </a>
              </p>
            ) : (
              <button
                type="button"
                onClick={handlePayment}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-full hover:bg-green-700"
              >
                Pay LKR {enrollmentFee}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
