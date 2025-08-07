import React from 'react';
import { 
  FiHome, 
  FiPackage, 
  FiPlus, 
  FiClock, 
  FiUser, 
  FiSettings,
  FiTrendingUp,
  FiShoppingCart 
} from 'react-icons/fi';

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiHome,
      color: 'blue'
    },
    {
      id: 'all-medicines',
      label: 'All Medicines',
      icon: FiPackage,
      color: 'green'
    },
    {
      id: 'add-medicine',
      label: 'Add Medicine',
      icon: FiPlus,
      color: 'purple'
    },
    {
      id: 'expiry-tracker',
      label: 'Expiry Tracker',
      icon: FiClock,
      color: 'orange'
    },
    {
      id: 'pharmacy-profile',
      label: 'Pharmacy Profile',
      icon: FiUser,
      color: 'indigo'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: FiSettings,
      color: 'gray'
    }
  ];

  const getItemClass = (item) => {
    const isActive = currentPage === item.id;
    const baseClass = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group hover-lift";
    
    if (isActive) {
      return `${baseClass} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg`;
    }
    
    return `${baseClass} text-gray-600 hover:text-blue-600 hover:bg-blue-50`;
  };

  const getIconClass = (item) => {
    const isActive = currentPage === item.id;
    const baseClass = "w-5 h-5 transition-all duration-300";
    
    if (isActive) {
      return `${baseClass} text-white`;
    }
    
    return `${baseClass} text-gray-500 group-hover:text-blue-500`;
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 shadow-lg h-screen sticky top-0 animate-slideInLeft">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-8 space-y-4">
          <div className="glass-card rounded-lg p-4 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-4 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Navigation
          </h3>
          
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={getItemClass(item)}
              >
                <IconComponent className={getIconClass(item)} />
                <span className="font-medium transition-colors duration-300">
                  {item.label}
                </span>
                
                {currentPage === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <button 
              onClick={() => onPageChange('add-medicine')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span className="text-sm">Add Stock</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <FiTrendingUp className="w-4 h-4" />
              <span className="text-sm">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
