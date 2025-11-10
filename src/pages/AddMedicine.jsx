import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiPackage } from 'react-icons/fi';
import Header from '../components/Header';
import { usePharmacy } from '../context/PharmacyContext';

const medicineTypes = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Injection',
  'Ointment',
  'Drop',
  'Inhaler',
  'Cream',
  'Gel',
  'Powder',
  'Other'
];

const AddMedicine = () => {
  const navigate = useNavigate();
  const { addMedicine, loading } = usePharmacy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      batchNo: '',
      type: '',
      quantity: '',
      expiryDate: '',
      price: '',
      minStock: '10',
      description: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const medicineData = {
        ...data,
        quantity: parseInt(data.quantity),
        price: data.price ? parseFloat(data.price) : null,
        minStock: parseInt(data.minStock),
        expiryDate: new Date(data.expiryDate),
      };

      await addMedicine(medicineData);
      
      setSubmitSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        navigate('/medicines');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding medicine:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Add Medicine" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiPackage className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine Added Successfully!</h2>
            <p className="text-gray-600">Redirecting to medicines list...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Add Medicine" />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 dark:from-blue-300 dark:via-purple-400 dark:to-pink-300 drop-shadow-lg">Add Medicine</h2>
              <p className="text-sm text-gray-600 mt-1">Fill in the details below to add a new medicine to your inventory</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-800 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medicine Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine Name *
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <input
                      type="text"
                      {...register('name', { 
                        required: 'Medicine name is required',
                        minLength: { value: 2, message: 'Medicine name must be at least 2 characters' }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter medicine name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Batch Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Number *
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <input
                      type="text"
                      {...register('batchNo', { required: 'Batch number is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.batchNo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter batch number"
                    />
                    {errors.batchNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.batchNo.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <select
                      {...register('type', { required: 'Medicine type is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select type</option>
                      {medicineTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <input
                      type="number"
                      {...register('quantity', { 
                        required: 'Quantity is required',
                        min: { value: 0, message: 'Quantity must be 0 or greater' }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter quantity"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <input
                      type="date"
                      {...register('expiryDate', { required: 'Expiry date is required' })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Price (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Optional)
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', {
                        min: { value: 0, message: 'Price must be 0 or greater' }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter price"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Minimum Stock Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock Level
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <input
                      type="number"
                      {...register('minStock', {
                        min: { value: 1, message: 'Minimum stock must be at least 1' }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.minStock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter minimum stock level"
                    />
                    {errors.minStock && (
                      <p className="mt-1 text-sm text-red-600">{errors.minStock.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter additional notes or description"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FiX className="mr-2" size={16} />
                  Reset
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-bold shadow-lg hover:scale-105 transition-transform duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-400 text-green-600 dark:text-green-400 drop-shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <FiSave className="mr-2" size={16} />
                  )}
                  <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">Add Medicine</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddMedicine;
