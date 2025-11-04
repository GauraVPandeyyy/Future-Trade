// components/PageWrapper.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UniversalLoader from './UniversalLoader';

const PageWrapper = ({ children, pageTitle = "" }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate API call

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | Trading Platform`;
    }
  }, [pageTitle]);

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    duration: 0.3
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <UniversalLoader />}
      </AnimatePresence>
      
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen bg-white"
      >
        {!isLoading && children}
      </motion.div>
    </>
  );
};

export default PageWrapper;