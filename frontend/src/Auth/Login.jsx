import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/apiService';
import { useAuthContext } from '../context/AuthContext';
import { Mail, KeyRound, LogIn, RefreshCw } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthContext();


  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("e.target from login", e.target);
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "Password is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const apiCredentials = { username: formData.username, password: formData.password };
      const data = await loginUser(apiCredentials);
      console.log("Login response data:", data);
      if (data.status) {
        toast.success("Login Successful!");
        login(data || { token: 'dummy_token' });
        navigate('/');
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/30 to-blue-900/40 backdrop-blur-3xl"></div>
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-float1"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl animate-float2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-600/30 rounded-full filter blur-3xl animate-float3"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 z-0 opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: `${Math.random() * 18 + 2}px`,
              height: `${Math.random() * 18 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Glass morphism card */}
      <div
        className={`relative w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 ${isHovered ? 'shadow-indigo-500/20' : 'shadow-white/10'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative border animation */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden z-0">
          <div className="absolute inset-0 border-2 border-transparent rounded-3xl animate-border-spin" style={{
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(165, 180, 252, 0.5) 10%, transparent 20%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '2px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/70 mt-2">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Mobile No</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -m-0.5"></div>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter your mobile No."
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-11 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.username ? 'border-red-400/50 focus:ring-red-400/30' : 'focus:ring-indigo-500/30 focus:border-indigo-400/50'}`}
                  />
                  <Mail className="absolute left-3 text-white/50 group-focus-within:text-indigo-300 transition-colors" size={20} />
                </div>
              </div>
              {errors.username && <p className="text-red-300 text-xs mt-1 animate-fade-in">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -m-0.5"></div>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-11 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.password ? 'border-red-400/50 focus:ring-red-400/30' : 'focus:ring-indigo-500/30 focus:border-indigo-400/50'}`}
                  />
                  <KeyRound className="absolute left-3 text-white/50 group-focus-within:text-indigo-300 transition-colors" size={20} />
                </div>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1 animate-fade-in">{errors.password}</p>}
            </div>

            

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-indigo-500/90 to-purple-600/90 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed border border-white/20 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <span className="relative z-10">Login</span>
                  <LogIn size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/70 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-300 hover:text-white hover:underline underline-offset-4 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

     
      <style jsx global>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(50px, 30px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, 20px) rotate(-180deg); }
          100% { transform: translate(0, 0) rotate(-360deg); }
        }
        @keyframes float3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-100px) translateX(20px); }
          100% { transform: translateY(0) translateX(0); }
        }
        @keyframes border-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float1 {
          animation: float1 15s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 18s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 12s ease-in-out infinite;
        }
        .animate-border-spin {
          animation: border-spin 8s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Login;