// src/pages/UserProfile.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Banknote, Users, Info, FileText,
  ShieldCheck, LogOut, ChevronRight, Handshake, KeyRound
} from 'lucide-react';

import { useAuthContext } from '../context/AuthContext';
import { updateUserProfile, getUser } from '../services/apiService';
import UniversalLoader from '../components/UniversalLoader';
import ProfileHeader, { cardVariants, containerVariants } from '../components/profile/ProfileHeader';

// Animation variant for each grid child
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', damping: 15, stiffness: 300 }
  }
};

const ProfileLink = ({ icon: Icon, text, path }) => (
  <motion.div variants={itemVariants}>
    <NavLink
      to={path}
      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-gray-200 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
          <Icon className="text-gray-600 group-hover:text-blue-600" size={20} />
        </div>
        <span className="font-medium text-gray-700">{text}</span>
      </div>
      <ChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
    </NavLink>
  </motion.div>
);

export default function UserProfile() {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    photo: '',
    email: '',
    wallet: 0
  });

  const [nameValue, setNameValue] = useState('');
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Dummy fallback data
  const dummyUserData = {
    name: 'Gaurav Pandey',
    phone: '9876543210',
    photo: 'https://avatars.githubusercontent.com/u/153275712?s=400&u=1dc1644febe2b8a96acfa6e417db6ae2f859bcc4&v=4',
    email: 'gaurav@example.com',
    wallet: 52000
  };

  const fetchUserData = async () => {
    try {
      if (!user?.user_id) {
        console.warn('No user found — using dummy data');
        setUserData(dummyUserData);
        setNameValue(dummyUserData.name);
        // toast.info('Using dummy user data');
        return;
      }

      const response = await getUser(user.user_id);
      console.log('User profile API response:', response);

      if (response?.status && response.data) {
        const data = {
          name: response.data.name || '',
          phone: response.data.phone || '',
          photo: response.data.photo || '',
          email: response.data.email || '',
          wallet: response.data.wallet || 0
        };
        setUserData(data);
        setNameValue(data.name || '');
      } else {
        console.warn('Invalid user API response — using dummy data');
        setUserData(dummyUserData);
        setNameValue(dummyUserData.name);
        toast.warn('Using fallback user data');
      }
    } catch (e) {
      console.error('Error fetching user profile, using dummy:', e);
      setUserData(dummyUserData);
      setNameValue(dummyUserData.name);
      toast.warn('Using dummy user data');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditToggle = () => {
    setIsEditing((v) => !v);
    if (isEditing) setTempImage(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImage({
        file,
        preview: URL.createObjectURL(file),
        base64: e.target?.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!nameValue.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    const isNameChanged = nameValue.trim() !== userData.name;
    const isPhotoChanged = !!tempImage;
    if (!isNameChanged && !isPhotoChanged) {
      toast.info('No changes were made');
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        user_id: user.user_id,
        name: nameValue.trim(),
        photo: tempImage ? tempImage.base64 : ''
      };
      const res = await updateUserProfile(payload);
      if (res?.status) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setTempImage(null);
        await fetchUserData();
      } else {
        toast.error(res?.message || 'Failed to update profile');
      }
    } catch (e) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully.');
    navigate('/login');
  };

  const actionLinks = [
    { icon: Banknote, text: 'Bank Details', path: '/bank-details' },
    { icon: Users, text: 'Team', path: '/team' },
    { icon: Info, text: 'About Us', path: '/about-us' },
    { icon: FileText, text: 'T&C', path: '/term_conditions' },
    { icon: ShieldCheck, text: 'KYC', path: '/kyc' },
    { icon: KeyRound, text: 'Privacy Policy', path: '/policy' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Universal loader during page data fetch */}
      <AnimatePresence>{pageLoading && <UniversalLoader />}</AnimatePresence>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 md:px-7 py-6 md:py-8 space-y-6"
      >
        {/* Header */}
        <AnimatePresence>
          {pageLoading ? (
            <motion.div
              key="header-skeleton"
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-7"
            >
              <div className="flex items-center gap-4 md:gap-6 animate-pulse">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-36 bg-gray-200 rounded" />
                </div>
              </div>
            </motion.div>
          ) : (
            <ProfileHeader
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
              isSaving={isSaving}
              userData={userData}
              tempImage={tempImage}
              onFileChange={handleFileChange}
              nameValue={nameValue}
              setNameValue={setNameValue}
              phoneValue={userData.phone}
            />
          )}
        </AnimatePresence>

        {/* Stats / User details card */}
        <AnimatePresence>
          {!isEditing && !pageLoading && (
            <motion.section
              key="details"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
              >
                <motion.div variants={itemVariants} className="rounded-xl p-4 border-t-4 border-blue-600 bg-gray-50">
                  <p className="text-sm text-gray-500">Login ID</p>
                  <p className="text-lg font-bold text-gray-800">{user?.user_id || 'USR0001'}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="rounded-xl p-4 border-t-4 border-amber-500 bg-gray-50">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-bold text-gray-800">{userData.email}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="rounded-xl p-4 border-t-4 border-blue-600 bg-gray-50">
                  <p className="text-sm text-gray-500">Wallet Balance</p>
                  <p className="text-lg font-bold text-green-600">₹{userData.wallet}</p>
                </motion.div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Action links */}
        <motion.section variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {actionLinks.map((link) => (
              <ProfileLink key={link.text} icon={link.icon} text={link.text} path={link.path} />
            ))}

            {/* WhatsApp Support */}
            <motion.div variants={itemVariants}>
              <a
                href={`https://wa.me/918957466548?text=${encodeURIComponent(`Hello Support, this is ${userData.name || 'a user'}. I need help.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Handshake className="text-gray-600 group-hover:text-blue-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-700">Support</span>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
              </a>
            </motion.div>

            {/* Logout */}
            <motion.div variants={itemVariants}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-red-200 p-2 rounded-lg">
                    <LogOut className="text-red-600" size={20} />
                  </div>
                  <span className="font-medium text-red-700">Logout</span>
                </div>
                <ChevronRight className="text-red-400" size={20} />
              </button>
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}
