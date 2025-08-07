import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiSave, FiEdit3, FiUser, FiMail, FiPhone, FiMapPin, FiCamera } from 'react-icons/fi';
import Header from '../components/Header';
import { usePharmacy } from '../context/PharmacyContext';

const PharmacyProfile = () => {
  const { pharmacyInfo, updatePharmacyInfo } = usePharmacy();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: pharmacyInfo
  });

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updatePharmacyInfo(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating pharmacy info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset(pharmacyInfo);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Pharmacy Profile" />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Pharmacy Information</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your pharmacy details and contact information</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {isEditing ? (
                // Edit Form
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Logo Upload Section */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FiCamera className="text-white" size={24} />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Change Logo
                      </button>
                      <p className="text-sm text-gray-500 mt-1">Upload a new logo for your pharmacy</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pharmacy Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pharmacy Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Pharmacy name is required' })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter pharmacy name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Name *
                      </label>
                      <input
                        type="text"
                        {...register('owner', { required: 'Owner name is required' })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.owner ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter owner name"
                      />
                      {errors.owner && (
                        <p className="mt-1 text-sm text-red-600">{errors.owner.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      {...register('address', { required: 'Address is required' })}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter complete address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <FiSave className="mr-2" size={16} />
                      )}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                // Display Mode
                <div className="space-y-8">
                  {/* Logo and Basic Info */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FiUser className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {pharmacyInfo.name || 'Pharmacy Name'}
                      </h3>
                      <p className="text-lg text-gray-600">
                        Owner: {pharmacyInfo.owner || 'Owner Name'}
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiPhone className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-lg font-medium text-gray-900">
                            {pharmacyInfo.phone || 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FiMail className="text-green-600" size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-lg font-medium text-gray-900">
                            {pharmacyInfo.email || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FiMapPin className="text-purple-600" size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-lg font-medium text-gray-900">
                            {pharmacyInfo.address || 'Address not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-900 mb-2">Business Hours</h4>
                      <p className="text-blue-700">Mon-Sat: 9:00 AM - 9:00 PM</p>
                      <p className="text-blue-700">Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                      <h4 className="font-semibold text-green-900 mb-2">Services</h4>
                      <p className="text-green-700">Prescription Filling</p>
                      <p className="text-green-700">Health Consultations</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                      <h4 className="font-semibold text-purple-900 mb-2">Established</h4>
                      <p className="text-purple-700">Since 2020</p>
                      <p className="text-purple-700">Serving Community</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyProfile;
