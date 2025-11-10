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
    const baseClass = "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group hover-lift relative overflow-hidden";
    
    if (isActive) {
      return `${baseClass} bg-gradient-primary text-white shadow-lg shadow-glow`;
    }
    
    return `${baseClass} text-gray-600 hover:text-white hover:bg-gradient-primary/80 hover:shadow-md`;
  };

  const getIconClass = (item) => {
    const isActive = currentPage === item.id;
    const baseClass = "w-5 h-5 transition-all duration-300";
    
    if (isActive) {
      return `${baseClass} text-white`;
    }
    
    return `${baseClass} text-gray-500 group-hover:text-white`;
  };

  return (
    <div className="w-64 sidebar-gradient h-screen sticky top-0 animate-slideInLeft shadow-xl">
      <div className="p-6">
        {/* Logo/Brand Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">PharmaCare</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 space-y-4">
          <div className="glass-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Stock</p>
                <p className="text-2xl font-bold gradient-text-blue">1,247</p>
              </div>
              <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center shadow-glow floating-animation">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center shadow-glow-orange floating-animation" style={{ animationDelay: '1s' }}>
                <FiClock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6 text-shadow">
            Navigation
          </h3>
          
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={getItemClass(item)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IconComponent className={getIconClass(item)} />
                <span className="font-medium transition-colors duration-300">
                  {item.label}
                </span>
                
                {currentPage === item.id && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6 text-shadow">
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => onPageChange('add-medicine')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-white hover:bg-gradient-green rounded-xl transition-all duration-300 hover-lift group"
            >
              <FiPlus className="w-5 h-5 transition-colors duration-300 group-hover:text-white" />
              <span className="text-sm font-medium">Add Stock</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-white hover:bg-gradient-blue rounded-xl transition-all duration-300 hover-lift group">
              <FiTrendingUp className="w-5 h-5 transition-colors duration-300 group-hover:text-white" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
