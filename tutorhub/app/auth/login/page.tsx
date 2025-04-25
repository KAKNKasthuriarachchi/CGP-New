"use client";

import { useState } from 'react';
import Link from 'next/link'; // Added for client-side routing
import { Eye, EyeOff, Mail, Lock, User, GraduationCap , Apple ,Facebook } from 'lucide-react';

// Define the shape of formData
interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

// Define the shape of errors
interface Errors {
  email: boolean;
  password: boolean;
  form?: string; // Added for API errors
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<Errors>({
    email: false,
    password: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Ensure name is a key of FormData
    if (name in formData) {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }

    // Clear errors when typing
    if (name in errors && errors[name as keyof Errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;
    const newErrors: Errors = { email: false, password: false };

    if (!formData.email.trim()) {
      newErrors.email = true;
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = true;
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = true;
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        // Make API call to /api/auth (assuming NextAuth.js is set up)
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to log in');
        }

        // On success, redirect to dashboard
        alert('Login successful! Redirecting to dashboard...');
        setTimeout(() => window.location.href = '/dashboard', 2000);
      } catch (err: any) {
        setErrors({ ...errors, form: err.message || 'An error occurred while logging in' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-cover bg-center bg-no-repeat before:fixed before:inset-0 before:bg-black/20 before:-z-10 before:blur-md relative">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Panel */}
        <div className="md:w-2/5 bg-gradient-to-b from-green-700/80 to-green-500/60 relative flex flex-col justify-end p-10 text-white">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-0"></div>
          
          <div className="relative z-10">
            <h1 className="font-serif text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-base mb-8">Continue your learning journey with TuitionFinder</p>
            
            <div className="mt-6 p-5 bg-white/10 rounded-lg relative">
              <div className="absolute top-0 left-3 text-5xl leading-none text-white/30 transform -translate-y-1/2">"</div>
              <p className="italic mb-4">
                "TuitionFinder helped me find the perfect math tutor. My grades improved dramatically in just two months!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/50 flex items-center justify-center mr-3">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Sarah Johnson</h4>
                  <p className="text-xs opacity-80">High School Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="md:w-3/5 bg-white p-10 md:p-12 flex flex-col justify-center">
          <div className="font-serif text-2xl font-bold text-green-700 mb-8 flex items-center">
            <GraduationCap size={28} className="mr-2" />
            TuitionFinder
          </div>
          
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Log In to Your Account</h2>
          <p className="text-gray-500 mb-8">Please enter your credentials to continue</p>
          
          {errors.form && <p className="text-red-500 text-center mb-4">{errors.form}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full py-4 pl-12 pr-4 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all`}
                  placeholder=" "
                  required
                />
                <label className={`absolute left-12 transition-all pointer-events-none ${formData.email ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-4 text-gray-500'}`}>
                  Email Address
                </label>
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full py-4 pl-12 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg bg-gray-50 focus:outline-none focus:border-green-500 focus:bg-white transition-all`}
                  placeholder=" "
                  required
                />
                <label className={`absolute left-12 transition-all pointer-events-none ${formData.password ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-4 text-gray-500'}`}>
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">Please enter your password</p>}
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="mr-2 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="remember" className="text-gray-600 text-sm">Remember me</label>
              </div>
              <Link href="#" className="text-green-700 font-medium text-sm hover:underline">Forgot Password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg transition-all hover:translate-y-px hover:shadow-lg active:translate-y-0 mb-6"
            >
              LOG IN
            </button>
            
            <div className="flex items-center my-6 text-gray-500">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all">
                <Facebook size={20} className="text-blue-600" />
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all">
                <Apple size={20} className="text-black" />
              </a>
            </div>
          </form>
          
          <div className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account? <Link href="/signup" className="text-green-700 font-semibold hover:underline">Sign Up</Link>
            <span className="mx-2">|</span>
            <Link href="#" className="text-green-700 font-semibold hover:underline">Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}