"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
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
            backgroundImage: "url('/signup.jpeg'), linear-gradient(to bottom, rgba(21, 128, 61, 0.8), rgba(16, 185, 129, 0.6))",
            backgroundSize: 'cover, auto',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-0"></div>
          
          <div className="relative z-10">
            <h1 className="font-serif text-3xl font-bold mb-2">Join Us Today!</h1>
            <p className="text-base mb-8">Start your learning journey with TutorHub</p>
            
            <div className="mt-6 p-5 bg-white/10 rounded-lg relative">
              <div className="absolute top-0 left-3 text-5xl leading-none text-white/30 transform -translate-y-1/2">"</div>
              <p className="italic mb-4">
                "TutorHub made it so easy to find a tutor who fits my schedule and learning style. I’m already seeing progress!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/50 flex items-center justify-center mr-3">
                  <FaUser size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Alex Carter</h4>
                  <p className="text-xs opacity-80">College Student</p>
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
          
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Create Your Account</h2>
          <p className="text-gray-500 mb-8">Please enter your details to sign up</p>
          
          {errors.form && <p className="text-red-500 text-center mb-4">{errors.form}</p>}
          
          <form onSubmit={handleSubmit}>
           
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              
              <div className="w-full relative">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    id="firstName"
                    className={`w-full py-3 pl-10 pr-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-3xl bg-white text-black placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-green-600`}
                    placeholder=" "
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <label 
                    htmlFor="firstName" 
                    className={`absolute left-10 transition-all pointer-events-none ${formData.firstName ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-3 text-gray-500'}`}
                  >
                    First Name
                  </label>
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              
              <div className="w-full relative">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    id="lastName"
                    className={`w-full py-3 pl-10 pr-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-3xl bg-white text-black placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-green-600`}
                    placeholder=" "
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <label 
                    htmlFor="lastName" 
                    className={`absolute left-10 transition-all pointer-events-none ${formData.lastName ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-3 text-gray-500'}`}
                  >
                    Last Name
                  </label>
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            
            
            <div className="mb-6 relative">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  id="email"
                  className={`w-full py-3 pl-10 pr-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-3xl bg-white text-black placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-green-600`}
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                />
                <label 
                  htmlFor="email" 
                  className={`absolute left-10 transition-all pointer-events-none ${formData.email ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-3 text-gray-500'}`}
                >
                  Email Address
                </label>
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            
            <div className="mb-6 relative">
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="date"
                  id="dob"
                  className={`w-full py-3 pl-10 pr-3 border ${errors.dob ? 'border-red-500' : 'border-gray-200'} rounded-3xl bg-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-green-600`}
                  value={formData.dob}
                  onChange={handleChange}
                />
                <label 
                  htmlFor="dob" 
                  className={`absolute left-10 transition-all pointer-events-none ${formData.dob ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-3 text-gray-500'}`}
                >
                  Date of Birth
                </label>
              </div>
              {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
            </div>
            
            <div className="mb-6 relative">
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full py-3 pl-10 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-3xl bg-white text-black placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-green-600`}
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                />
                <label 
                  htmlFor="password" 
                  className={`absolute left-10 transition-all pointer-events-none ${formData.password ? 'text-xs -top-2 left-4 bg-white px-1 text-green-700' : 'top-3 text-gray-500'}`}
                >
                  Password
                </label>
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              
              <div className="h-1 bg-gray-200 rounded mt-2">
                <div 
                  className={`h-full rounded transition-all ${getStrengthColor()}`} 
                  style={{ width: `${passwordStrength.score}%` }}
                ></div>
              </div>
              
            
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
            
           
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-3xl transition-all hover:translate-y-px hover:shadow-lg hover:scale-105 active:translate-y-0 active:scale-100 shadow-md mb-6 cursor-pointer"
            >
              CREATE ACCOUNT
            </button>
          </form>
          
        
          <div className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <a href="/auth/login" className="text-green-700 font-semibold hover:underline">Login</a>
            <span className="mx-2">|</span>
            <a href="/auth/adminlog" className="text-green-700 font-semibold hover:underline">Admin Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionFinderRegistration;