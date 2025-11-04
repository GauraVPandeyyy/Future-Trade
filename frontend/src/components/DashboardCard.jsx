import { motion } from 'framer-motion';

const DashboardCard = ({ 
  icon: Icon, 
  label, 
  value, 
  colorClass = "text-blue-600", 
  trend, 
  delay = 0,
  isLoading = false
}) => {
  // Define color mappings based on your brand
  const colorMap = {
    "text-blue-600": {
      border: "border-blue-500",
      gradient: "from-blue-400 to-blue-600",
      light: "bg-blue-50",
      iconBg: "bg-blue-100"
    },
    "text-green-600": {
      border: "border-green-500",
      gradient: "from-green-400 to-green-600",
      light: "bg-green-50",
      iconBg: "bg-green-100"
    },
    "text-purple-600": {
      border: "border-purple-500",
      gradient: "from-purple-400 to-purple-600",
      light: "bg-purple-50",
      iconBg: "bg-purple-100"
    },
    "text-orange-600": {
      border: "border-orange-500",
      gradient: "from-orange-400 to-orange-600",
      light: "bg-orange-50",
      iconBg: "bg-orange-100"
    },
    "text-yellow-600": {
      border: "border-yellow-500",
      gradient: "from-yellow-400 to-yellow-600",
      light: "bg-yellow-50",
      iconBg: "bg-yellow-100"
    },
    "text-indigo-600": {
      border: "border-indigo-500",
      gradient: "from-indigo-400 to-indigo-600",
      light: "bg-indigo-50",
      iconBg: "bg-indigo-100"
    },
    "text-pink-600": {
      border: "border-pink-500",
      gradient: "from-pink-400 to-pink-600",
      light: "bg-pink-50",
      iconBg: "bg-pink-100"
    }
  };

  const currentColor = colorMap[colorClass] || colorMap["text-blue-600"];

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: delay
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    }
  };

  const iconVariants = {
    hidden: { 
      opacity: 0, 
      rotate: -45,
      scale: 0.5
    },
    visible: { 
      opacity: 1, 
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200,
        delay: delay + 0.2
      }
    },
    hover: {
      rotate: 12,
      scale: 1.1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 300
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: delay + 0.1,
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        relative h-auto border-t-3 rounded-xl p-5 overflow-hidden
        bg-white ${currentColor.border}
        shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)]
        transition-shadow duration-1000
        cursor-pointer
        group
      `}
    >
      {/* Premium SVG background with animation */}
      <motion.div 
        className="absolute inset-0 opacity-[0.1] group-hover:opacity-[0.2] transition-opacity duration-700"
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 2 }}
        transition={{ duration: 10 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 256 256" preserveAspectRatio="none">
          <defs>
            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#888" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
        </svg>
      </motion.div>

      {/* Floating gradient accent with animation */}
      <motion.div 
        className={`
          absolute -top-20 -right-20 w-40 h-40 rounded-xl blur-xl opacity-15
          bg-gradient-to-br ${currentColor.gradient}
        `}
        animate={{
          x: [0, -5, 0],
          y: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          opacity: 0.25,
          scale: 1.1
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start">
          <motion.div variants={contentVariants}>
            <p className="text-xs font-medium text-gray-500 mb-1 tracking-widest uppercase">{label}</p>
            {isLoading ? (
              <div className="h-7 w-24 bg-gray-200 animate-pulse rounded-md"></div>
            ) : (
              <p className="text-xl font-semibold text-gray-800">{value}</p>
            )}
          </motion.div>

          {/* Icon with enhanced animation */}
          <motion.div 
            variants={iconVariants}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${currentColor.iconBg} backdrop-blur-sm
              border border-gray-100
              ${colorClass}
            `}
          >
            {isLoading ? (
              <div className="h-5 w-5 bg-current opacity-30 animate-pulse rounded"></div>
            ) : (
              <Icon size={20} className="opacity-90" />
            )}
          </motion.div>
        </div>

        {/* {trend && !isLoading && (
          <motion.div 
            className={`mt-3 text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </motion.div>
        )} */}
      </div>

      {/* Interactive border animation */}
      <motion.div 
        className={`
          absolute inset-0 rounded-xl pointer-events-none
          border-2 border-transparent
        `}
        whileHover={{ 
          borderColor: "rgba(255,255,255,0.4)",
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
        whileHover={{ 
          opacity: 1,
          x: ["-100%", "100%"],
        }}
        transition={{ 
          x: { duration: 0.8, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
      />
    </motion.div>
  );
};

export default DashboardCard;