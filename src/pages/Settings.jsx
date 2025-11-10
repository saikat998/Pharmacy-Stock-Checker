import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSettings, 
  FiBell, 
  FiDownload, 
  FiUpload, 
  FiMoon, 
  FiSun,
  FiToggleLeft,
  FiToggleRight,
  FiSave
} from 'react-icons/fi';
import Header from '../components/Header';
import { usePharmacy } from '../context/PharmacyContext';
import { generateCSV } from '../utils/medicineUtils';

const Settings = () => {
  const { medicines } = usePharmacy();
  const [settings, setSettings] = useState({
    notifications: {
      expiryAlerts: true,
      stockAlerts: true,
      emailNotifications: false,
      pushNotifications: true,
    },
    preferences: {
      darkMode: false,
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      currency: 'USD',
    },
    alerts: {
      expiryWarningDays: 30,
      lowStockThreshold: 10,
      autoAlerts: true,
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleValueChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleExportData = () => {
    const csv = generateCSV(medicines);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pharmacy-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SettingSection = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="flex items-center">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Notifications Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SettingSection title="🔔 Notification Settings">
              <SettingItem
                label="Expiry Alerts"
                description="Get notified about medicines nearing expiry"
              >
                <ToggleSwitch
                  enabled={settings.notifications.expiryAlerts}
                  onToggle={() => handleToggle('notifications', 'expiryAlerts')}
                />
              </SettingItem>

              <SettingItem
                label="Stock Alerts"
                description="Get notified about low stock levels"
              >
                <ToggleSwitch
                  enabled={settings.notifications.stockAlerts}
                  onToggle={() => handleToggle('notifications', 'stockAlerts')}
                />
              </SettingItem>

              <SettingItem
                label="Email Notifications"
                description="Receive alerts via email"
              >
                <ToggleSwitch
                  enabled={settings.notifications.emailNotifications}
                  onToggle={() => handleToggle('notifications', 'emailNotifications')}
                />
              </SettingItem>

              <SettingItem
                label="Push Notifications"
                description="Browser push notifications"
              >
                <ToggleSwitch
                  enabled={settings.notifications.pushNotifications}
                  onToggle={() => handleToggle('notifications', 'pushNotifications')}
                />
              </SettingItem>
            </SettingSection>
          </motion.div>

          {/* Alert Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SettingSection title="⚠️ Alert Preferences">
              <SettingItem
                label="Expiry Warning Days"
                description="Days before expiry to show warnings"
              >
                <select
                  value={settings.alerts.expiryWarningDays}
                  onChange={(e) => handleValueChange('alerts', 'expiryWarningDays', parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={7}>7 days</option>
                  <option value={15}>15 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                </select>
              </SettingItem>

              <SettingItem
                label="Low Stock Threshold"
                description="Minimum quantity before low stock alert"
              >
                <select
                  value={settings.alerts.lowStockThreshold}
                  onChange={(e) => handleValueChange('alerts', 'lowStockThreshold', parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 items</option>
                  <option value={10}>10 items</option>
                  <option value={15}>15 items</option>
                  <option value={20}>20 items</option>
                </select>
              </SettingItem>

              <SettingItem
                label="Auto Alerts"
                description="Automatically generate daily alert reports"
              >
                <ToggleSwitch
                  enabled={settings.alerts.autoAlerts}
                  onToggle={() => handleToggle('alerts', 'autoAlerts')}
                />
              </SettingItem>
            </SettingSection>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SettingSection title="🎨 Appearance & Preferences">


              <SettingItem
                label="Language"
                description="Choose your preferred language"
              >
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleValueChange('preferences', 'language', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </SettingItem>

              <SettingItem
                label="Date Format"
                description="How dates are displayed"
              >
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(e) => handleValueChange('preferences', 'dateFormat', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </SettingItem>

              <SettingItem
                label="Currency"
                description="Default currency for pricing"
              >
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => handleValueChange('preferences', 'currency', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </SettingItem>
            </SettingSection>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SettingSection title="💾 Data Management">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiDownload size={16} />
                  <span>Export All Data</span>
                </button>

                <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiUpload size={16} />
                  <span>Import Data</span>
                </button>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Data export includes all medicines, expiry dates, and inventory information. 
                  Keep your exports secure and backed up regularly.
                </p>
              </div>
            </SettingSection>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FiSave size={16} />
              <span>Save All Settings</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
