// components/AnimatedCard.jsx
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = "", 
  delay = 0, 
  bgColor = "white" 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  const backgroundStyles = {
    blue: "bg-blue-900 text-white",
    black: "bg-gray-900 text-white",
    golden: "bg-yellow-600 text-white",
    white: "bg-white text-gray-900"
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-lg shadow-lg p-6 ${backgroundStyles[bgColor]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;