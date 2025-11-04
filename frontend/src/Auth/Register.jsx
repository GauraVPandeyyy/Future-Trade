import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/apiService";
import { UserPlus, RefreshCw, Eye, EyeOff } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    sponserId: "",
    sponserName: "",
    applicantName: "",
    username: "",
    gmail: "",
    password: "",
    state: "",
    city: "",
    address: "",
    bankName: "",
    branch: "",
    ifscCode: "",
    accountNumber: "",
    panCard: "",
    adharCard: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch captcha
  // const fetchCaptcha = async () => {
  //   try {
  //     const data = await getCaptcha();
  //     if (data.status) {
  //       setCaptcha(data.captcha_code);
  //     } else {
  //       toast.error(data.message || "Could not load CAPTCHA.");
  //     }
  //   } catch {
  //     toast.error("Failed to connect to CAPTCHA service.");
  //   }
  // };

  // useEffect(() => {
  //   // Fetch states list
  //   async function fetchStates() {
  //     try {
  //       const data = await getIndiaStates();
  //       setStates(data.states || []);
  //     } catch {
  //       setStates([]);
  //     }
  //   }
  //   fetchStates();
  //   fetchCaptcha();
  // }, []);

  // Handle form changes
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }

   
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await registerUser(formData);

      if (response.status === 201 || response.status === true) {
        toast.success(response.message || "Registration successful!");
        navigate("/login");
      } else {
        if (response.errors) {
          const fieldErrors = {};
          // Object.keys(response.errors).forEach((key) => {
          //   fieldErrors[key] = Array.isArray(response.errors[key])
          //     ? response.errors[key][0]
          //     : response.errors[key];
          // });
          setErrors(response.errors);
        }
        if (!response.errors) {
          toast.error(response.message || "Registration failed.");
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // const fieldErrors = {};
        // Object.keys(error.response.data.errors).forEach((key) => {
        //   fieldErrors[key] = Array.isArray(error.response.data.errors[key])
        //     ? error.response.data.errors[key][0]
        //     : error.response.data.errors[key];
        // });
        setErrors(error.response.data.errors);
      } else {
        toast.error(
          error.response?.data?.message || "Server error. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setTimeout(() => setIsSubmitting(false), 500);
      // fetchCaptcha();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-5xl bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-8 sm:p-10 transform transition-all duration-500">
        {/* Header with animation */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full inline-block mb-4 border border-gray-600 animate-pulse-slow">
            <UserPlus size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Create Your Account
          </h1>
          <p className="text-gray-300 mt-2">Join us and start your journey</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            "sponserId",
            "sponserName",
            "applicantName",
            "username",
            "gmail",
            "password",
            "state",
            "city",
            "address",
            "bankName",
            "branch",
            "ifscCode",
            "accountNumber",
            "panCard",
            "adharCard",
          ].map((field) => {
            if (field === "password") {
              return (
                <div
                  key={field}
                  className="w-full relative animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                    *
                  </label>
                  <div className="relative">
                    <input
                      id={field}
                      name={field}
                      type={showPassword ? "text" : "password"}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-700 border ${
                        errors[field]
                          ? "border-red-500 shake-animation"
                          : "border-gray-600"
                      } rounded-lg text-white focus:outline-none focus:ring-2 ${
                        errors[field]
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } transition-all pr-12`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff
                          size={20}
                          className="text-gray-400 hover:text-white transition-colors"
                        />
                      ) : (
                        <Eye
                          size={20}
                          className="text-gray-400 hover:text-white transition-colors"
                        />
                      )}
                    </button>
                  </div>
                  {errors[field] && (
                    <p className="text-red-400 text-xs mt-1 animate-fade-in">
                      {errors[field]}
                    </p>
                  )}
                </div>
              );
            }
            if (field === "username") {
              return (
                <div
                  key={field}
                  className="w-full relative animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                    *
                  </label>
                  <div className="relative">
                    <input
                      id={field}
                      name={field}
                      type={"text"}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-700 border ${
                        errors[field]
                          ? "border-red-500 shake-animation"
                          : "border-gray-600"
                      } rounded-lg text-white focus:outline-none focus:ring-2 ${
                        errors[field]
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } transition-all pr-12`}
                      required
                    />
                   
                  </div>
                  {errors[field] && (
                    <p className="text-red-400 text-xs mt-1 animate-fade-in">
                      {errors[field]}
                    </p>
                  )}
                </div>
              );
            }

            return (
              <InputField
                key={field}
                label={field
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                name={field}
                type={field === "gmail" ? "email" : "text"}
                value={formData[field]}
                onChange={handleChange}
                error={errors[field]}
                className={field === "address" ? "md:col-span-2" : ""}
                animationDelay={0.25}
              />
            );
          })}

          {/* CAPTCHA Section */}
          {/* <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Enter CAPTCHA Code *
            </label>
            <div className="flex flex-col md:flex-row items-start gap-4 bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex-1">
                <div className="relative">
                  <input
                    name="captcha_code"
                    value={formData.captcha_code}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border ${errors.captcha_code ? "border-red-500 shake-animation" : "border-gray-600"} rounded-lg text-white focus:outline-none focus:ring-2 ${errors.captcha_code ? "focus:ring-red-500" : "focus:ring-blue-500"} transition-all font-mono tracking-widest`}
                    required
                    style={{ letterSpacing: "0.2em" }}
                    placeholder="Enter code shown"
                  />
                </div>
                {errors.captcha_code && <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.captcha_code}</p>}
              </div>
              
              <div className="flex items-center justify-between bg-black/40 p-0 rounded-lg border border-gray-600 w-full md:w-auto">
                <div className="flex items-center">
                  <span className="text-xl font-bold tracking-widest text-white select-none bg-gradient-to-r from-gray-800 to-gray-900 p-2 rounded-md border border-gray-600">
                    {captcha}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  className="ml-3 p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition hover:rotate-180 duration-500"
                  title="Refresh CAPTCHA"
                >
                  <RefreshCw size={18} className="text-white" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">Type the characters shown in the image above</p>
          </div> */}

          {/* Submit */}
          <div
            className="md:col-span-2 animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg transition-all shadow-lg transform ${
                isSubmitting ? "scale-95" : "hover:scale-[1.02]"
              } hover:shadow-xl disabled:opacity-70 flex items-center justify-center font-semibold`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-300 mt-6 animate-fade-in">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-white hover:underline transition-colors font-medium"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate3d(0, -20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .shake-animation {
          animation: shake 0.5s;
        }
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite;
        }
        select {
          color-scheme: dark;
        }
        select option {
          background: #374151;
          color: #D1D5DB;
          padding: 10px;
        }
        select option:checked {
          background: #4B5563;
          color: white;
        }
        select:focus option:checked {
          background: #1E40AF;
          color: white;
        }
      `}</style>
    </div>
  );
}

// Input field with inline error display
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  className = "",
  animationDelay = 0,
}) => (
  <div
    className={`${className} w-full relative animate-fade-in-up`}
    style={{ animationDelay: `${animationDelay}s` }}
  >
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}{" "}
      {required && name !== "sponser_id" && name !== "sponser_name" && "*"}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-gray-700 border ${
        error ? "border-red-500 shake-animation" : "border-gray-600"
      } rounded-lg text-white focus:outline-none focus:ring-2 ${
        error ? "focus:ring-red-500" : "focus:ring-blue-500"
      } transition-all`}
      required={
        name === "sponser_id" || name === "sponser_name" ? false : required
      }
    />
    {error && (
      <p className="text-red-400 text-xs mt-1 animate-fade-in">{error}</p>
    )}
  </div>
);

export default Register;
