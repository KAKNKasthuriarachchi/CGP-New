"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Apple, Facebook } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

interface Errors {
  email: boolean;
  password: boolean;
  form?: string;
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
  
    if (name in formData) {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }

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
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: true, 
        });

        if (result?.error) {
          throw new Error(result.error || 'Failed to log in');
        }
      } catch (err: any) {
        setErrors({ ...errors, form: err.message || 'An error occurred while logging in' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative">
      
      <style jsx global>{`
        @keyframes rise {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
        .shape {
          transform: translateY(100vh);
          opacity: 0;
        }
        .animate-rise {
          animation: rise 5s linear infinite;
        }
        .animate-rise-delay-1 {
          animation: rise 5s linear infinite;
          animation-delay: 0.5s;
        }
        .animate-rise-delay-2 {
          animation: rise 5s linear infinite;
          animation-delay: 1s;
        }
        .animate-rise-delay-3 {
          animation: rise 5s linear infinite;
          animation-delay: 1.5s;
        }
        .animate-rise-delay-4 {
          animation: rise 5s linear infinite;
          animation-delay: 2s;
        }
        .animate-rise-delay-5 {
          animation: rise 5s linear infinite;
          animation-delay: 2.5s;
        }
        .animate-rise-delay-6 {
          animation: rise 5s linear infinite;
          animation-delay: 3s;
        }
        .animate-rise-delay-7 {
          animation: rise 5s linear infinite;
          animation-delay: 3.5s;
        }
        .animate-rise-delay-8 {
          animation: rise 5s linear infinite;
          animation-delay: 4s;
        }
        .animate-rise-delay-9 {
          animation: rise 5s linear infinite;
          animation-delay: 4.5s;
        }
        .animate-rise-delay-10 {
          animation: rise 5s linear infinite;
          animation-delay: 5s;
        }
        .animate-rise-delay-11 {
          animation: rise 5s linear infinite;
          animation-delay: 5.5s;
        }
      `}</style>

      <div className="fixed inset-0 -z-10 bg-white">
       
        <div className="absolute left-10 w-24 h-24 bg-green-500/50 rounded-full shape animate-rise"></div>
        <div className="absolute right-20 w-32 h-32 bg-green-500/35 rounded-full shape animate-rise-delay-1"></div>
        <div className="absolute right-1/4 w-16 h-16 bg-green-500/60 rounded-full shape animate-rise-delay-2"></div>
        <div className="absolute left-1/3 w-20 h-20 bg-green-500/40 rounded-full shape animate-rise-delay-3"></div>
        <div className="absolute left-1/4 w-12 h-12 bg-green-500/25 rounded-full shape animate-rise-delay-4"></div>
        <div className="absolute right-1/3 w-28 h-28 bg-green-500/55 rounded-full shape animate-rise-delay-5"></div>
        <div className="absolute left-1/2 w-20 h-20 bg-green-500/40 rounded-full shape animate-rise-delay-6"></div>
        <div className="absolute left-10 w-14 h-14 bg-green-500/35 rounded-full shape animate-rise-delay-7"></div>
        <div className="absolute right-5 w-20 h-20 bg-green-500/50 rounded-full shape animate-rise-delay-8"></div>
        <div className="absolute right-10 w-14 h-14 bg-green-500/45 rounded-full shape animate-rise-delay-9"></div>
        <div className="absolute right-1/3 w-16 h-16 bg-green-500/40 rounded-full shape animate-rise-delay-10"></div>
        <div className="absolute right-10 w-18 h-18 bg-green-500/35 rounded-full shape animate-rise-delay-11"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
       
        <div 
          className="md:w-2/5 relative flex flex-col justify-end p-10 text-white"
          style={{ 
            backgroundImage: "url('/duo.jpeg'), linear-gradient(to bottom, rgba(21, 128, 61, 0.8), rgba(16, 185, 129, 0.6))",
            backgroundSize: 'cover, auto',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-0"></div>
          
          <div className="relative z-10">
            <h1 className="font-serif text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-base mb-8">Continue your learning journey with TutorHub</p>
            
            <div className="mt-6 p-5 bg-white/10 rounded-lg relative">
              <div className="absolute top-0 left-3 text-5xl leading-none text-white/30 transform -translate-y-1/2">"</div>
              <p className="italic mb-4">
                "TutorHub helped me find the perfect math tutor. My grades improved dramatically in just two months!"
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
        
       
        <div className="md:w-3/5 bg-white p-10 md:p-12 flex flex-col justify-center">
          <div className="font-serif text-2xl font-bold text-green-700 mb-8 flex items-center">
            <img src="/logo.ico" alt="App Logo" className="w-7 h-7 mr-2" />
            TutorHub
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
                  className={`w-full py-3 pl-10 pr-4 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-3xl bg-white text-black placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-green-600`}
                  placeholder=" "
                  required
                />
                <label className={`absolute left-10 transition-all pointer-events-none ${formData.email ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-3 text-gray-500'}`}>
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
                  className={`w-full py-3 pl-10 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-3xl bg-white text-black placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-green-600`}
                  placeholder=" "
                  required
                />
                <label className={`absolute left-10 transition-all pointer-events-none ${formData.password ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-3 text-gray-500'}`}>
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
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-3xl transition-all hover:translate-y-px hover:shadow-lg hover:scale-105 active:translate-y-0 active:scale-100 shadow-md mb-6 cursor-pointer"
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
            Don't have an account? <Link href="/auth/signup" className="text-green-700 font-semibold hover:underline">Sign Up</Link>
            <span className="mx-2">|</span>
            <Link href="/auth/adminlog" className="text-green-700 font-semibold hover:underline">Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}