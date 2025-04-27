"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faChartLine, 
  faCog, 
  faClipboardList, 
  faGraduationCap, 
  faUser, 
  faLock,
  faEye,
  faEyeSlash,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'; 

interface FormData {
  username: string;
  password: string;
  remember: boolean;
}

interface Errors {
  username: boolean;
  password: boolean;
  form?: string; 
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    remember: false,
  });
  
  const [errors, setErrors] = useState<Errors>({
    username: false,
    password: false,
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
   
    if (name in formData) {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
    
    if (value.trim() !== '') {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let valid = true;
    const newErrors: Errors = { username: false, password: false };
    
    if (!formData.username.trim()) {
      newErrors.username = true;
      valid = false;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = true;
      valid = false;
    }
    
    setErrors(newErrors);
    
    if (valid) {
      try {
        const response = await fetch('/api/admin-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to log in as admin');
        }

        alert('Admin login successful! Redirecting to admin dashboard...');
        setTimeout(() => window.location.href = '/admin/tutor', 2000);
      } catch (err: any) {
        setErrors({ ...errors, form: err.message || 'An error occurred while logging in' });
      }
    }
  };

  const features = [
    { icon: faUsers, text: "Manage tutors and students" },
    { icon: faChartLine, text: "View analytics and reports" },
    { icon: faCog, text: "Configure platform settings" },
    { icon: faClipboardList, text: "Moderate content and reviews" },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center p-5 bg-cover relative"
         style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/001/898/535/non_2x/books-and-stationery-on-the-desk-free-photo.jpg')" }}>
      {/* Background overlay with blur */}
      <div className="fixed inset-0 bg-cover bg-center blur-md z-0"
           style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/001/898/535/non_2x/books-and-stationery-on-the-desk-free-photo.jpg')" }}>
      </div>
      
      <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl z-10 min-h-[550px]">
        {/* Left panel */}
        <div className="relative bg-gradient-to-b from-green-900 to-green-600 w-2/5 flex flex-col justify-end p-10 text-white">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"></div>
          
          <div className="relative z-20">
            <h1 className="font-serif text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-base mb-8">Manage your TuitionFinder platform with ease</p>
            
            <div className="mt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 mr-4 flex items-center justify-center">
                    <FontAwesomeIcon icon={feature.icon} className="text-white text-lg" />
                  </div>
                  <div className="text-sm">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right panel */}
        <div className="bg-white w-3/5 p-12 flex flex-col justify-center">
          <div className="flex items-center text-2xl font-bold text-green-900 mb-8 font-serif">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-3xl" />
            TuitionFinder
            <span className="ml-2 bg-green-900 text-white text-xs px-2 py-1 rounded">ADMIN</span>
          </div>
          
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">Admin Login</h2>
          <p className="text-gray-600 text-base mb-8">Enter your admin credentials to access the dashboard</p>
          
          <div className="flex items-center bg-green-900/10 p-4 rounded-lg mb-6">
            <FontAwesomeIcon icon={faShieldAlt} className="text-green-900 text-xl mr-4" />
            <p className="text-sm text-gray-800">This is a secure area for authorized personnel only. All login attempts are logged.</p>
          </div>
          
          {errors.form && <p className="text-red-500 text-center mb-4">{errors.form}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6 relative">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" 
                />
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`w-full py-4 pl-12 pr-4 border rounded-lg bg-gray-50 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:bg-white transition-all ${errors.username ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder=" "
                  value={formData.username}
                  onChange={handleChange}
                />
                <label
                  htmlFor="username"
                  className={`absolute left-12 transition-all duration-300 pointer-events-none text-gray-500 ${
                    formData.username ? 'text-xs -top-2 left-4 bg-white px-1 text-green-900' : 'top-4'
                  }`}
                >
                  Admin Username
                </label>
              </div>
              {errors.username && <div className="text-red-500 text-xs mt-1">Please enter your admin username</div>}
            </div>
            
            <div className="mb-6 relative">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faLock} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" 
                />
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full py-4 pl-12 pr-10 border rounded-lg bg-gray-50 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:bg-white transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                />
                <label
                  htmlFor="password"
                  className={`absolute left-12 transition-all duration-300 pointer-events-none text-gray-500 ${
                    formData.password ? 'text-xs -top-2 left-4 bg-white px-1 text-green-900' : 'top-4'
                  }`}
                >
                  Admin Password
                </label>
                <FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1">Please enter your password</div>}
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
                <label htmlFor="remember" className="text-gray-700">Remember me</label>
              </div>
              <Link href="#" className="text-green-900 font-medium hover:underline text-sm">Reset Password</Link>
            </div>
            
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-900 text-white font-semibold rounded-lg hover:translate-y-[-2px] hover:shadow-lg transition-all active:translate-y-0 text-base mb-6"
            >
              ADMIN LOGIN
            </button>
          </form>
          
          <div className="text-center text-gray-600 text-sm mt-6">
            <Link href="/auth/login" className="text-green-900 font-semibold hover:underline">User Login</Link> |{' '}
            <Link href="/signup" className="text-green-900 font-semibold hover:underline">Registration</Link> |{' '}
            <Link href="#" className="text-green-900 font-semibold hover:underline">Help & Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}