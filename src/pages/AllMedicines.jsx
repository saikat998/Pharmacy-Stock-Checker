import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiGrid, 
  FiList, 
  FiEdit3, 
  FiTrash2, 
  FiFilter, 
  FiDownload,
  FiPlus,
  FiSearch,
  FiX
} from 'react-icons/fi';
import Header from '../components/Header';
import { usePharmacy } from '../context/PharmacyContext';
import { 
  filterMedicines, 
  sortMedicines, 
  getExpiryStatus, 
  getStockStatus,
  formatDate,
  generateCSV,
  getDaysUntilExpiry 
} from '../utils/medicineUtils';

const AllMedicines = () => {
  const { medicines, deleteMedicine, loading } = usePharmacy();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    expiryStatus: '',
    stockStatus: '',
    type: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter and sort medicines
  const filteredMedicines = sortMedicines(
    filterMedicines(medicines, { ...filters, search: searchQuery }),
    filters.sortBy,
    filters.sortOrder
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedicine(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const handleExportCSV = () => {
    const csv = generateCSV(filteredMedicines);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medicines-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({
      expiryStatus: '',
      stockStatus: '',
      type: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setSearchQuery('');
  };

  // Medicine types for filter
  const medicineTypes = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 
    'Drop', 'Inhaler', 'Cream', 'Gel', 'Powder', 'Other'
  ];

  // Card component for grid view
  const MedicineCard = ({ medicine, index }) => {
    const expiryStatus = getExpiryStatus(medicine.expiryDate);
    const stockStatus = getStockStatus(medicine.quantity);
    const daysUntilExpiry = getDaysUntilExpiry(medicine.expiryDate);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
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
          <div className="flex space-x-2">
            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
              <FiEdit3 size={16} />
            </button>
            <button 
              onClick={() => setDeleteConfirm(medicine.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quantity:</span>
            <span className={`text-sm font-medium ${stockStatus.color.replace('danger', 'red').replace('warning', 'orange').replace('success', 'green')}-600`}>
              {medicine.quantity}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Expiry:</span>
            <span className="text-sm text-gray-900">
              {formatDate(medicine.expiryDate)}
            </span>
          </div>

          {medicine.price && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Price:</span>
              <span className="text-sm font-medium text-gray-900">
                ${medicine.price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            stockStatus.color === 'danger' ? 'text-red-700 bg-red-100' :
            stockStatus.color === 'warning' ? 'text-orange-700 bg-orange-100' :
            'text-green-700 bg-green-100'
          }`}>
            {stockStatus.label}
          </span>
          
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            expiryStatus.color === 'danger' ? 'text-red-700 bg-red-100' :
            expiryStatus.color === 'warning' ? 'text-orange-700 bg-orange-100' :
            'text-green-700 bg-green-100'
          }`}>
            {expiryStatus.label}
          </span>
        </div>

        {daysUntilExpiry !== null && daysUntilExpiry >= 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {daysUntilExpiry === 0 ? 'Expires today' : 
             daysUntilExpiry === 1 ? 'Expires in 1 day' :
             `Expires in ${daysUntilExpiry} days`}
          </div>
        )}
      </motion.div>
    );
  };

  // Table row component for list view
  const MedicineRow = ({ medicine, index }) => {
    const expiryStatus = getExpiryStatus(medicine.expiryDate);
    const stockStatus = getStockStatus(medicine.quantity);

    return (
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
        className="hover:bg-gray-50 transition-colors"
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {medicine.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {medicine.batchNo}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {medicine.type}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {medicine.quantity}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(medicine.expiryDate)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              stockStatus.color === 'danger' ? 'text-red-700 bg-red-100' :
              stockStatus.color === 'warning' ? 'text-orange-700 bg-orange-100' :
              'text-green-700 bg-green-100'
            }`}>
              {stockStatus.label}
            </span>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              expiryStatus.color === 'danger' ? 'text-red-700 bg-red-100' :
              expiryStatus.color === 'warning' ? 'text-orange-700 bg-orange-100' :
              'text-green-700 bg-green-100'
            }`}>
              {expiryStatus.label}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              <FiEdit3 size={16} />
            </button>
            <button 
              onClick={() => setDeleteConfirm(medicine.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </td>
      </motion.tr>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="All Medicines" showSearch onSearchChange={setSearchQuery} />
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
      <Header title="All Medicines" showSearch onSearchChange={setSearchQuery} />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors rounded-l-lg`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors rounded-r-lg`}
                >
                  <FiList size={20} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFilter size={16} />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <span className="text-sm text-gray-600">
                {filteredMedicines.length} of {medicines.length} medicines
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiDownload size={16} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              {/* Add Medicine Button */}
              <Link
                to="/add-medicine"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus size={16} />
                <span>Add Medicine</span>
              </Link>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Expiry Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Status
                    </label>
                    <select
                      value={filters.expiryStatus}
                      onChange={(e) => handleFilterChange('expiryStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All</option>
                      <option value="safe">Safe</option>
                      <option value="expiring_soon">Expiring Soon</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Status
                    </label>
                    <select
                      value={filters.stockStatus}
                      onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      {medicineTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="name">Name</option>
                        <option value="expiryDate">Expiry Date</option>
                        <option value="quantity">Quantity</option>
                        <option value="createdAt">Date Added</option>
                      </select>
                      <button
                        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {filters.sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <FiX size={16} />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiSearch size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || Object.values(filters).some(v => v) 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first medicine"}
            </p>
            <Link
              to="/add-medicine"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus size={16} />
              <span>Add Medicine</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine, index) => (
              <MedicineCard key={medicine.id} medicine={medicine} index={index} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-800 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 drop-shadow-lg uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700 drop-shadow-lg uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-700 drop-shadow-lg uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-700 drop-shadow-lg uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.map((medicine, index) => (
                  <MedicineRow key={medicine.id} medicine={medicine} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 m-4 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Medicine
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this medicine? This action cannot be undone.
              </p>
              <div className="flex space-x-4 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllMedicines;
