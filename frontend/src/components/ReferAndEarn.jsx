import React from 'react';
import { CopyIcon, Share2Icon, Gift } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ReferAndEarn() {
  const { user } = useAuthContext();

  const notifyCopied = () =>
    toast.success('Copied to clipboard!', {
      position: 'top-center',
      autoClose: 1800,
      hideProgressBar: true,
      theme: 'colored',
      style: { background: '#16a34a', color: 'white' },
    });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(notifyCopied).catch(() => {});
  };

  const shareLink = () => {
    const url = `https://web.futureservices.services/register?refcode=${user.referral_code}`;
    if (navigator.share) {
      navigator
        .share({
          title: 'Join Future Services with me!',
          text: `Use my referral code ${user.referral_code} to get exclusive benefits`,
          url,
        })
        .catch(() => {});
    } else {
      copyToClipboard(url);
    }
  };

  const url = `https://web.futureservices.services/register?refcode=${user.referral_code}`;

  return (
    <div className="w-full space-y-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
        className="text-center pt-6"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Referral Program
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Invite friends and earn exciting rewards with every successful referral
        </p>
      </motion.div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 mt-0 md:px-8 md:py-4">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
            className="relative rounded-2xl p-8 shadow-2xl overflow-hidden text-white border border-gray-100 bg-gradient-to-br from-gray-700/90 to-gray-600/90"
          >
            {/* subtle shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Referral Benefits</h2>
                </div>
                <Gift
                  onClick={() =>
                    toast.info('Check your rewards dashboard for bonus offers!', {
                      position: 'top-center',
                      theme: 'colored',
                    })
                  }
                  className="text-white/80 hover:text-white cursor-pointer transition-colors"
                  size={26}
                />
              </div>

              {/* Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/90 mb-2">YOUR UNIQUE CODE</label>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 hover:border-white/30 transition-all">
                  <p className="text-3xl font-mono tracking-wider font-bold">MFS2025LKO</p>
                  <button
                    onClick={() => copyToClipboard(MFS2025LKO)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                    aria-label="Copy code"
                  >
                    <CopyIcon size={18} />
                  </button>
                </div>
              </div>

              {/* Link */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/90 mb-2">SHARE YOUR LINK</label>
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden hover:border-white/30 transition-all">
                  <p className="px-3 py-2 text-sm truncate flex-1 font-medium">{url}</p>
                  <button
                    onClick={() => copyToClipboard(url)}
                    className="px-3 py-2 bg-white/20 hover:bg-white/30 transition-colors border-l border-white/20 flex items-center font-medium"
                  >
                    <CopyIcon size={16} className="mr-2" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Share */}
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareLink}
                className="w-full py-4 bg-white text-blue-700 rounded-xl font-bold flex items-center justify-center hover:bg-blue-50 transition-all shadow-lg"
              >
                <Share2Icon size={18} className="mr-3" />
                Invite Friends
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right column placeholder (kept empty as requested) */}
        <div />
      </div>
    </div>
  );
}
