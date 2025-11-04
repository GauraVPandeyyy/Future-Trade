// src/pages/account/BankDetails.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../../context/AuthContext';
import { bankDetails, getUser } from '../../services/apiService';
import { toast } from 'react-toastify';
import {
  User, CreditCard, Banknote, MapPin, Landmark, Pencil, Lock, Loader2, CheckCircle2, XCircle
} from 'lucide-react';

// Motion variants (brand-consistent)
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
  hidden: { opacity: 0, y: 20, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  }
};

// Icons map
const fieldIcons = {
  account_holder: <User className="w-4 h-4 text-gray-400" />,
  account_number: <CreditCard className="w-4 h-4 text-gray-400" />,
  bank_name: <Banknote className="w-4 h-4 text-gray-400" />,
  branch: <MapPin className="w-4 h-4 text-gray-400" />,
  ifsc_code: <Landmark className="w-4 h-4 text-gray-400" />
};

// Reusable input with animated error
const InputBox = ({ label, name, value, isDisabled, onChange, error, icon }) => (
  <motion.div variants={itemVariants} className="w-full">
    <label htmlFor={name} className="block text-gray-800 font-semibold text-sm mb-1">
      {label}
    </label>
    <div
      className={[
        'flex items-center gap-2 rounded-xl border px-3 py-2 bg-gray-50',
        isDisabled ? 'opacity-60' : 'opacity-100',
        error
          ? 'border-red-500 ring-2 ring-red-200'
          : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-300'
      ].join(' ')}
    >
      {icon}
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        className={[
          'w-full bg-transparent outline-none border-none text-gray-800 placeholder:text-gray-400',
          isDisabled ? 'cursor-not-allowed text-gray-500' : 'focus:text-gray-900'
        ].join(' ')}
        autoComplete="off"
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-xs text-red-600 ml-0.5 mt-1 flex items-center gap-1"
        >
          <XCircle className="w-3.5 h-3.5" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

// Animated spinner
const Spinner = ({ className = 'w-5 h-5 text-white' }) => (
  <Loader2 className={`animate-spin ${className}`} />
);

export default function BankDetails() {
  const { user } = useAuthContext();

  const [isDisabled, setIsDisabled] = useState(true);
  const [form, setForm] = useState({
    user_id: '',
    bank_name: '',
    branch: '',
    account_number: '',
    account_holder: '',
    ifsc_code: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fields config
  const fields = useMemo(
    () => [
      { label: 'Account Holder Name', name: 'account_holder' },
      { label: 'Account Number', name: 'account_number' },
      { label: 'Bank Name', name: 'bank_name' },
      { label: 'Branch Name', name: 'branch' },
      { label: 'IFSC Code', name: 'ifsc_code' }
    ],
    []
  );

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = await getUser(user.user_id);
        const d = userData?.data || {};
        setForm({
          user_id: d.user_id || '',
          bank_name: d.bank_name || '',
          branch: d.branch || '',
          account_number: d.account_number || '',
          account_holder: d.account_holder || '',
          ifsc_code: d.ifsc_code || ''
        });
      } catch {
        toast.error('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };
    if (user?.user_id) fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    if (isDisabled) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.account_holder) newErrors.account_holder = 'Account holder name is required.';
    if (!form.account_number) newErrors.account_number = 'Account number is required.';
    if (!form.bank_name) newErrors.bank_name = 'Bank name is required.';
    if (!form.branch) newErrors.branch = 'Branch name is required.';
    if (!form.ifsc_code) newErrors.ifsc_code = 'IFSC code is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (isDisabled) {
      toast.error("Please click 'Edit' first to modify.");
      return;
    }
    if (!validate()) {
      toast.error('All fields are mandatory.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await bankDetails(form);
      if (res?.status) {
        toast.success(res?.message || 'Bank details updated successfully!');
        setIsDisabled(true);
      } else {
        toast.error(res?.message || 'Update failed.');
      }
    } catch (error) {
      toast.error(error?.message || 'API Error: Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-4 md:px-7 py-6 md:py-8"
    >
      {/* Header card */}
      <motion.section variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-6 md:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Banknote className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
          </div>
          <span
            className={[
              'flex items-center gap-1 px-3 py-1 text-sm rounded-full',
              isDisabled ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-800'
            ].join(' ')}
          >
            {isDisabled ? (
              <>
                <Lock className="w-4 h-4" /> Locked
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4" /> Editing
              </>
            )}
          </span>
        </div>
      </motion.section>

      {/* Form card */}
      <motion.section variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-6 md:p-7">
        <AnimatePresence initial={false} mode="popLayout">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-40"
            >
              <Spinner className="w-8 h-8 text-blue-600" />
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={SubmitHandler}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {fields.map((field) => (
                  <InputBox
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    isDisabled={isDisabled}
                    onChange={handleChange}
                    error={errors[field.name]}
                    icon={fieldIcons[field.name]}
                  />
                ))}
              </motion.div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={() => setIsDisabled(false)}
                  disabled={!isDisabled || loading}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={[
                    'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow',
                    isDisabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
                    !isDisabled ? 'cursor-not-allowed' : ''
                  ].join(' ')}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={submitting || isDisabled}
                  whileHover={!submitting && !isDisabled ? { y: -2, scale: 1.01 } : {}}
                  whileTap={!submitting && !isDisabled ? { scale: 0.97 } : {}}
                  className={[
                    'inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow',
                    'text-white',
                    submitting || isDisabled ? 'bg-gray-400' : 'bg-amber-600 hover:bg-amber-500'
                  ].join(' ')}
                >
                  {submitting ? <Spinner /> : <CheckCircle2 className="w-5 h-5" />}
                  {submitting ? 'Saving' : 'Save'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.section>
    </motion.div>
  );
}
