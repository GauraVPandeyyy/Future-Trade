// src/pages/Kyc.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, FileText, Shield, CheckCircle2 } from 'lucide-react';
import { submitKyc } from '../services/apiService';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import UniversalLoader from '../components/UniversalLoader';

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
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  }
};

// Reusable Image Uploader with animation and a11y
const ImageUploader = ({ title, name, uploadedImage, setUploadedImage, error, delay = 0 }) => {
  const inputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setUploadedImage({ preview: URL.createObjectURL(file), file });
    }
  };

  const handleRemoveImage = () => {
    if (uploadedImage?.preview) URL.revokeObjectURL(uploadedImage.preview);
    setUploadedImage(null);
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className="w-full"
    >
      <label className="block text-sm font-medium text-gray-400 mb-2">{title}</label>

      <AnimatePresence initial={false} mode="popLayout">
        {uploadedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative group w-full h-44 rounded-xl overflow-hidden border-2 border-gray-100 shadow-lg"
          >
            <img src={uploadedImage.preview} alt={`${name} preview`} className="w-full h-full object-cover" />
            <motion.button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Remove ${name}`}
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="dropzone"
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-44 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-white-500 hover:border-gray-500 hover:text-white-600 transition-colors bg-gray-50/50"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Upload ${name}`}
          >
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <UploadCloud size={32} className="mb-2" />
            </motion.div>
            <p className="text-sm font-semibold">Click to upload</p>
            <p className="text-xs mt-1">Max 2MB</p>
          </motion.button>
        )}
      </AnimatePresence>

      <input
        id={name}
        type="file"
        ref={inputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
        aria-describedby={`${name}-help ${name}-error`}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${name}-error`}
            className="text-red-500 text-xs mt-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function Kyc() {
  const [aadhar_card, setAadharCard] = useState('');
  const [panNum, setPanNum] = useState('');
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    return () => {
      [aadharFront, aadharBack, panImage].forEach((image) => {
        if (image?.preview) URL.revokeObjectURL(image.preview);
      });
    };
  }, [aadharFront, aadharBack, panImage]);

  const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar.replace(/\s/g, ''));
  const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'));
      if (!file.type.startsWith('image/')) return reject(new Error('File must be an image'));
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string' && result.startsWith('data:image/')) resolve(result);
        else reject(new Error('Failed to convert file to proper base64 format'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const newErrors = {};
    if (!aadhar_card) newErrors.adhar_card = 'Aadhaar number is required';
    if (!panNum) newErrors.pancard = 'PAN number is required';
    if (!aadharFront?.file) newErrors.aadharFront = 'Aadhaar front image is required';
    if (!aadharBack?.file) newErrors.aadharBack = 'Aadhaar back image is required';
    if (!panImage?.file) newErrors.panImage = 'PAN image is required';
    if (aadhar_card && !validateAadhar(aadhar_card)) newErrors.adhar_card = 'Invalid Aadhaar number format (12 digits required)';
    if (panNum && !validatePAN(panNum)) newErrors.pancard = 'Invalid PAN number format (e.g., ABCDE1234F)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      toast.error('Please fix the errors below');
      return;
    }

    try {
      const [aadhaar_front_base64, aadhaar_back_base64, pan_front_base64] = await Promise.all([
        fileToBase64(aadharFront.file),
        fileToBase64(aadharBack.file),
        fileToBase64(panImage.file)
      ]);

      const kycData = {
        user_id: user.user_id,
        adhar_card: aadhar_card.replace(/[^0-9]/g, ''),
        pancard: panNum.toUpperCase(),
        aadhaar_front: aadhaar_front_base64,
        aadhaar_back: aadhaar_back_base64,
        pan_front: pan_front_base64
      };

      const response = await submitKyc(kycData);

      if (response.status) {
        toast.success('KYC submitted successfully!');
        setSubmitted(true);
        setAadharCard('');
        setPanNum('');
        setAadharFront(null);
        setAadharBack(null);
        setPanImage(null);
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      if (error.errors) setErrors(error.errors);
      toast.error(error.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen  px-4 md:px-7">
        <motion.div
          className="w-full max-w-md  rounded-2xl shadow-xl p-8 text-center"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-500 p-4 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
          >
            <CheckCircle2 size={48} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">KYC Submitted Successfully</h2>
          <p className="text-gray-600 mb-6">Documents are under verification. A notification will be sent once approved.</p>
          <motion.button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Submit Another KYC
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>{loading && <UniversalLoader />}</AnimatePresence>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 md:px-7 py-6 md:py-8 space-y-6"
      >
        {/* Header */}
        <motion.section variants={cardVariants} className="bg-gradient-to-t from-gray-700 to-gray-800 text-white rounded-2xl shadow-lg p-6 md:p-7">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-gray-700 to-gray-500 text-white p-4 rounded-full mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
            <p className="text-gray-300 mt-2">Secure the account with identity verification</p>
          </div>
        </motion.section>

        {/* Form */}
        <motion.section variants={cardVariants} className="bg-gradient-to-t from-gray-700 to-gray-800 text-white rounded-2xl shadow-lg p-6 md:p-7">
          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Aadhaar */}
            <motion.div variants={itemVariants} className="space-y-5">
              <div className="flex items-center gap-3">
                <FileText className="text-white-700" />
                <h2 className="text-xl font-semibold text-gray-300">Aadhaar Card Details</h2>
              </div>
              <div>
                <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-400 mb-1">
                  Aadhaar Number*
                </label>
                <motion.input
                  id="aadharNumber"
                  type="text"
                  value={aadhar_card}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 12) setAadharCard(value);
                  }}
                  className={[
                    'md:w-[50%] w-full px-4 py-3 border-2 rounded-xl transition-all',
                    errors.adhar_card ? 'border-red-500 focus:ring-4 focus:ring-red-200' : 'border-gray-200 focus:ring-4 focus:ring-gray-200 focus:border-gray-500'
                  ].join(' ')}
                  placeholder="Enter 12 digit Aadhaar Number"
                  required
                  maxLength="12"
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {errors.adhar_card && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-red-500 text-xs mt-1">
                      {errors.adhar_card}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader
                  title="Upload Aadhaar Front Image*"
                  name="aadhaar_front"
                  uploadedImage={aadharFront}
                  setUploadedImage={setAadharFront}
                  error={errors.aadharFront}
                  delay={0.05}
                />
                <ImageUploader
                  title="Upload Aadhaar Back Image*"
                  name="aadhaar_back"
                  uploadedImage={aadharBack}
                  setUploadedImage={setAadharBack}
                  error={errors.aadharBack}
                  delay={0.1}
                />
              </div>
            </motion.div>

            {/* PAN */}
            <motion.div variants={itemVariants} className="space-y-5">
              <div className="flex items-center gap-3">
                <FileText className="text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-300">PAN Card Details</h2>
              </div>
              <div>
                <label htmlFor="panNum" className="block text-sm font-medium text-gray-400 mb-1">
                  PAN Number*
                </label>
                <motion.input
                  id="panNum"
                  type="text"
                  value={panNum}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    if (value.length <= 10) setPanNum(value);
                  }}
                  className={[
                    'w-full md:w-[50%] px-4 py-3 border-2 rounded-xl transition-all',
                    errors.pancard ? 'border-red-500 focus:ring-4 focus:ring-red-200' : 'border-gray-200 focus:ring-4 focus:ring-amber-200 focus:border-amber-500'
                  ].join(' ')}
                  placeholder="ABCDE1234F"
                  required
                  maxLength="10"
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {errors.pancard && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-red-500 text-xs mt-1">
                      {errors.pancard}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="md:w-[50%] w-full">
                <ImageUploader
                  title="Upload PAN Image*"
                  name="pan_front"
                  uploadedImage={panImage}
                  setUploadedImage={setPanImage}
                  error={errors.panImage}
                  delay={0.15}
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-gradient-to-b from-gray-600 to-gray-700/90 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit KYC Verification'
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default Kyc;
