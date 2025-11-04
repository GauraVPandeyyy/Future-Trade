import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import bell from "../assets/bell.gif";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import { useAuthContext } from "../context/AuthContext";
import { getUser } from "../services/apiService";
import { toast } from "react-toastify";

const Header = ({ onMenuClick, isMobile }) => {
  const { logout, user } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    photo: "",
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.user_id) {
        try {
          const data = await getUser(user.user_id);
          setUserData(data.data);
        } catch (error) {
          console.error("Error fetching User data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    // logout();
    const res = await fetch("http://localhost:3000/api/auth/logout");
    toast.info("You have been logged out.");
    navigate("/login");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.header
      className="bg-white backdrop-blur-xl rounded-b-xl border-gray-400 px-6 py-4 sticky inset-x-0 shadow-lg z-[999]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-6">
          {isMobile && (
            <motion.button
              onClick={onMenuClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={20} />
            </motion.button>
          )}
          {!isMobile && (
            <motion.div className="flex items-center" variants={itemVariants}>
              <motion.img
                src="https://metafutureservices.com/assets/newlogo-pZQDBaKP.jpg"
                className="w-10 mr-1"
                alt="Logo"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <h1 className="font-bold bg-gradient-to-r from-blue-900 to-gray-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </motion.div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src={bell}
              width="45"
              alt="Notifications"
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Join Product Button */}
          <motion.div className="relative">
            <motion.button
              onClick={() => setShowAddProduct(true)}
              className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-sm text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 group overflow-hidden shadow-lg"
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Join Product</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full"
                whileHover={{
                  translateX: "100%",
                  transition: { duration: 0.8 },
                }}
              />
            </motion.button>

            <AddProduct
              open={showAddProduct}
              onClose={() => setShowAddProduct(false)}
              walletBalance={user.wallet || 0}
            />
          </motion.div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 text-xs bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-3 py-2 rounded-xl hover:from-blue-800 hover:to-indigo-800 transition-all duration-300 group shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20"
                whileHover={{ rotate: 5 }}
              >
                <img
                  src={
                    userData.photo ||
                    "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png";
                  }}
                />
              </motion.div>
              {!isMobile && (
                <motion.span
                  className="font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {userData.name}
                </motion.span>
              )}
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50 overflow-hidden"
                >
                  <motion.div
                    className="px-4 py-3 border-b border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      Future Trade
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {userData.name}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <NavLink
                      to="profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User
                        size={16}
                        className="text-gray-400 group-hover:text-blue-600"
                      />
                      <span>Profile</span>
                    </NavLink>
                    <NavLink
                      to="change-password"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings
                        size={16}
                        className="text-gray-400 group-hover:text-blue-600"
                      />
                      <span>Change Password</span>
                    </NavLink>
                  </motion.div>

                  <hr className="my-2 border-gray-100" />

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group w-full text-left"
                      whileHover={{ x: 2 }}
                    >
                      <LogOut
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
