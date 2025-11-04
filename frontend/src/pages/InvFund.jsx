import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';
import InvFundCard from '../components/InvFundCard';
import { useAuthContext } from '../context/AuthContext';
import { getInvestmentSummary } from '../services/apiService';
import UniversalLoader from '../components/UniversalLoader';

function InvFund() {
  const [invData, setInvData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  // Dummy data fallback
  const dummyData = {
    data: [
      {
        product_name: 'Alpha Growth Fund',
        invested: '₹50,000',
        capital: '₹65,000',
        ROI: '30%',
        start_date: '2024-01-15',
        end_date: '2025-01-15',
        plan_type: 'Equity',
        months_passed: 10,
      },
      {
        product_name: 'Tech Vision Portfolio',
        invested: '₹1,00,000',
        capital: '₹1,35,000',
        ROI: '35%',
        start_date: '2023-10-10',
        end_date: '2025-10-10',
        plan_type: 'Hybrid',
        months_passed: 13,
      },
      {
        product_name: 'Safe Returns Plan',
        invested: '₹75,000',
        capital: '₹87,000',
        ROI: '16%',
        start_date: '2024-05-20',
        end_date: '2025-05-20',
        plan_type: 'Debt',
        months_passed: 5,
      },
    ],
  };

  useEffect(() => {
    const fetchInvFundData = async () => {
      setLoading(true);
      try {
        if (user?.user_id) {
          const data = await getInvestmentSummary(user.user_id);
          console.log('API data:', data);
          if (data?.data?.length) {
            setInvData(data);
          } else {
            console.warn('Empty API data — using dummy fallback.');
            setInvData(dummyData);
          }
        } else {
          console.warn('No user found — using dummy data.');
          setInvData(dummyData);
        }
      } catch (error) {
        console.error('Error fetching investment summary, using dummy data:', error);
        setInvData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchInvFundData();
  }, [user]);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <main className="flex-1 py-0 px-7 space-y-8">
      <AnimatePresence>{loading && <UniversalLoader />}</AnimatePresence>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <motion.h2
            className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            My Project
          </motion.h2>
          <motion.hr
            className="w-[100%] text-gray-300"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Investment Cards */}
      {loading ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <InvFundCard
              key={index}
              icon={Wallet}
              isLoading={true}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      ) : invData.data.length === 0 ? (
        <motion.div
          className="flex items-center justify-center text-2xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Product Cart is Empty
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {invData.data.map((item, index) => (
            <InvFundCard
              key={index}
              icon={Wallet}
              productName={item.product_name}
              invested={item.invested}
              capital={item.capital}
              ROI={item.ROI}
              joinDate={item.start_date}
              endDate={item.end_date}
              planType={item.plan_type}
              plan={item.months_passed}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      )}
    </main>
  );
}

export default InvFund;
