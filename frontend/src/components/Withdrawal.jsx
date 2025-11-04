// src/pages/Withdrawal.jsx
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, ArrowLeft, Wallet, CreditCard, Lock } from 'lucide-react';

// Motion variants (premium, consistent)
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
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  }
};

// Utils
const capFirst = (str = '') => {
  const s = String(str).toLowerCase().trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
};

// Format helpers
const formatINRInt = (n) => {
  const v = Number.isFinite(+n) ? Math.trunc(+n) : 0;
  return v.toLocaleString('en-IN');
};
const formatINRDecimal = (n) => {
  const v = Number.isFinite(+n) ? +n : 0;
  return v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Withdrawal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount = 0, totalBal = 0, withdrawalType = '' } = location.state || {};

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState(Number(amount).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  // Derived
  const typeLabel = useMemo(() => capFirst(withdrawalType), [withdrawalType]);
  const icon =
    withdrawalType?.toLowerCase() === 'roi' ? (
      <CreditCard size={24} className="text-yellow-400" />
    ) : (
      <Wallet size={24} className="text-yellow-400" />
    );

  const handleBack = () => navigate(-1);

  // Amount input
  const onAmountChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setWithdrawalAmount(val);
      setFieldError('');
    }
  };

  const validate = () => {
    if (!withdrawalAmount || withdrawalAmount === '.' || Number.isNaN(+withdrawalAmount)) {
      setFieldError('Please enter a valid amount.');
      return false;
    }
    const amt = parseFloat(withdrawalAmount);
    if (amt <= 0) {
      setFieldError('Amount must be greater than 0.');
      return false;
    }
    if (amt > Number(amount)) {
      setFieldError('Amount exceeds maximum withdrawal.');
      return false;
    }
    if (!password || password.trim().length < 4) {
      setFieldError('Enter a valid security password.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Withdrawal request submitted successfully!');
    }, 1500);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white px-4 md:px-7 py-6 md:py-8"
    >
      <motion.section
        variants={cardVariants}
        className="
          mx-auto max-w-3xl rounded-2xl overflow-hidden
          shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          bg-gradient-to-br from-gray-800 to-gray-900
          border border-gray-700
        "
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-t from-gray-700 to-gray-800 text-white">
          <button
            onClick={handleBack}
            className="flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>

          <div className="flex items-center w-full text-center justify-center">
            <div className="p-2 bg-white/10 rounded-full mr-3">{icon}</div>
            <h1 className="text-2xl font-bold">{typeLabel} Withdrawal</h1>
          </div>
        </div>

        {/* Balance */}
        <motion.div variants={itemVariants} className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Available Balance:</span>
            <span className="text-2xl font-bold text-white">
              ₹{formatINRDecimal(totalBal)}
            </span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants} className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {typeLabel} Amount
                </label>
                <div className="relative">
                  <input
                    inputMode="decimal"
                    type="text"
                    value={withdrawalAmount}
                    onChange={onAmountChange}
                    className="
                      w-full pl-4 pr-12 py-3 rounded-xl
                      bg-gray-800/70 border-2 border-gray-700
                      text-white placeholder:text-gray-400
                      focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500
                      transition-all
                    "
                    placeholder="Enter amount (decimals allowed)"
                    aria-invalid={!!fieldError}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">₹</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Maximum withdrawal: ₹{formatINRInt(amount)}
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full pl-10 pr-12 py-3 rounded-xl
                      bg-gray-800/70 border-2 border-gray-700
                      text-white placeholder:text-gray-400
                      focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500
                      transition-all
                    "
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400 hover:text-gray-300 transition-colors" />
                    ) : (
                      <Eye size={18} className="text-gray-400 hover:text-gray-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {fieldError && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-red-400"
                >
                  {fieldError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Security note */}
            {/* <div className="bg-gray-800/70 p-4 rounded-xl border border-gray-700">
              <div className="flex items-start">
                <Shield size={18} className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  For security reasons, withdrawal requests are processed within 24–48 hours.
                </p>
              </div>
            </div> */}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full py-3 rounded-xl font-semibold
                text-white
                bg-gradient-to-r from-gray-700 to-gray-700/90
                shadow-lg hover:shadow-xl
                transition-all
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center
              "
              whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              <AnimatePresence mode="popLayout">
                {isSubmitting ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </motion.span>
                ) : (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Withdrawal Request
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
