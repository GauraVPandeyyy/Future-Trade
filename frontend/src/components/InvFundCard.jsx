import React from 'react';
import { motion } from 'framer-motion';
// import Lottie from 'lottie-react';
// import BonusAnime from '../animations/salary.json';

function InvFundCard({ icon: Icon, productName, invested, capital, ROI, joinDate, endDate, planType, plan, delay = 800, isLoading = false }) {

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.5
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
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200,
        delay: delay + 0.2
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
        shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_16px_rgba(0,0,0,0.18)]
        transition-all duration-300 ease-out
        cursor-pointer
        group
      `}
    >
      <div className='w-full relative bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700'>
        {/* Badge with animation */}
        {!isLoading && (
          <motion.div 
            variants={badgeVariants}
            className={`absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full text-sm ${
              planType.toLowerCase() === "lifetime" ? 'bg-gradient-to-r from-green-400 to-green-500' : ''
            }`}
          >
            {planType.toLowerCase() !== "lifetime" ? plan : "Lifetime"}
          </motion.div>
        )}

        {/* Header */}
        <div className='flex items-center justify-center mb-4'>
          {Icon && (
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className='w-8 h-8 text-yellow-400 mr-3' />
              {/* <div className="w-16 h-16 -mt-2 -mr-2">
                <Lottie
                  animationData={BonusAnime}
                  loop={true}
                  autoplay={true}
                />
              </div> */}
            </motion.div>
          )}
          {isLoading ? (
            <div className="h-7 w-40 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <h2 className='text-[16px] font-bold text-white'>{productName} <span className='text-lg font-light'>(₹{invested})</span> </h2>
          )}
        </div>

        {/* Main metrics */}
        <div className='grid grid-cols-2 gap-4 mb-5'>
          <div className='bg-gray-700/50 p-3 rounded-lg'>
            <p className='text-gray-400 text-sm'>Capital</p>
            {isLoading ? (
              <div className="h-6 w-20 bg-gray-600 animate-pulse rounded mt-1"></div>
            ) : (
              <p className='text-white font-semibold text-lg'>₹{capital.toLocaleString()}</p>
            )}
          </div>
          <div className='bg-gray-700/50 p-3 rounded-lg'>
            <p className='text-gray-400 text-sm'>ROI</p>
            {isLoading ? (
              <div className="h-6 w-20 bg-gray-600 animate-pulse rounded mt-1"></div>
            ) : (
              <p className='text-green-400 font-semibold text-lg'>₹{ROI.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className='bg-gray-800/70 p-2 rounded-lg'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-gray-400 text-xs'>Join Date</span>
            {isLoading ? (
              <div className="h-4 w-16 bg-gray-600 animate-pulse rounded"></div>
            ) : (
              <span className='text-white text-sm font-medium'>{joinDate}</span>
            )}
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-400 text-xs'>End Date</span>
            {isLoading ? (
              <div className="h-4 w-16 bg-gray-600 animate-pulse rounded"></div>
            ) : (
              <span className='text-white text-sm font-medium'>{endDate}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InvFundCard;