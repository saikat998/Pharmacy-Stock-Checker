import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiAlertTriangle, 
  FiDownload, 
  FiFilter,
  FiX
} from 'react-icons/fi';
import Header from '../components/Header';
import { usePharmacy } from '../context/PharmacyContext';
import { 
  isExpired, 
  isExpiringSoon, 
  getDaysUntilExpiry, 
  formatDate,
  generateCSV,
  getExpiryStatus
} from '../utils/medicineUtils';

const ExpiryTracker = () => {
  const { medicines, loading } = usePharmacy();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter medicines based on expiry status
  const getFilteredMedicines = () => {
    let filtered = medicines;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.batchNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply expiry filter
    switch (selectedFilter) {
      case 'expired':
        return filtered.filter(med => isExpired(med.expiryDate));
      case 'expiring_7':
        return filtered.filter(med => {
          const days = getDaysUntilExpiry(med.expiryDate);
          return days >= 0 && days <= 7;
        });
      case 'expiring_15':
        return filtered.filter(med => {
          const days = getDaysUntilExpiry(med.expiryDate);
          return days >= 0 && days <= 15;
        });
      case 'expiring_30':
        return filtered.filter(med => {
          const days = getDaysUntilExpiry(med.expiryDate);
          return days >= 0 && days <= 30;
        });
      default:
        return filtered;
    }
  };

  const filteredMedicines = getFilteredMedicines();

  const handleExportCSV = () => {
    const csv = generateCSV(filteredMedicines);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expiry-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Medicine card component
  const MedicineExpiryCard = ({ medicine, index }) => {
    const expiryStatus = getExpiryStatus(medicine.expiryDate);
    const daysUntilExpiry = getDaysUntilExpiry(medicine.expiryDate);
    
    const getStatusColor = () => {
      if (expiryStatus.status === 'expired') return 'border-red-200 bg-red-50';
      if (expiryStatus.status === 'expiring_soon') return 'border-orange-200 bg-orange-50';
      return 'border-green-200 bg-green-50';
    };

    const getTextColor = () => {
      if (expiryStatus.status === 'expired') return 'text-red-700';
      if (expiryStatus.status === 'expiring_soon') return 'text-orange-700';
      return 'text-green-700';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`bg-white rounded-xl border-2 ${getStatusColor()} p-6 hover:shadow-md transition-shadow`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {medicine.name}
            </h3>
            <p className="text-sm text-gray-600">
              Batch: {medicine.batchNo} • {medicine.type}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTextColor()}`}>
            {expiryStatus.label}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quantity:</span>
            <span className="text-sm font-medium text-gray-900">
              {medicine.quantity}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Expiry Date:</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(medicine.expiryDate)}
            </span>
          </div>

          {daysUntilExpiry !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Days Left:</span>
              <span className={`text-sm font-medium ${getTextColor()}`}>
                {daysUntilExpiry < 0 
                  ? `${Math.abs(daysUntilExpiry)} days ago`
                  : daysUntilExpiry === 0 
                    ? 'Expires today'
                    : `${daysUntilExpiry} days`
                }
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Expiry Tracker" />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-48 border border-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Expiry Tracker" showSearch onSearchChange={setSearchQuery} />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filter Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter by Expiry</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('expired')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'expired' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Expired
                </button>
                <button
                  onClick={() => setSelectedFilter('expiring_7')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'expiring_7' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setSelectedFilter('expiring_15')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'expiring_15' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  15 Days
                </button>
                <button
                  onClick={() => setSelectedFilter('expiring_30')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'expiring_30' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredMedicines.length} medicines found
              </span>
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiDownload size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiClock size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedFilter !== 'all' 
                ? "No medicines match your current filters" 
                : "All medicines are within safe expiry dates"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine, index) => (
              <MedicineExpiryCard key={medicine.id} medicine={medicine} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiryTracker;
