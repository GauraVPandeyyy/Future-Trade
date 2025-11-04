import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Motion variants (consistent spring + stagger)
const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const card = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 300 } }
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } }
};

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white flex items-center justify-center px-4 md:px-7 py-10"
    >
      <motion.section variants={card} className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 text-center">
        <motion.div variants={item} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg mb-4">
          <span className="text-2xl font-bold">404</span>
        </motion.div>

        <motion.h1 variants={item} className="text-3xl font-bold text-gray-900">
          Page not found
        </motion.h1>
        <motion.p variants={item} className="text-gray-600 mt-2">
          The requested page doesn’t exist or may have moved. Try going back or head to the dashboard.
        </motion.p>

        <motion.div variants={item} className="mt-6 flex gap-3 justify-center">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-800 hover:bg-gray-50"
          >
            Go back
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-700 to-blue-500"
          >
            Go home
          </motion.button>
        </motion.div>
      </motion.section>
    </motion.main>
  );
}
