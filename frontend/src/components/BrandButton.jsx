// components/BrandButton.jsx
import { motion } from 'framer-motion';

const BrandButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false,
  className = "",
  type = "button"
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500",
    golden: "bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-400",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default BrandButton;