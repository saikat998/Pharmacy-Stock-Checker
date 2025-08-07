import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// Empty medicine data - start fresh
const sampleMedicines = [];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [medicines, setMedicines] = useState(sampleMedicines);
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [pharmacyProfile, setPharmacyProfile] = useState({
    name: '',
    address: '',
    phone: '',
    gstin: '',
    logo: ''
  });

  // Authentication states
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authError, setAuthError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Calculate stats
  const totalMedicines = medicines.length;
  const inStock = medicines.filter(med => med.quantity > 0).length;
  const lowStock = medicines.filter(med => med.quantity < 20).length;
  const expiringSoon = medicines.filter(med => {
    const expiryDate = new Date(med.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  }).length;
  const totalValue = medicines.reduce((sum, med) => sum + (med.price * med.quantity), 0);

  // Authentication functions
  const handleLogin = async (email, password) => {
    try {
      setAuthError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleSignup = async (email, password) => {
    try {
      setAuthError('');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addMedicine = (newMedicine) => {
    const medicine = {
      ...newMedicine,
      id: Date.now(),
    };
    setMedicines([...medicines, medicine]);
    setCurrentPage('medicines');
  };

  const updatePharmacyProfile = (profileData) => {
    setPharmacyProfile(profileData);
    setCurrentPage('dashboard');
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilteredMedicines = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    
    switch (expiryFilter) {
      case 'expired':
        return medicines.filter(med => new Date(med.expiryDate) < today);
      case '30days':
        return medicines.filter(med => {
          const expiryDate = new Date(med.expiryDate);
          return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
        });
      case '90days':
        return medicines.filter(med => {
          const expiryDate = new Date(med.expiryDate);
          return expiryDate >= today && expiryDate <= ninetyDaysFromNow;
        });
      default:
        return medicines.filter(med => {
          const expiryDate = new Date(med.expiryDate);
          return expiryDate <= ninetyDaysFromNow;
        });
    }
  };

  // Authentication form component
  const renderAuthForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-all duration-300">
            <span className="text-4xl">🧪</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Welcome to StockMeds
          </h1>
          <p className="text-blue-200 text-lg mb-2 font-medium">
            Advanced Pharmacy Management System
          </p>
          <p className="text-blue-300/80 text-sm leading-relaxed">
            {authMode === 'login' 
              ? 'Welcome back! Sign in to manage your pharmacy inventory with powerful tools and insights.' 
              : 'Join thousands of pharmacists who trust StockMeds to streamline their operations.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {authMode === 'login' 
                ? 'Access your pharmacy dashboard' 
                : 'Start managing your inventory today'}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const email = formData.get('email');
              const password = formData.get('password');
              
              if (authMode === 'login') {
                handleLogin(email, password);
              } else {
                handleSignup(email, password);
              }
            }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg bg-gray-50/50 hover:bg-white"
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength="6"
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg bg-gray-50/50 hover:bg-white"
                placeholder={authMode === 'login' ? 'Enter your password' : 'Create a password (min. 6 characters)'}
              />
            </div>

            {authError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="font-medium">{authError}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/20"
            >
              {authMode === 'login' ? '🚀 Sign In to Dashboard' : '✨ Create Your Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 text-gray-500 text-sm font-medium">or</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <p className="text-gray-600">
              {authMode === 'login' ? "New to StockMeds?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                }}
                className="text-blue-600 hover:text-blue-700 font-bold ml-2 hover:underline transition-colors"
              >
                {authMode === 'login' ? 'Create free account →' : '← Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-white/90 text-sm font-medium">Smart Analytics</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-white/90 text-sm font-medium">Expiry Tracking</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-white/90 text-sm font-medium">Secure & Reliable</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-blue-200/80 text-sm">
            Trusted by pharmacists worldwide • Built with ❤️ for healthcare
          </p>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>📊 Dashboard</h2>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overview of your pharmacy inventory</p>
              </div>
              <div className={`text-sm px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className={`p-8 rounded-3xl border transition-all hover:shadow-2xl transform hover:scale-105 duration-300 backdrop-blur-sm ${darkMode ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">💊</div>
                  <div className={`text-right`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Total</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{totalMedicines}</p>
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Total Medicines</h3>
                <p className={`text-sm ${darkMode ? 'text-blue-400/70' : 'text-blue-600/70'}`}>Items in inventory</p>
              </div>
              
              <div className={`p-8 rounded-3xl border transition-all hover:shadow-2xl transform hover:scale-105 duration-300 backdrop-blur-sm ${darkMode ? 'bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">📦</div>
                  <div className={`text-right`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-600'}`}>Available</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{inStock}</p>
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>In Stock</h3>
                <p className={`text-sm ${darkMode ? 'text-green-400/70' : 'text-green-600/70'}`}>Ready to dispense</p>
              </div>
              
              <div className={`p-8 rounded-3xl border transition-all hover:shadow-2xl transform hover:scale-105 duration-300 backdrop-blur-sm ${darkMode ? 'bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg">⚠️</div>
                  <div className={`text-right`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>Alert</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{lowStock}</p>
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>Low Stock</h3>
                <p className={`text-sm ${darkMode ? 'text-orange-400/70' : 'text-orange-600/70'}`}>Needs restocking</p>
              </div>
              
              <div className={`p-8 rounded-3xl border transition-all hover:shadow-2xl transform hover:scale-105 duration-300 backdrop-blur-sm ${darkMode ? 'bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/50' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">📅</div>
                  <div className={`text-right`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-600'}`}>Urgent</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{expiringSoon}</p>
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Expiring Soon</h3>
                <p className={`text-sm ${darkMode ? 'text-red-400/70' : 'text-red-600/70'}`}>Next 30 days</p>
              </div>
            </div>

            {/* Total Value Card */}
            <div className={`p-8 rounded-3xl mb-12 text-white shadow-2xl transform hover:scale-105 transition-all duration-500 ${darkMode ? 'bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800' : 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <span className="text-3xl mr-3 p-2 bg-white/20 rounded-2xl backdrop-blur-sm">💰</span>
                    Total Inventory Value
                  </h3>
                  <p className="text-5xl font-bold mb-2">₹{totalValue.toFixed(2)}</p>
                  <p className="text-purple-200 text-lg">Total worth of all medicines</p>
                </div>
                <div className="text-6xl opacity-20">📈</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-3xl shadow-2xl p-8 backdrop-blur-sm ${darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <span className="text-3xl mr-3 p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">📋</span>
                  Recent Medicines
                </h3>
                <button 
                  onClick={() => setCurrentPage('medicines')}
                  className={`text-sm px-4 py-2 rounded-xl transition-all hover:shadow-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {medicines.length === 0 ? (
                  <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="text-6xl mb-4 opacity-50">💊</div>
                    <p className="text-xl font-semibold mb-2">No medicines in inventory</p>
                    <p className="text-lg mb-6">Add your first medicine to get started!</p>
                    <button 
                      onClick={() => setCurrentPage('add')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-lg"
                    >
                      Add Your First Medicine
                    </button>
                  </div>
                ) : (
                  medicines.slice(0, 5).map(medicine => (
                    <div key={medicine.id} className={`flex justify-between items-center p-6 rounded-2xl transition-all hover:shadow-lg transform hover:scale-[1.02] duration-300 ${darkMode ? 'bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/50' : 'bg-gray-50/80 border border-gray-200/50 hover:bg-gray-100/80'}`}>
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">💊</div>
                        <div>
                          <p className={`font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{medicine.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{medicine.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Qty: {medicine.quantity}</p>
                        <p className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₹{medicine.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'medicines':
        return (
          <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className={`text-4xl font-bold mb-2 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <span className="text-4xl mr-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">💊</span>
                  All Medicines
                </h2>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your complete inventory</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-12 pr-4 py-4 border rounded-2xl w-80 text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-sm' 
                    : 'bg-white/80 border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-sm shadow-lg'}`}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</div>
              </div>
            </div>
            
            <div className={`rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                  <tr>
                    <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Medicine</th>
                    <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Category</th>
                    <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quantity</th>
                    <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Price</th>
                    <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Expiry Date</th>
                    <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={`px-8 py-16 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="text-6xl mb-4 opacity-50">🔍</div>
                        <div className="text-xl font-semibold">No medicines found</div>
                        <div className="text-lg mt-2 mb-6">
                          {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first medicine to the inventory.'}
                        </div>
                        <button 
                          onClick={() => setCurrentPage('add')}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-lg"
                        >
                          Add Medicine
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map(medicine => {
                      const isLowStock = medicine.quantity < 20;
                      const isExpiringSoon = new Date(medicine.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      
                      return (
                        <tr key={medicine.id} className={`transition-all duration-200 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/80'}`}>
                          <td className={`px-8 py-6 whitespace-nowrap`}>
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">💊</div>
                              <div className={`font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{medicine.name}</div>
                            </div>
                          </td>
                          <td className={`px-8 py-6 whitespace-nowrap text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{medicine.category}</td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className={`text-lg font-semibold px-3 py-1 rounded-lg ${isLowStock ? 'text-red-400 bg-red-900/20' : darkMode ? 'text-gray-300 bg-gray-700/50' : 'text-gray-800 bg-gray-100'}`}>
                              {medicine.quantity}
                            </span>
                          </td>
                          <td className={`px-8 py-6 whitespace-nowrap text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₹{medicine.price}</td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className={`text-lg ${isExpiringSoon ? 'text-red-400 font-bold' : darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              {medicine.expiryDate}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex gap-2">
                              {isLowStock && <span className={`px-3 py-2 rounded-xl text-sm font-semibold ${darkMode ? 'bg-red-900/30 text-red-400 border border-red-700/50' : 'bg-red-100 text-red-800 border border-red-200'}`}>Low Stock</span>}
                              {isExpiringSoon && <span className={`px-3 py-2 rounded-xl text-sm font-semibold ${darkMode ? 'bg-orange-900/30 text-orange-400 border border-orange-700/50' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>Expiring</span>}
                              {!isLowStock && !isExpiringSoon && <span className={`px-3 py-2 rounded-xl text-sm font-semibold ${darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-800 border border-green-200'}`}>Good</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'add':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className={`text-4xl font-bold mb-2 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                <span className="text-4xl mr-4 p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg">➕</span>
                Add New Medicine
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add medicines to your inventory</p>
            </div>
            
            <div className={`rounded-3xl shadow-2xl p-8 backdrop-blur-sm ${darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'}`}>
              <form 
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newMedicine = {
                    name: formData.get('name'),
                    category: formData.get('category'),
                    quantity: parseInt(formData.get('quantity')),
                    price: parseFloat(formData.get('price')),
                    expiryDate: formData.get('expiryDate'),
                    supplier: formData.get('supplier'),
                    batchNumber: formData.get('batchNumber')
                  };
                  addMedicine(newMedicine);
                  e.target.reset();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Medicine Name *
                    </label>
                    <input 
                      name="name"
                      type="text" 
                      placeholder="Enter medicine name" 
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    <select 
                      name="category"
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    >
                      <option value="">Select Category</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Anti-inflammatory">Anti-inflammatory</option>
                    <option value="Antipyretic">Antipyretic</option>
                    <option value="Antacid">Antacid</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Hypertension">Hypertension</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Minerals">Minerals</option>
                    <option value="Herbal / Ayurvedic">Herbal / Ayurvedic</option>
                    <option value="Skin / Dermatology">Skin / Dermatology</option>
                    <option value="Eye Care">Eye Care</option>
                    <option value="Pediatric">Pediatric</option>
                    <option value="Antiseptic">Antiseptic</option>
                    <option value="Laxative">Laxative</option>
                    <option value="Immunity Boosters">Immunity Boosters</option>
                    <option value="Cancer / Oncology">Cancer / Oncology</option>
                    <option value="Tuberculosis">Tuberculosis</option>
                    <option value="HIV / Antiviral">HIV / Antiviral</option>
                    <option value="Asthma">Asthma</option>
                    <option value="Allergy">Allergy</option>
                    <option value="Thyroid">Thyroid</option>
                    <option value="COVID-19 Related">COVID-19 Related</option>
                    <option value="Homeopathy">Homeopathy</option>
                    <option value="Protein Supplements">Protein Supplements</option>
                    <option value="Dental / Oral Care">Dental / Oral Care</option>
                    <option value="Pregnancy / Women's Health">Pregnancy / Women's Health</option>
                    <option value="Endocrine / Hormonal">Endocrine / Hormonal</option>
                    <option value="Musculoskeletal">Musculoskeletal</option>
                    <option value="Hematologic / Blood Disorders">Hematologic / Blood Disorders</option>
                    <option value="Renal / Urinary">Renal / Urinary</option>
                    <option value="Antiemetic">Antiemetic</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Quantity *
                    </label>
                    <input 
                      name="quantity"
                      type="number" 
                      placeholder="Enter quantity" 
                      required
                      min="1"
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Price (₹) *
                    </label>
                    <input 
                      name="price"
                      type="number" 
                      step="0.01"
                      placeholder="Enter price" 
                      required
                      min="0"
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Expiry Date *
                    </label>
                    <input 
                      name="expiryDate"
                      type="date" 
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Supplier *
                    </label>
                    <input 
                      name="supplier"
                      type="text" 
                      placeholder="Enter supplier name" 
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Batch Number *
                    </label>
                    <input 
                      name="batchNumber"
                      type="text" 
                      placeholder="Enter batch number" 
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
                  >
                    Add Medicine
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage('medicines')}
                    className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'pharmacy-details':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className={`text-4xl font-bold mb-2 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                <span className="text-4xl mr-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">🏥</span>
                Pharmacy Details
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your pharmacy information</p>
            </div>
            
            <div className={`rounded-3xl shadow-2xl p-8 backdrop-blur-sm ${darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'}`}>
              <form 
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const profileData = {
                    name: formData.get('name'),
                    address: formData.get('address'),
                    phone: formData.get('phone'),
                    gstin: formData.get('gstin'),
                    logo: formData.get('logo')
                  };
                  updatePharmacyProfile(profileData);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Pharmacy Name *
                    </label>
                    <input 
                      name="name"
                      type="text" 
                      placeholder="Enter pharmacy name" 
                      defaultValue={pharmacyProfile.name}
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Complete Address *
                    </label>
                    <textarea 
                      name="address"
                      placeholder="Enter complete address" 
                      defaultValue={pharmacyProfile.address}
                      required
                      rows="3"
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none resize-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number *
                    </label>
                    <input 
                      name="phone"
                      type="tel" 
                      placeholder="Enter phone number" 
                      defaultValue={pharmacyProfile.phone}
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      GSTIN / License Number *
                    </label>
                    <input 
                      name="gstin"
                      type="text" 
                      placeholder="Enter GSTIN or license number" 
                      defaultValue={pharmacyProfile.gstin}
                      required
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Logo Upload (Optional)
                    </label>
                    <input 
                      name="logo"
                      type="file" 
                      accept="image/*"
                      className={`w-full p-4 border rounded-2xl text-lg transition-all duration-300 focus:ring-4 focus:outline-none ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'}`}
                    />
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload your pharmacy logo (JPG, PNG)
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'expiry':
        return (
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className={`text-4xl font-bold mb-2 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                <span className="text-4xl mr-4 p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">📅</span>
                Expiry Tracker
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monitor medicine expiry dates</p>
            </div>
            
            {/* Expiry Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div 
                className={`p-8 rounded-3xl border cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm ${
                  expiryFilter === 'expired' 
                    ? darkMode 
                      ? 'bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/50 shadow-2xl' 
                      : 'bg-gradient-to-br from-red-100 to-red-200 border-red-300 shadow-2xl'
                    : darkMode 
                      ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/30 hover:border-red-600/50' 
                      : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:border-red-300'
                }`}
                onClick={() => setExpiryFilter(expiryFilter === 'expired' ? 'all' : 'expired')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">💀</div>
                  <div className="text-right">
                    <p className={`text-5xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {medicines.filter(med => new Date(med.expiryDate) < new Date()).length}
                    </p>
                  </div>
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Expired</h3>
                <p className={`text-sm ${darkMode ? 'text-red-400/70' : 'text-red-600/70'}`}>Medicines already expired</p>
              </div>
              
              <div 
                className={`p-8 rounded-3xl border cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm ${
                  expiryFilter === '30days' 
                    ? darkMode 
                      ? 'bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50 shadow-2xl' 
                      : 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 shadow-2xl'
                    : darkMode 
                      ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/30 hover:border-orange-600/50' 
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300'
                }`}
                onClick={() => setExpiryFilter(expiryFilter === '30days' ? 'all' : '30days')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg">⚠️</div>
                  <div className="text-right">
                    <p className={`text-5xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{expiringSoon}</p>
                  </div>
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>Expiring in 30 days</h3>
                <p className={`text-sm ${darkMode ? 'text-orange-400/70' : 'text-orange-600/70'}`}>Critical attention needed</p>
              </div>
              
              <div 
                className={`p-8 rounded-3xl border cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm ${
                  expiryFilter === '90days' 
                    ? darkMode 
                      ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700/50 shadow-2xl' 
                      : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 shadow-2xl'
                    : darkMode 
                      ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-700/30 hover:border-yellow-600/50' 
                      : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300'
                }`}
                onClick={() => setExpiryFilter(expiryFilter === '90days' ? 'all' : '90days')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-lg">⏰</div>
                  <div className="text-right">
                    <p className={`text-5xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {medicines.filter(med => {
                        const expiryDate = new Date(med.expiryDate);
                        const ninetyDaysFromNow = new Date();
                        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
                        return expiryDate <= ninetyDaysFromNow;
                      }).length}
                    </p>
                  </div>
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Expiring in 90 days</h3>
                <p className={`text-sm ${darkMode ? 'text-yellow-400/70' : 'text-yellow-600/70'}`}>Plan for restocking</p>
              </div>
            </div>

            {/* Filter Status */}
            {expiryFilter !== 'all' && (
              <div className="mb-8 flex items-center gap-4">
                <span className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Showing: {
                    expiryFilter === 'expired' ? 'Expired Medicines' :
                    expiryFilter === '30days' ? 'Medicines Expiring in 30 Days' :
                    expiryFilter === '90days' ? 'Medicines Expiring in 90 Days' : 'All'
                  }
                </span>
                <button
                  onClick={() => setExpiryFilter('all')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Show All
                </button>
              </div>
            )}

            {/* Expiring Medicines List */}
            <div className={`rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
              <div className={`p-8 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {expiryFilter === 'expired' ? 'Expired Medicines' :
                   expiryFilter === '30days' ? 'Medicines Expiring in 30 Days' :
                   expiryFilter === '90days' ? 'Medicines Expiring in 90 Days' :
                   'Medicines Expiring Soon'}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                    <tr>
                      <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Medicine</th>
                      <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quantity</th>
                      <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Expiry Date</th>
                      <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Days Left</th>
                      <th className={`px-8 py-6 text-left text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Priority</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                    {getFilteredMedicines().length === 0 ? (
                      <tr>
                        <td colSpan="5" className={`px-8 py-16 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>💊</div>
                          <div className="text-lg font-medium mb-2">No medicines found</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {expiryFilter === 'expired' && 'No medicines have expired yet.'}
                            {expiryFilter === '30days' && 'No medicines expiring in the next 30 days.'}
                            {expiryFilter === '90days' && 'No medicines expiring in the next 90 days.'}
                            {expiryFilter === 'all' && 'All medicines are in good condition.'}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      getFilteredMedicines()
                        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
                        .map(medicine => {
                          const expiryDate = new Date(medicine.expiryDate);
                          const today = new Date();
                          const diffTime = expiryDate - today;
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          
                          const priorityColors = darkMode ? {
                            expired: 'bg-red-500/20 text-red-300 border border-red-500/30',
                            critical: 'bg-red-500/20 text-red-300 border border-red-500/30',
                            high: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                            medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
                            low: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          } : {
                            expired: 'bg-red-100 text-red-800',
                            critical: 'bg-red-100 text-red-800',
                            high: 'bg-orange-100 text-orange-800',
                            medium: 'bg-yellow-100 text-yellow-800',
                            low: 'bg-green-100 text-green-800'
                          };

                          let priorityColor = priorityColors.low;
                          let priority = 'Low';
                          
                          if (diffDays < 0) {
                            priorityColor = priorityColors.expired;
                            priority = 'EXPIRED';
                          } else if (diffDays <= 7) {
                            priorityColor = priorityColors.critical;
                            priority = 'Critical';
                          } else if (diffDays <= 30) {
                            priorityColor = priorityColors.high;
                            priority = 'High';
                          } else if (diffDays <= 90) {
                            priorityColor = priorityColors.medium;
                            priority = 'Medium';
                          }
                          
                          return (
                            <tr key={medicine.id} className={`transition-all duration-200 ${darkMode 
                              ? 'hover:bg-gray-700/50' 
                              : 'hover:bg-gray-50'}`}>
                              <td className={`px-8 py-6 whitespace-nowrap ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                <div>
                                  <div className="font-medium">{medicine.name}</div>
                                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{medicine.category}</div>
                                </div>
                              </td>
                              <td className={`px-8 py-6 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{medicine.quantity}</td>
                              <td className={`px-8 py-6 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{medicine.expiryDate}</td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`font-semibold ${
                                  diffDays < 0 ? 'text-red-400' : 
                                  diffDays <= 30 ? 'text-amber-400' : 
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {diffDays < 0 ? 'EXPIRED' : `${diffDays} days`}
                                </span>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`px-4 py-2 text-sm font-bold rounded-full uppercase tracking-wider ${priorityColor}`}>
                                  {priority}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{currentPage}</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">This page is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Show loading spinner */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4 shadow-lg"></div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Loading your pharmacy...</p>
          </div>
        </div>
      )}

      {/* Show auth form if not logged in */}
      {!loading && !user && renderAuthForm()}

      {/* Show main app if logged in */}
      {!loading && user && (
        <>
          {/* Header */}
          <header className={`${darkMode ? 'bg-gray-800/80 border-gray-700 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl border-gray-200'} shadow-lg border-b sticky top-0 z-50`}>
            <div className="px-8 py-5 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-3xl p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">🧪</div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">StockMeds</h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Advanced Stock Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                
                {/* Profile Avatar Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-105 shadow-lg ${
                      darkMode 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-700 border-blue-500/50 hover:border-blue-400' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 hover:border-blue-300'
                    }`}
                    title="Profile Menu"
                  >
                    <div className="text-2xl">👨‍⚕️</div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${
                      darkMode 
                        ? 'bg-gray-800/90 border-gray-700/50' 
                        : 'bg-white/90 border-gray-200/50'
                    }`}>
                      <div className="p-6">
                        {/* User Info Header */}
                        <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-opacity-20">
                          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                            darkMode 
                              ? 'bg-gradient-to-br from-blue-600 to-purple-700 border-blue-500/50' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400'
                          }`}>
                            <div className="text-3xl">👨‍⚕️</div>
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {pharmacyProfile.name || 'Pharmacy Manager'}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        
                        {/* Profile Details */}
                        <div className="space-y-3 mb-4">
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Pharmacy Name
                            </p>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {pharmacyProfile.name || 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Phone
                            </p>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {pharmacyProfile.phone || 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              License
                            </p>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {pharmacyProfile.gstin || 'Not set'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setCurrentPage('pharmacy-details');
                              setShowProfileDropdown(false);
                            }}
                            className={`w-full p-3 rounded-xl font-medium transition-all duration-300 ${
                              darkMode 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            Edit Profile
                          </button>
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowProfileDropdown(false);
                            }}
                            className={`w-full p-3 rounded-xl font-medium transition-all duration-300 ${
                              darkMode 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar */}
            <div className={`w-72 ${darkMode ? 'bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700' : 'bg-gradient-to-b from-white/90 to-gray-50/90 backdrop-blur-xl border-gray-200'} shadow-2xl h-screen border-r`}>
              <nav className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`w-full text-left p-4 rounded-2xl mb-3 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                      currentPage === 'dashboard' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-md'
                    }`}
                  >
                    <span className="text-xl">📊</span>
                    <span className="font-medium">Dashboard</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('medicines')}
                    className={`w-full text-left p-4 rounded-2xl mb-3 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                      currentPage === 'medicines' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-md'
                    }`}
                  >
                    <span className="text-xl">💊</span>
                    <span className="font-medium">All Medicines</span>
                  </button>
                <button
                  onClick={() => setCurrentPage('add')}
                  className={`w-full text-left p-4 rounded-2xl mb-3 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                    currentPage === 'add' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">➕</span>
                  <span className="font-medium">Add Medicine</span>
                </button>
                <button
                  onClick={() => setCurrentPage('expiry')}
                  className={`w-full text-left p-4 rounded-2xl mb-3 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${
                    currentPage === 'expiry' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">📅</span>
                  <span className="font-medium">Expiry Tracker</span>
                </button>
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="min-h-full backdrop-blur-sm">
                {renderPage()}
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
