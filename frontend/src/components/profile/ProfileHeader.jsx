// src/components/profile/ProfileHeader.jsx
import React, { useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit3, Save, X } from 'lucide-react';

// Reusable click-outside hook for dropdowns/modals if needed
function useOnClickOutside(ref, handler, eventType = 'mousedown') {
  React.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener(eventType, listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener(eventType, listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, eventType]);
}

// Shared motion variants for consistency
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  }
};

export const avatarVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -5, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 10 } }
};

const btnHover = { y: -3, scale: 1.02 };
const btnTap = { scale: 0.95 };

export default function ProfileHeader({
  isEditing,
  onEditToggle,
  onSave,
  isSaving,
  userData,
  tempImage,
  onFileChange,
  nameValue,
  setNameValue,
  phoneValue
}) {
  const fileInputRef = useRef(null);
  const headerRef = useRef(null);

  // Attach to overlays if needed
  useOnClickOutside(headerRef, () => {});

  const profileSrc = useMemo(() => {
    if (tempImage?.preview) return tempImage.preview;
    return userData?.photo || '/default-avatar.png';
  }, [tempImage, userData]);

  const triggerFile = useCallback(() => fileInputRef.current?.click(), []);

  return (
    <motion.section variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        ref={headerRef}
        variants={cardVariants}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-7 lg:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Avatar + Identity */}
          <motion.div
            className="flex items-center gap-4 md:gap-6"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <div className="relative">
              <motion.img
                variants={avatarVariants}
                src={profileSrc}
                alt="Profile"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <AnimatePresence>
                {isEditing && (
                  <>
                    <motion.button
                      key="camera-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={triggerFile}
                      className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Camera size={28} className="text-white" />
                    </motion.button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={onFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col">
              {!isEditing ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-sans">
                    {userData?.name || '—'}
                  </h2>
                  <p className="text-gray-500 text-base md:text-lg">{userData?.phone || '—'}</p>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-3 w-full max-w-xs md:max-w-sm">
                  <input
                    type="text"
                    name="name"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={phoneValue || ''}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4 self-start md:self-auto">
            <AnimatePresence mode="popLayout">
              {!isEditing ? (
                <motion.button
                  key="edit-btn"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{
                    opacity: 1, y: 0, scale: 1,
                    transition: { type: 'spring', damping: 15, stiffness: 300 }
                  }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  onClick={onEditToggle}
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={btnHover}
                  whileTap={btnTap}
                >
                  <Edit3 size={18} />
                  Edit
                </motion.button>
              ) : (
                <>
                  <motion.button
                    key="save-btn"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{
                      opacity: 1, y: 0, scale: 1,
                      transition: { type: 'spring', damping: 15, stiffness: 300 }
                    }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onClick={onSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60"
                    whileHover={!isSaving ? btnHover : {}}
                    whileTap={!isSaving ? btnTap : {}}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                        Saving
                      </span>
                    ) : (
                      <>
                        <Save size={18} />
                        Save
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    key="cancel-btn"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{
                      opacity: 1, y: 0, scale: 1,
                      transition: { type: 'spring', damping: 15, stiffness: 300 }
                    }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onClick={onEditToggle}
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    whileHover={btnHover}
                    whileTap={btnTap}
                  >
                    <X size={18} />
                    Cancel
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
