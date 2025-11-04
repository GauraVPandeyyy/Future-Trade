// components/UniversalLoader.jsx
import { motion } from 'framer-motion';

const UniversalLoader = () => {
  return (
    <div className="fixed inset-0 min-h-screen min-w-screen flex items-center justify-center bg-black/65 bg-opacity-90 z-50">
      <div className="flex flex-col items-center">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="mt-4 text-blue-900 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.div>
        <div className="flex mt-2">
          <motion.div
            className="w-2 h-2 bg-black rounded-full mx-1"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-blue-600 rounded-full mx-1"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-yellow-500 rounded-full mx-1"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default UniversalLoader;