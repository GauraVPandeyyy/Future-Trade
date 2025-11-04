import React from 'react';
import { motion } from 'framer-motion';

export default function Salary() {
  const salaryHistory = [
    { id: 1, date: '2023-10-15', amount: 25000, status: 'success' },
    { id: 2, date: '2023-09-15', amount: 22000, status: 'success' },
    { id: 3, date: '2023-08-15', amount: 18000, status: 'success' },
    { id: 4, date: '2023-07-15', amount: 0, status: 'pending' },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requirements */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Program Requirements</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Active</span>
          </div>

          <div className="relative rounded-xl overflow-hidden mb-6 h-48">
            <img
              src="https://metafutureservices.com/assets/refralimg-CSYg7Cri.jpg"
              alt="Salary program illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <h3 className="text-white font-medium">Growth Plan 2023</h3>
            </div>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <div>
                <h4 className="font-medium text-gray-800">Downline Requirement</h4>
                <p className="text-gray-600 text-sm mt-1">Add minimum 2 downline with the fund of 6 Lacs</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <div>
                <h4 className="font-medium text-gray-800">Salary Continuation</h4>
                <p className="text-gray-600 text-sm mt-1">For carry-on salary, extra 20% value of weaker downline</p>
              </div>
            </li>
          </ul>
        </motion.section>

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Salary History</h2>
            <button className="text-sm font-medium text-blue-700 hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {salaryHistory.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05, type: 'spring', damping: 15, stiffness: 300 } }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">Salary Payment</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${item.amount > 0 ? 'text-green-600' : 'text-gray-500'
                      }`}
                  >
                    {item.amount > 0 ? `₹${item.amount.toLocaleString('en-IN')}` : '--'}
                  </p>
                  <span
                    className={`text-xs mt-1 ${item.status === 'success' ? 'text-green-600' : 'text-amber-600'
                      }`}
                  >
                    {item.status === 'success' ? 'Completed' : 'Processing'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
