// src/pages/TransactionHistory.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UniversalLoader from '../components/UniversalLoader';
import { useAuthContext } from '../context/AuthContext';
import { getTransaction } from '../services/apiService';

// Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  }
};

const fadeSlide = (dir = 1) => ({
  hidden: { opacity: 0, x: 20 * dir },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  },
  exit: { opacity: 0, x: -20 * dir, transition: { duration: 0.2 } }
});

const tabs = ['Deposits', 'Withdrawals', 'Investments'];
const tabKeyMap = {
  Deposits: 'Deposite',
  Withdrawals: 'withdrawals',
  Investments: 'investments'
};

export default function TransactionHistory() {
  const { user } = useAuthContext();
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Deposits');
  const [prevIndex, setPrevIndex] = useState(0);

  const activeIndex = useMemo(() => tabs.indexOf(activeTab), [activeTab]);

  useEffect(() => {
    let mounted = true;
    const fetchHistoryData = async () => {
      if (user?.user_id) {
        try {
          if (mounted) setLoading(true);
          const data = await getTransaction(user.user_id);
          if (mounted) setHistoryData(data.data);
        } catch (error) {
          console.error('Error fetching getTransaction data:', error);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    };

    fetchHistoryData();
    const interval = setInterval(fetchHistoryData, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const onTabClick = (tab) => {
    setPrevIndex(activeIndex);
    setActiveTab(tab);
  };

  const dir = activeIndex >= prevIndex ? 1 : -1;
  const rows = historyData?.[tabKeyMap[activeTab]] || [];

  const renderDesktopTable = (rows) => (

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="hidden md:block mt-4"
    >
      <div className="overflow-x-auto overscroll-contain">
        <table className="min-w-max w-full rounded-xl overflow-hidden table-auto">
          <thead className="bg-gray-50">
            <tr className="text-gray-600">
              {Object.keys(rows[0]).map((key) => (
                <th key={key} className="px-4 py-3 text-left text-sm font-semibold border-b whitespace-nowrap">
                  {key.replace(/_/g, ' ').toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row, i) => (
              <motion.tr
                key={i}
                variants={rowVariants}
                className="hover:bg-gray-50 transition-colors"
              >
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                    {val === null ? '-' : String(val)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderMobileCards = (rows) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden mt-4"
    >
      {rows.map((row, i) => (
        <motion.div
          key={i}
          variants={rowVariants}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition"
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {Object.entries(row).map(([key, value], j) => (
            <p key={j} className="text-sm text-gray-700 mb-1">
              <span className="font-semibold text-gray-900">{key.replace(/_/g, ' ')}:</span>{' '}
              {value === null ? '-' : String(value)}
            </p>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>{loading && !historyData && <UniversalLoader />}</AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 md:px-7 py-6 md:py-8 space-y-6">
        {/* Header */}
        <motion.section
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-6 rounded-2xl shadow-lg border border-gray-100 bg-white"
        >
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Track deposits, withdrawals, and investments in real-time.
          </p>
        </motion.section>

        {/* Tabs */}
        <motion.section variants={cardVariants} initial="hidden" animate="visible" className="bg-white">
          <div className="relative">
            <div className="flex space-x-2 border-b border-gray-200">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => onTabClick(tab)}
                    className={`relative px-4 py-2 font-medium transition text-sm md:text-base rounded-t-lg ${isActive
                        ? 'text-blue-700'
                        : 'text-gray-500 hover:text-gray-800'
                      }`}
                  >
                    {tab}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-blue-600"
                        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Transactions */}
        <motion.section
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-6 rounded-2xl shadow-lg border border-gray-100 bg-white overflow-scroll"
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading && !historyData ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Skeletons preserve layout for both desktop and mobile */}
                <div className="hidden md:block mt-4">
                  <div className="w-full rounded-xl overflow-hidden">
                    <div className="h-10 bg-gray-50 border-b" />
                    <div className="space-y-2 py-4 animate-pulse">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-9 bg-gray-100 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden mt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse h-24" />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                variants={fadeSlide(dir)}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {(!rows || rows.length === 0) ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-lg">No {activeTab} transactions yet</p>
                  </div>
                ) : (
                  <>
                    {renderDesktopTable(rows)}
                    {renderMobileCards(rows)}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
}
