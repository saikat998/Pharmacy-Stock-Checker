import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiAlertTriangle, 
  FiClock, 
  FiTrendingUp,
  FiShoppingBag,
  FiActivity,
  FiArrowRight
} from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import { usePharmacy } from '../context/PharmacyContext';
import { 
  calculateMedicineStats, 
  filterMedicines, 
  sortMedicines,
  isExpired,
  isExpiringSoon,
  formatDate 
} from '../utils/medicineUtils';

// Counter animation component
const AnimatedCounter = ({ end, duration = 1000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

// Stats card component
const StatsCard = ({ title, value, icon: Icon, color, change, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>
            <AnimatedCounter end={value} />
          </p>
          {change && (
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <FiTrendingUp size={14} className="mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color.replace('text-', 'from-')}-100 ${color.replace('text-', 'to-')}-200 flex items-center justify-center`}>
          <Icon className={`${color} w-6 h-6`} />
        </div>
      </div>
    </motion.div>
  );
};

// Medicine item component
const MedicineItem = ({ medicine, index }) => {
  const isExp = isExpired(medicine.expiryDate);
  const isExpSoon = isExpiringSoon(medicine.expiryDate, 30);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-3 h-3 rounded-full ${
          isExp ? 'bg-red-500' : isExpSoon ? 'bg-orange-500' : 'bg-green-500'
        }`} />
        <div>
          <h4 className="font-medium text-gray-900">{medicine.name}</h4>
          <p className="text-sm text-gray-500">
            Batch: {medicine.batchNo} • Qty: {medicine.quantity}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {formatDate(medicine.expiryDate)}
        </p>
        <p className={`text-xs ${
          isExp ? 'text-red-600' : isExpSoon ? 'text-orange-600' : 'text-green-600'
        }`}>
          {isExp ? 'Expired' : isExpSoon ? 'Expiring Soon' : 'Safe'}
        </p>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { medicines, loading } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = calculateMedicineStats(medicines);
  
  // Filter medicines for search
  const filteredMedicines = filterMedicines(medicines, { search: searchQuery });
  
  // Get recent medicines (last 5 added)
  const recentMedicines = sortMedicines(medicines, 'createdAt', 'desc').slice(0, 5);
  
  // Get expiring medicines
  const expiringMedicines = medicines
    .filter(med => isExpiringSoon(med.expiryDate, 30) || isExpired(med.expiryDate))
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 5);

  // Pie chart data
  const pieData = [
    { name: 'In Stock', value: stats.inStock, color: '#22c55e' },
    { name: 'Low Stock', value: stats.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats.outOfStock, color: '#ef4444' },
    { name: 'Expired', value: stats.expired, color: '#dc2626' },
  ];

  // Bar chart data (sample monthly data)
  const barData = [
    { month: 'Jan', added: 12, expired: 2 },
    { month: 'Feb', added: 8, expired: 1 },
    { month: 'Mar', added: 15, expired: 3 },
    { month: 'Apr', added: 10, expired: 2 },
    { month: 'May', added: 20, expired: 1 },
    { month: 'Jun', added: 14, expired: 4 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Dashboard" showSearch onSearchChange={setSearchQuery} />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-32 border border-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" showSearch onSearchChange={setSearchQuery} />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Medicines"
            value={stats.total}
            icon={FiPackage}
            color="text-blue-600"
            change="+12% from last month"
            delay={0}
          />
          <StatsCard
            title="Out of Stock"
            value={stats.outOfStock}
            icon={FiAlertTriangle}
            color="text-red-600"
            change={stats.outOfStock > 0 ? "Needs attention" : "All good!"}
            delay={0.1}
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon={FiClock}
            color="text-orange-600"
            change="Within 30 days"
            delay={0.2}
          />
          <StatsCard
            title="Expired"
            value={stats.expired}
            icon={FiActivity}
            color="text-red-500"
            change={stats.expired > 0 ? "Requires action" : "None expired"}
            delay={0.3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="added" fill="#22c55e" name="Added" />
                <Bar dataKey="expired" fill="#ef4444" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Medicine Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Medicines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recently Added</h3>
              <Link
                to="/medicines"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View All <FiArrowRight className="ml-1" size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentMedicines.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No medicines added yet</p>
              ) : (
                recentMedicines.map((medicine, index) => (
                  <MedicineItem key={medicine.id} medicine={medicine} index={index} />
                ))
              )}
            </div>
          </motion.div>

          {/* Expiring Medicines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Expiry Alerts</h3>
              <Link
                to="/expiry-tracker"
                className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
              >
                View All <FiArrowRight className="ml-1" size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {expiringMedicines.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No expiring medicines</p>
              ) : (
                expiringMedicines.map((medicine, index) => (
                  <MedicineItem key={medicine.id} medicine={medicine} index={index} />
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/add-medicine"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPackage className="mr-2" size={16} />
              Add Medicine
            </Link>
            <Link
              to="/expiry-tracker"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FiClock className="mr-2" size={16} />
              Check Expiry
            </Link>
            <Link
              to="/medicines"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiShoppingBag className="mr-2" size={16} />
              View Stock
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
