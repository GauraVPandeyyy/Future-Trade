import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardCard from '../components/DashboardCard';
import { getHomeData } from '../services/apiService';
import { useAuthContext } from '../context/AuthContext';
import {
  Wallet,
  Users,
  DollarSign,
  CreditCard,
  BarChart3,
  PiggyBank,
  Coins,
  Receipt,
  Award,
} from 'lucide-react';
import UniversalLoader from '../components/UniversalLoader';

const Home = () => {
  const { user } = useAuthContext();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      if (user?.user_id) {
        try {
          const data = await getHomeData(user.user_id);
          setHomeData(data);
        } catch (error) {
          console.error('Error fetching home data:', error);
        }
      }
    };

    // fetchHomeData();
  }, [user]);

  const getDashboardData = () => {
    // if (!homeData) return [];

    return [
      { icon: Users, label: "Active Downline", value:  0, colorClass: "text-blue-600" },
      { icon: DollarSign, label: "Team Income", value:0, colorClass: "text-green-600" },
      { icon: Receipt, label: "Total Payout", value:  0, colorClass: "text-purple-600" },
      { icon: BarChart3, label: "Today Team Business", value:  0, colorClass: "text-orange-600" },
      { icon: Coins, label: "Daily Income", value:  0, colorClass: "text-yellow-600" },
      { icon: PiggyBank, label: "Total Daily Income", value:  0, colorClass: "text-green-600" },
      { icon: CreditCard, label: "Total Income", value:  0, colorClass: "text-blue-600" },
      { icon: Wallet, label: "Wallet Balance", value:  0, colorClass: "text-indigo-600" },
      { icon: Award, label: "Cashback Income", value: 0, colorClass: "text-pink-600" },
    ];
  };

  // Container animation with stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <main className="flex-1 py-0 px-7 space-y-8">
      {/* <AnimatePresence> */}
      {/* {loading && <UniversalLoader />} */}
      {/* </AnimatePresence> */}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Downline Details
          </h2>
          <motion.hr
            className='w-full text-gray-300'
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        </div>

        {/* Enhanced Note Section */}
        {/* Enhanced Note Section with marquee */}
        <motion.div
          className="relative bg-gradient-to-r from-gray-50 to-gray-50 border border-green-50 rounded-xl p-4 mb-6 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5"></div>

          <div className="relative flex items-center space-x-3">
            <h5 className="font-bold bg-gradient-to-br from-blue-300 to-green-200 px-3 py-2 rounded shrink-0">
              Note
            </h5>

            {/* Marquee container */}
            <div className="flex-1 overflow-x-hidden">
              <div className="relative">
                {/* Fade edges for a premium feel */}
                <span className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent" />
                <span className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent" />

                {/* Track: duplicate content for seamless loop */}
                <div className="marquee-track whitespace-nowrap text-gray-700 leading-relaxed text-[14px] bg-white py-2 px-3 rounded-md space-x-6">
                  <span>
                    Your Gateway to Smart Trading and Financial Growth. Start your journey with confidence and watch your portfolio flourish.
                  </span>
                  <span>
                    Your Gateway to Smart Trading and Financial Growth. Start your journey with confidence and watch your portfolio flourish.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dashboard Cards Grid with Stagger Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          // Skeleton loading cards
          Array.from({ length: 9 }).map((_, index) => (
            <DashboardCard
              key={index}
              icon={Users}
              label="Loading..."
              value=""
              colorClass="text-blue-600"
              delay={index * 0.2}
              isLoading={false}
            />
          ))
        ) : (
          // Actual data cards
          getDashboardData().map((card, index) => (
            <DashboardCard
              key={index}
              icon={card.icon}
              label={card.label}
              value={card.value}
              colorClass={card.colorClass}
              delay={index * 0.1}
            />
          ))
        )}
      </motion.div>
    </main>
  );
};

export default Home;