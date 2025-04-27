"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  FaGraduationCap, 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCheck 
} from 'react-icons/fa';


interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  password: string;
}


interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  password?: string;
  form?: string;
}


interface PasswordStrength {
  score: number;
  hasLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
}


const formDataInitial: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  dob: '',
  password: ''
};


const errorsInitial: Errors = {};


const passwordStrengthInitial: PasswordStrength = {
  score: 0,
  hasLength: false,
  hasLetter: false,
  hasNumber: false
};

const TuitionFinderRegistration: React.FC = () => {

  const [formData, setFormData] = useState<FormData>(formDataInitial);
  
  
  const [errors, setErrors] = useState<Errors>(errorsInitial);
  

  const [showPassword, setShowPassword] = useState<boolean>(false);
  

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(passwordStrengthInitial);
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
   
    if (id in formData) {
      setFormData({
        ...formData,
        [id]: value
      });
    }
    

    if (id in errors && errors[id as keyof Errors]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };
  

  useEffect(() => {
    if (formData.password) {
      const hasLength = formData.password.length >= 8;
      const hasLetter = /[a-zA-Z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      
      let score = 0;
      if (hasLength) score += 33.33;
      if (hasLetter) score += 33.33;
      if (hasNumber) score += 33.33;
      
      setPasswordStrength({
        score,
        hasLength,
        hasLetter,
        hasNumber
      });
    } else {
      setPasswordStrength(passwordStrengthInitial);
    }
  }, [formData.password]);
  

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Please enter your first name';
    if (!formData.lastName.trim()) newErrors.lastName = 'Please enter your last name';

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    

    if (!formData.dob) newErrors.dob = 'Please enter your date of birth';
    

    if (!formData.password) {
      newErrors.password = 'Please enter a password';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            dob: formData.dob,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          
          if (data.errors) {
            if (data.errors.form) {
              throw new Error(data.errors.form);
            } else if (data.errors.email) {
              throw new Error(data.errors.email); 
            } else {
              throw new Error('Failed to register: ' + JSON.stringify(data.errors));
            }
          }
          throw new Error('Failed to register');
        }

        alert('Registration successful! Redirecting to login...');
        setTimeout(() => window.location.href = '/auth/login', 2000);
      } catch (err) {
        setErrors({ ...errors, form: (err as Error).message || 'An error occurred while registering' });
      }
    }
  };
  
 
  const getStrengthColor = (): string => {
    if (passwordStrength.score < 33) return 'bg-red-500';
    if (passwordStrength.score < 67) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-100 relative">
      {/* Background image with blur effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center blur-md"
             style={{backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/001/898/535/non_2x/books-and-stationery-on-the-desk-free-photo.jpg')"}}></div>
      </div>
      
      <div className="container max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl z-10 relative">
        {/* Left Panel */}
        <div className="bg-gradient-to-b from-green-700/80 to-green-500/70 md:w-2/5 p-10 relative text-white flex flex-col justify-end">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h1 className="font-serif text-3xl font-bold mb-2">Find Your Perfect Tutor</h1>
            <p className="text-base mb-6">Join thousands of students discovering the perfect tutors for their educational journey.</p>
            
            <div className="space-y-4 mt-5">
              <div className="flex items-center">
                <div className="bg-green-500 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                  <FaCheck className="text-xs" />
                </div>
                <span>Access to verified expert tutors</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                  <FaCheck className="text-xs" />
                </div>
                <span>Personalized learning plans</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                  <FaCheck className="text-xs" />
                </div>
                <span>Flexible scheduling options</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="bg-white md:w-3/5 p-10 md:p-12 overflow-y-auto">
          <div className="flex items-center text-2xl text-green-700 font-bold font-serif mb-8">
            <FaGraduationCap className="text-3xl mr-2" />
            TuitionFinder
          </div>
          
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Your Account</h2>
          
          {errors.form && <p className="text-red-500 text-center mb-4">{errors.form}</p>}
          
          <form onSubmit={handleSubmit}>
            {/* Name Fields Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-5">
              {/* First Name */}
              <div className="w-full relative">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="firstName"
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder=" "
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <label 
                    htmlFor="firstName" 
                    className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                      formData.firstName ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                    }`}
                  >
                    First Name
                  </label>
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              
              {/* Last Name */}
              <div className="w-full relative">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="lastName"
                    className={`w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder=" "
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <label 
                    htmlFor="lastName" 
                    className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                      formData.lastName ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                    }`}
                  >
                    Last Name
                  </label>
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            
            {/* Email */}
            <div className="mb-5 relative">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                  }`}
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                />
                <label 
                  htmlFor="email" 
                  className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                    formData.email ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                  }`}
                >
                  Email Address
                </label>
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            {/* Date of Birth */}
            <div className="mb-5 relative">
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="date"
                  id="dob"
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                    errors.dob ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                  }`}
                  value={formData.dob}
                  onChange={handleChange}
                />
                <label 
                  htmlFor="dob" 
                  className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                    formData.dob ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                  }`}
                >
                  Date of Birth
                </label>
              </div>
              {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
            </div>
            
            {/* Password */}
            <div className="mb-6 relative">
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full py-3 pl-10 pr-10 border rounded-lg bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-1 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                  }`}
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                />
                <label 
                  htmlFor="password" 
                  className={`absolute text-gray-500 left-10 transition-all duration-200 ${
                    formData.password ? 'text-xs -top-2 bg-white px-1 left-3 text-green-700' : 'top-3'
                  }`}
                >
                  Password
                </label>
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password strength meter */}
              <div className="h-1 bg-gray-200 rounded mt-2">
                <div 
                  className={`h-full rounded transition-all ${getStrengthColor()}`} 
                  style={{ width: `${passwordStrength.score}%` }}
                ></div>
              </div>
              
              {/* Password requirements */}
              <div className="flex gap-2 mt-2">
                <div className={`text-xs flex-1 pl-4 relative ${passwordStrength.hasLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full ${passwordStrength.hasLength ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  At least 8 characters
                </div>
                <div className={`text-xs flex-1 pl-4 relative ${passwordStrength.hasLetter ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full ${passwordStrength.hasLetter ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Letters
                </div>
                <div className={`text-xs flex-1 pl-4 relative ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Numbers
                </div>
              </div>
              
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              CREATE ACCOUNT
            </button>
          </form>
          
          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            Already have an account? <a href="/login" className="text-green-700 font-semibold">Sign In</a>
            <span className="mx-2">|</span>
            <a href="#" className="text-green-700 font-semibold">Admin Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionFinderRegistration;