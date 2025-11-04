import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import roiAnimation from '../animations/ROI.json';
import depositAnimation from '../animations/deposit.json';
import investmentAnimation from '../animations/investment.json';
import cashbackAnimation from '../animations/cashback.json';
import salaryAnimation from '../animations/salary.json';
import bonusAnimation from '../animations/bonus.json';
import { useAuthContext } from '../context/AuthContext';
import { getWalletData } from '../services/apiService';
import { useNavigate, NavLink } from 'react-router-dom';
import UniversalLoader from '../components/UniversalLoader';

function Wallet() {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    wallet: 0,
    Roi: 0,
    Capital: 0,
    Deposite: 0,
    salary: 0,
    cashback: 0,
    bonus: 0,
    capital_reinvest_status: 0,
    roi_reinvest_status: 0,
    capital_withdrawal_status: 0,
    roi_withdrawal_status: 0,
  });

  const { user } = useAuthContext();
  const navigate = useNavigate();

  // ✅ Dummy fallback data
  const dummyWalletData = {
    data: {
      wallet: 250000,
      Roi: 35000,
      Capital: 120000,
      Deposite: 50000,
      salary: 15000,
      cashback: 2500,
      bonus: 8000,
      capital_reinvest_status: 1,
      roi_reinvest_status: 1,
      capital_withdrawal_status: 1,
      roi_withdrawal_status: 1,
    },
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        if (user?.user_id) {
          const data = await getWalletData(user.user_id);
          console.log('Wallet API data:', data);

          if (data?.data) {
            setWalletData(data.data);
          } else {
            console.warn('Empty wallet API response — using dummy fallback.');
            setWalletData(dummyWalletData.data);
          }
        } else {
          console.warn('No user found — using dummy data.');
          setWalletData(dummyWalletData.data);
        }
      } catch (error) {
        console.error('Error fetching Wallet data, using dummy data:', error);
        setWalletData(dummyWalletData.data);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user]);

  // 💰 Currency formatting helper
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  // 🧭 Navigation handlers
  const handleWithdraw = (amount, type) => {
    navigate('/withdrawal', {
      state: { amount, totalBal: walletData.wallet, withdrawalType: type },
    });
  };

  const handleReInvest = (amount, type) => {
    navigate('/reInvest', {
      state: { amount, totalBal: walletData.wallet, reInvestType: type },
    });
  };

  // 🧠 Derived flags
  const canWithdrawCapital =
    Number(walletData.Capital) >= 1 && Number(walletData.capital_withdrawal_status) === 1;
  const canWithdrawRoi =
    Number(walletData.Roi) >= 1 && Number(walletData.roi_withdrawal_status) === 1;
  const canReinvestCapital =
    Number(walletData.Capital) >= 1 && Number(walletData.capital_reinvest_status) === 1;
  const canReinvestRoi =
    Number(walletData.Roi) >= 1 && Number(walletData.roi_reinvest_status) === 1;
  const canWithdrawSalary = Number(walletData.salary) >= 1;
  const canWithdrawCashBack = Number(walletData.cashback) >= 1;
  const canWithdrawBonus = Number(walletData.bonus) >= 1;

  const safeWithdraw = (canDo, amount, type) => {
    if (!canDo) return;
    handleWithdraw(amount, type);
  };
  const safeReinvest = (canDo, amount, type) => {
    if (!canDo) return;
    handleReInvest(amount, type);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 15, stiffness: 300 },
    },
    hover: { y: -5, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  };

  return (
    <main className="flex-1 py-6 px-0 sm:px-6 lg:px-8 space-y-8">
      <AnimatePresence>{loading && <UniversalLoader />}</AnimatePresence>

      {/* Total Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
          <div>
            <h2 className="text-lg font-medium text-gray-300">Total Balance</h2>
            {loading ? (
              <div className="h-10 w-40 bg-gray-700 animate-pulse rounded mt-2"></div>
            ) : (
              <motion.h1
                className="text-green-400 font-bold text-3xl sm:text-4xl mt-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {formatCurrency(walletData.wallet)}
              </motion.h1>
            )}
          </div>
        </div>
      </motion.div>

      {/* Wallet Cards */}
      {!loading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* ROI & Capital Card */}
          <motion.div variants={cardVariants} className="bg-gray-800 text-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Capital</p>
                <p className="text-white font-semibold text-lg">{formatCurrency(walletData.Capital)}</p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">ROI</p>
                <p className="text-green-400 font-semibold text-lg">{formatCurrency(walletData.Roi)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: canWithdrawCapital ? 1.05 : 1 }}
                whileTap={{ scale: canWithdrawCapital ? 0.95 : 1 }}
                disabled={!canWithdrawCapital}
                onClick={() => safeWithdraw(canWithdrawCapital, walletData.Capital, 'capital')}
                className={`mt-4 w-full py-2 px-4 rounded-md font-medium shadow-md transition-colors duration-200 ${
                  canWithdrawCapital ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-500/50 cursor-not-allowed text-gray-300'
                }`}
              >
                Withdraw Capital
              </motion.button>
              <motion.button
                whileHover={{ scale: canWithdrawRoi ? 1.05 : 1 }}
                whileTap={{ scale: canWithdrawRoi ? 0.95 : 1 }}
                disabled={!canWithdrawRoi}
                onClick={() => safeWithdraw(canWithdrawRoi, walletData.Roi, 'roi')}
                className={`mt-4 w-full py-2 px-4 rounded-md font-medium shadow-md transition-colors duration-200 ${
                  canWithdrawRoi ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-500/50 cursor-not-allowed text-gray-300'
                }`}
              >
                Withdraw ROI
              </motion.button>
            </div>
          </motion.div>

          {/* Deposit & Salary Card */}
          <motion.div variants={cardVariants} className="bg-gray-800 text-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Deposit</p>
                <p className="text-white font-semibold text-lg">{formatCurrency(walletData.Deposite)}</p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Salary</p>
                <p className="text-green-400 font-semibold text-lg">{formatCurrency(walletData.salary)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md font-medium shadow-md"
              >
                + Add Cash
              </motion.button>
              <motion.button
                whileHover={{ scale: canWithdrawSalary ? 1.05 : 1 }}
                whileTap={{ scale: canWithdrawSalary ? 0.95 : 1 }}
                disabled={!canWithdrawSalary}
                onClick={() => safeWithdraw(canWithdrawSalary, walletData.salary, 'salary')}
                className={`mt-4 w-full py-2 px-4 rounded-md font-medium shadow-md transition-colors duration-200 ${
                  canWithdrawSalary ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-500/50 cursor-not-allowed text-gray-300'
                }`}
              >
                Withdraw Salary
              </motion.button>
            </div>
          </motion.div>

          {/* Cashback & Bonus Card */}
          <motion.div variants={cardVariants} className="bg-gray-800 text-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Cashback</p>
                <p className="text-white font-semibold text-lg">{formatCurrency(walletData.cashback)}</p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Bonus</p>
                <p className="text-green-400 font-semibold text-lg">{formatCurrency(walletData.bonus)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: canWithdrawCashBack ? 1.05 : 1 }}
                whileTap={{ scale: canWithdrawCashBack ? 0.95 : 1 }}
                disabled={!canWithdrawCashBack}
                onClick={() => safeWithdraw(canWithdrawCashBack, walletData.cashback, 'cashback')}
                className={`mt-4 w-full py-2 px-4 rounded-md font-medium shadow-md transition-colors duration-200 ${
                  canWithdrawCashBack ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-500/50 cursor-not-allowed text-gray-300'
                }`}
              >
                Withdraw Cashback
              </motion.button>
              <motion.button
                whileHover={{ scale: canWithdrawBonus ? 1.05 : 1 }}
                whileTap={{ scale: canWithdrawBonus ? 0.95 : 1 }}
                disabled={!canWithdrawBonus}
                onClick={() => safeWithdraw(canWithdrawBonus, walletData.bonus, 'bonus')}
                className={`mt-4 w-full py-2 px-4 rounded-md font-medium shadow-md transition-colors duration-200 ${
                  canWithdrawBonus ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-500/50 cursor-not-allowed text-gray-300'
                }`}
              >
                Withdraw Bonus
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <NavLink to="/transaction-history">
          <motion.div
            whileHover={{ y: -2 }}
            className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 cursor-pointer hover:bg-gray-800/90 transition-colors duration-200"
          >
            <h2 className="text-lg font-semibold text-gray-100">Transaction History</h2>
            <div className="text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        </NavLink>
      </motion.div>
    </main>
  );
}

export default Wallet;
