import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiUser } from 'react-icons/fi';

const tabs = [
  { to: '', label: 'Refer & Earn', icon: FiShare2, grad: 'from-gray-700 to-gray-600' },
  { to: 'salary', label: 'Salary Program', icon: FiUser, grad: 'from-amber-600 to-amber-500' },
];

export default function Promotion() {
  const [mounted, setMounted] = useState(false);
  const [routeReady, setRouteReady] = useState(true); // hook real data if needed

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 md:px-7 py-6 md:py-8">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
        className="mb-8"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Promotion Program
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Expand your network and unlock exclusive rewards with our referral programs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-sm">
            {tabs.map(({ to, label, icon: Icon, grad }) => (
              <NavLink
                key={label}
                to={to}
                end={to === ''}
                className={({ isActive }) =>
                  [
                    'relative px-6 md:px-8 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                    isActive
                      ? `text-white shadow-md bg-gradient-to-r ${grad}`
                      : 'text-gray-600 hover:bg-gray-100',
                  ].join(' ')
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Content card + loading */}
      <section>
        <AnimatePresence mode="wait">
          {!routeReady ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 md:p-7 animate-pulse space-y-4">
                <div className="h-6 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-72 bg-gray-200 rounded" />
                <div className="h-40 w-full bg-gray-200 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-200 rounded-xl" />
                  <div className="h-24 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
