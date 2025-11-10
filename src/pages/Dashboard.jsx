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
      className="modern-card rounded-xl p-6 hover-lift group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-bold ${color} text-shadow`}>
            <AnimatedCounter end={value} />
          </p>
          {change && (
            <p className="text-sm text-gray-500 mt-3 flex items-center font-medium">
              <FiTrendingUp size={14} className="mr-1 text-green-500" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradientClass(color)} flex items-center justify-center shadow-lg floating-animation group-hover:shadow-xl transition-shadow duration-300`}>
          <Icon className="text-white w-8 h-8" />
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to get gradient class based on color
const getGradientClass = (color) => {
  const gradientMap = {
    'text-blue-600': 'from-blue-500 to-blue-600',
    'text-green-600': 'from-green-500 to-green-600',
    'text-purple-600': 'from-purple-500 to-purple-600',
    'text-orange-600': 'from-orange-500 to-orange-600',
    'text-red-600': 'from-red-500 to-red-600',
  };
  return gradientMap[color] || 'from-blue-500 to-blue-600';
};

// Medicine item component
const MedicineItem = ({ medicine, index }) => {
  const isExp = isExpired(medicine.expiryDate);
  const isExpSoon = isExpiringSoon(medicine.expiryDate, 30);

  const getStatusColor = () => {
    if (isExp) return 'bg-red-500 shadow-glow-red';
    if (isExpSoon) return 'bg-orange-500 shadow-glow-orange';
    return 'bg-green-500 shadow-glow-green';
  };

  const getStatusText = () => {
    if (isExp) return 'Expired';
    if (isExpSoon) return 'Expiring Soon';
    return 'Active';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="modern-card rounded-xl p-4 hover-lift group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${getStatusColor()} pulse-slow`} />
          <div>
            <h4 className="font-semibold text-gray-900 text-shadow">{medicine.name}</h4>
            <p className="text-sm text-gray-500 font-medium">
              Batch: {medicine.batchNo} • Qty: {medicine.quantity}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 text-shadow">
            {formatDate(medicine.expiryDate)}
          </p>
          <div className="flex items-center justify-end space-x-2 mt-1">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isExp ? 'bg-red-100 text-red-700 shadow-glow-red' : 
              isExpSoon ? 'bg-orange-100 text-orange-700 shadow-glow-orange' : 
              'bg-green-100 text-green-700 shadow-glow-green'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>
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
      <div className="min-h-screen">
        <Header title="Dashboard" showSearch onSearchChange={setSearchQuery} />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl h-32 shimmer" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="glass-card rounded-xl h-80 shimmer" />
              <div className="glass-card rounded-xl h-80 shimmer" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card rounded-xl h-96 shimmer" />
              <div className="glass-card rounded-xl h-96 shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" showSearch onSearchChange={setSearchQuery} />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Page Title */}
        <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 dark:from-blue-300 dark:via-purple-400 dark:to-pink-300 drop-shadow-lg">Dashboard</h2>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
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
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 hover-lift"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-shadow">Stock Distribution</h3>
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
            className="glass-card rounded-xl p-6 hover-lift"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-shadow">Monthly Overview</h3>
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
            className="glass-card rounded-xl p-6 hover-lift"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 text-shadow">Recently Added</h3>
              <Link
                to="/medicines"
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center hover-scale transition-all duration-300 px-3 py-1 rounded-lg hover:bg-blue-50"
              >
                View All <FiArrowRight className="ml-1" size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentMedicines.length === 0 ? (
                <div className="text-center py-12">
                  <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No medicines added yet</p>
                  <p className="text-gray-400 text-sm">Start by adding your first medicine</p>
                </div>
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
            className="glass-card rounded-xl p-6 hover-lift"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 text-shadow">Expiry Alerts</h3>
              <Link
                to="/expiry-tracker"
                className="text-orange-600 hover:text-orange-800 text-sm font-semibold flex items-center hover-scale transition-all duration-300 px-3 py-1 rounded-lg hover:bg-orange-50"
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
