import React, { useState, useEffect } from 'react';
import AuthForm from './pages/Auth';
import { auth, } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import Contact from './pages/Contact';
import PharmacyProfile from './pages/PharmacyProfile';
import { usePharmacy } from './context/PharmacyContext';

// Empty medicine data - start fresh
const sampleMedicines = [];

function App() {
  // State hooks
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  // Force light mode across the app
  const darkMode = false;
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('all');
  // Use pharmacy info from context so updates in PharmacyProfile reflect here
  const { pharmacyInfo } = usePharmacy();
  const [expiryTab, setExpiryTab] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Authentication logic
  const handleAuth = async (email, password) => {
    if (authMode === 'login') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser({ email: userCredential.user.email });
        setAuthError('');
      } catch (error) {
        setAuthError(error.message);
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser({ email: userCredential.user.email });
        setAuthError('');
      } catch (error) {
        setAuthError(error.message);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Helper: Render main page content
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': {
        // --- Dashboard Page ---
        const totalMedicines = medicines.length;
        const inStock = medicines.filter(m => m.quantity > 0).length;
        const lowStock = medicines.filter(m => m.quantity > 0 && m.quantity < 20).length;
        const expiringSoon = medicines.filter(m => {
          const expiry = new Date(m.expiryDate);
          return expiry <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && expiry > new Date();
        }).length;
        const inventoryValue = medicines.reduce((sum, m) => sum + (m.price * m.quantity), 0);
        const recentMedicines = medicines.slice(-5).reverse();
        return (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-2">PharmaCare – Advanced Stock Management</h2>
              <p className="text-gray-400 text-lg">Dashboard</p>
            </div>
            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }} transition={{ staggerChildren: 0.15 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-700 to-blue-400 rounded-2xl p-6 shadow-xl flex flex-col items-center">
                <div className="text-4xl mb-2">💊</div>
                <div className="text-lg font-semibold text-white">Total Medicines</div>
                <div className="text-2xl font-bold text-white">{totalMedicines}</div>
                <div className="text-sm text-blue-200">Items in inventory</div>
              </div>
              <div className="bg-gradient-to-br from-green-700 to-green-400 rounded-2xl p-6 shadow-xl flex flex-col items-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-lg font-semibold text-white">In Stock</div>
                <div className="text-2xl font-bold text-white">{inStock}</div>
                <div className="text-sm text-green-200">Ready to dispense</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl p-6 shadow-xl flex flex-col items-center">
                <div className="text-4xl mb-2">⚠️</div>
                <div className="text-lg font-semibold text-white">Low Stock</div>
                <div className="text-2xl font-bold text-white">{lowStock}</div>
                <div className="text-sm text-yellow-200">Needs restocking</div>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-pink-400 rounded-2xl p-6 shadow-xl flex flex-col items-center">
                <div className="text-4xl mb-2">📅</div>
                <div className="text-lg font-semibold text-white">Expiring Soon</div>
                <div className="text-2xl font-bold text-white">{expiringSoon}</div>
                <div className="text-sm text-pink-200">Next 30 days</div>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-700 to-purple-400 rounded-2xl shadow-xl p-6 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2 text-2xl text-white">💰 <span className="font-bold">Total Inventory Value</span></div>
                <div className="text-3xl font-bold text-white">₹{inventoryValue.toFixed(2)}</div>
                <div className="text-sm text-purple-200">Total worth of all medicines</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-2 text-2xl text-white">📋 <span className="font-bold">Recent Medicines</span></div>
                {recentMedicines.length === 0 ? (
                  <div className="text-gray-400 text-center py-6 flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">💊</span>
                    <span>No medicines in inventory</span>
                    <span>Add your first medicine to get started!</span>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {recentMedicines.map(m => (
                      <li key={m.id} className="flex justify-between items-center px-2 py-1 rounded-lg bg-blue-900/30">
                        <span className="font-semibold text-white">{m.name}</span>
                        <span className="text-xs text-blue-200">Qty: {m.quantity}</span>
                        <span className="text-xs text-blue-200">Exp: {m.expiryDate}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button className="mt-4 text-purple-400 font-semibold underline" onClick={() => setCurrentPage('medicines')}>View All</button>
              </div>
            </div>
          </motion.div>
        );
      }
      case 'medicines': {
        // --- Medicines List Page ---
        const getStatus = m => {
          const expiryDate = new Date(m.expiryDate);
          const today = new Date();
          const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          if (diffDays < 0) return 'Expired';
          if (diffDays <= 30) return 'Expiring Soon';
          if (m.quantity < 20) return 'Low Stock';
          return 'Good';
        };
        return (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6 max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">💊 All Medicines</h2>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search medicines…"
                className="p-3 border rounded-xl bg-gray-900 text-white w-full md:w-1/3 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <table className="w-full rounded-2xl overflow-hidden shadow-xl">
              <thead className="bg-gray-900 text-purple-300">
                <tr>
                  <th className="p-3 text-left">Medicine</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-12 text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-5xl mb-4">🔍</span>
                        <span className="mb-2">No medicines found – Start by adding your first medicine to the inventory.</span>
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg mt-4" onClick={() => setCurrentPage('add')}>Add Medicine</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                    <tr key={m.id} className="hover:bg-gray-800">
                      <td className="p-3 font-semibold text-white">{m.name}</td>
                      <td className="p-3 text-white">{m.category}</td>
                      <td className="p-3 text-white">{m.quantity}</td>
                      <td className="p-3 text-white">₹{m.price}</td>
                      <td className="p-3 text-white">{m.expiryDate}</td>
                      <td className="p-3 font-semibold text-purple-300">{getStatus(m)}</td>
                      <td className="p-3">
                        <button className="text-blue-400 hover:text-blue-600 font-semibold mr-2" onClick={() => alert('Edit feature coming soon!')}>Edit</button>
                        <button className="text-red-400 hover:text-red-600 font-semibold" onClick={() => setMedicines(medicines.filter(x => x.id !== m.id))}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        );
      }
      case 'add': {
        // --- Add New Medicine Page ---
        const categories = [
          'Analgesics (Pain relievers)',
          'Antipyretics',
          'Antibiotics',
          'Antivirals',
          'Antifungals',
          'Antiparasitics',
          'Anti-inflammatory drugs',
          'Antacids & Antiulcer drugs',
          'Antiemetics',
          'Antihistamines',
          'Antidepressants',
          'Antipsychotics',
          'Anxiolytics',
          'Anticonvulsants',
          'Bronchodilators',
          'Hormones & Hormone replacements',
          'Cardiovascular drugs',
          'Diuretics',
          'Anticoagulants',
          'Immunosuppressants',
          'Chemotherapeutic agents',
          'Vaccines',
          'Enzyme inhibitors',
          'Receptor blockers',
          'Ion channel blockers',
          'Hormone agonists/antagonists',
          'Penicillins',
          'Cephalosporins',
          'Macrolides',
          'Benzodiazepines',
          'Steroids',
          'Over-the-Counter (OTC) drugs',
          'Prescription drugs (Rx)',
          'Controlled substances',
          'Other'
        ];
        return (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6 max-w-xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">➕ Add New Medicine</h2>
              <p className="text-gray-400 text-lg">Add medicines to your inventory</p>
            </div>
            <form
              className="space-y-6 bg-gray-900 rounded-2xl shadow-xl p-8"
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newMedicine = {
                  id: Date.now(),
                  name: formData.get('name'),
                  category: formData.get('category'),
                  batchNo: formData.get('batchNo'),
                  supplier: formData.get('supplier'),
                  quantity: parseInt(formData.get('quantity')),
                  price: parseFloat(formData.get('price')),
                  expiryDate: formData.get('expiryDate'),
                };
                setMedicines([...medicines, newMedicine]);
                setCurrentPage('medicines');
              }}
            >
              <div>
                <label className="block font-semibold mb-2 text-white">Medicine Name *</label>
                <input name="name" type="text" required placeholder="Enter medicine name" className="w-full p-3 border rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-white">Category *</label>
                <select name="category" required className="w-full p-3 border rounded-xl bg-gray-800 text-white">
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-white">Quantity *</label>
                <input name="quantity" type="number" min="0" required placeholder="Enter quantity" className="w-full p-3 border rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-white">Price (₹) *</label>
                <input name="price" type="number" min="0" step="0.01" required placeholder="Enter price" className="w-full p-3 border rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-white">Expiry Date *</label>
                <input name="expiryDate" type="date" required className="w-full p-3 border rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-white">Supplier *</label>
                <input name="supplier" type="text" required placeholder="Enter supplier name" className="w-full p-3 border rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-white">Batch Number *</label>
                <input name="batchNo" type="text" required placeholder="Enter batch number" className="w-full p-3 border rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg">Add Medicine</button>
                <button type="button" onClick={() => setCurrentPage('medicines')} className="bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            </form>
          </motion.div>
        );
      }
      case 'expiry': {
        // --- Expiry Tracker Page ---
        const expired = medicines.filter(m => new Date(m.expiryDate) < new Date()).length;
        const expiring30 = medicines.filter(m => {
          const expiry = new Date(m.expiryDate);
          return expiry > new Date() && expiry <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }).length;
        const expiring90 = medicines.filter(m => {
          const expiry = new Date(m.expiryDate);
          return expiry > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && expiry <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        }).length;
        let filteredMedicines = medicines;
        if (expiryTab === 'expired') {
          filteredMedicines = medicines.filter(m => new Date(m.expiryDate) < new Date());
        } else if (expiryTab === '30') {
          filteredMedicines = medicines.filter(m => {
            const expiry = new Date(m.expiryDate);
            return expiry > new Date() && expiry <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          });
        } else if (expiryTab === '90') {
          filteredMedicines = medicines.filter(m => {
            const expiry = new Date(m.expiryDate);
            return expiry > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && expiry <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
          });
        }
        return (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">📅 Expiry Tracker</h2>
              <p className="text-gray-400 text-lg">Monitor medicine expiry dates</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button className={`bg-gradient-to-br from-red-700 to-red-400 rounded-2xl p-6 shadow-xl flex flex-col items-center w-full transition-all duration-200 ${expiryTab === 'expired' ? 'ring-4 ring-red-400' : ''}`} onClick={() => setExpiryTab('expired')}>
                <div className="text-4xl mb-2">💀</div>
                <div className="text-lg font-semibold text-white">Expired</div>
                <div className="text-2xl font-bold text-white">{expired}</div>
                <div className="text-sm text-red-200">Medicines already expired</div>
              </button>
              <button className={`bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl p-6 shadow-xl flex flex-col items-center w-full transition-all duration-200 ${expiryTab === '30' ? 'ring-4 ring-yellow-400' : ''}`} onClick={() => setExpiryTab('30')}>
                <div className="text-4xl mb-2">⚠️</div>
                <div className="text-lg font-semibold text-white">Expiring in 30 Days</div>
                <div className="text-2xl font-bold text-white">{expiring30}</div>
                <div className="text-sm text-yellow-200">Critical attention needed</div>
              </button>
              <button className={`bg-gradient-to-br from-yellow-400 to-orange-300 rounded-2xl p-6 shadow-xl flex flex-col items-center w-full transition-all duration-200 ${expiryTab === '90' ? 'ring-4 ring-orange-400' : ''}`} onClick={() => setExpiryTab('90')}>
                <div className="text-4xl mb-2">⏰</div>
                <div className="text-lg font-semibold text-white">Expiring in 90 Days</div>
                <div className="text-2xl font-bold text-white">{expiring90}</div>
                <div className="text-sm text-orange-200">Plan for restocking</div>
              </button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-600 text-lg">Showing: {expiryTab === 'expired' ? 'Expired Medicines' : expiryTab === '30' ? 'Expiring in 30 Days' : expiryTab === '90' ? 'Expiring in 90 Days' : 'All Medicines'}</span>
              <button className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-2 rounded-xl font-semibold shadow" onClick={() => setExpiryTab('all')}>Show All</button>
            </div>
            <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
              <table className="w-full rounded-2xl overflow-hidden shadow-lg">
                <thead className="bg-gray-800 text-red-300">
                  <tr>
                    <th className="p-3 text-left">Medicine</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Expiry Date</th>
                    <th className="p-3 text-left">Days Left</th>
                    <th className="p-3 text-left">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-gray-400">No medicines found</td>
                    </tr>
                  ) : (
                    filteredMedicines.map(m => {
                      const expiryDate = new Date(m.expiryDate);
                      const today = new Date();
                      const diffTime = expiryDate - today;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      let priority = 'Good';
                      if (diffDays < 0) priority = 'Expired';
                      else if (diffDays <= 30) priority = 'Critical';
                      else if (diffDays <= 90) priority = 'Expiring Soon';
                      return (
                        <tr key={m.id} className="hover:bg-gray-800">
                          <td className="p-3 font-semibold text-white">{m.name}</td>
                          <td className="p-3 text-white">{m.quantity}</td>
                          <td className="p-3 text-white">{m.expiryDate}</td>
                          <td className="p-3 text-white">{diffDays < 0 ? 'Expired' : diffDays + ' days'}</td>
                          <td className="p-3 font-semibold text-red-300">{priority}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      }
      case 'contact':
        return <Contact />;
      case 'pharmacy-details':
        // Show the PharmacyProfile page
        return <PharmacyProfile />;
      default:
        return (
          <div className="p-6 min-h-[60vh] rounded-3xl shadow-2xl max-w-3xl mx-auto mt-16 bg-white/90 border border-gray-200 transition-all">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{currentPage}</h2>
            <div className="rounded-lg p-6">
              <p className="text-gray-600">This page is under development.</p>
            </div>
          </div>
        );
    }
  };

  // Main return
  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gradient-to-br from-[#1a2236] via-[#232946] to-[#121826]' : 'bg-gradient-to-br from-[#f6f7fb] via-[#e9ecf3] to-[#f3f6fa]'} transition-colors duration-500`}>
      {loading && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <span className="text-2xl font-bold text-blue-600">Loading your pharmacy...</span>
        </div>
      )}
      {!loading && !user && (
        <AuthForm
          onAuth={handleAuth}
          error={authError}
          mode={authMode}
          setMode={setAuthMode}
        />
      )}
      {!loading && user && (
        <>
          {/* Header */}
          <header className={`${darkMode ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'} shadow-xl border-b sticky top-0 z-50`}>
            <div className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                <div className="text-xl sm:text-2xl md:text-3xl p-1.5 sm:p-2 md:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">🧪</div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PharmaCare</h1>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium hidden sm:block`}>Advanced Stock Management</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                {/* Dark mode toggle removed - theme fixed to default */}
                {/* Profile Avatar Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-700 border-blue-500/50 hover:border-blue-400' : 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400/30 hover:border-blue-300'}`}
                    title="Profile Menu"
                  >
                    <div className="text-sm sm:text-lg md:text-2xl">👨‍⚕️</div>
                  </button>
                  {showProfileDropdown && (
                    <div className={`absolute right-0 mt-3 w-64 sm:w-72 md:w-80 rounded-xl md:rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'}`}>
                      <div className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-opacity-20">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-700 border-blue-500/50' : 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400/30'}`}>
                            <div className="text-lg sm:text-2xl md:text-3xl">👨‍⚕️</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm sm:text-base md:text-lg font-bold truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pharmacyInfo.name || 'Pharmacy Manager'}</h3>
                            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pharmacy Name</p>
                            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pharmacyInfo.name || 'Not set'}</p>
                          </div>
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pharmacyInfo.phone || 'Not set'}</p>
                          </div>
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>License</p>
                            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pharmacyInfo.gstin || 'Not set'}</p>
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <button
                            onClick={() => { setCurrentPage('pharmacy-details'); setShowProfileDropdown(false); }}
                            className={`w-full p-2 sm:p-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'}`}
                          >Edit Profile</button>
                          <button
                            onClick={() => { setUser(null); setAuthMode('login'); setShowProfileDropdown(false); }}
                            className={`w-full p-2 sm:p-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'}`}
                          >Logout</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className="flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <div className={`hidden md:block w-72 ${darkMode ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'} shadow-2xl h-screen border-r`}>
              <nav className="p-6">
                <div className="flex flex-col space-y-3">
                  <button onClick={() => setCurrentPage('dashboard')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${currentPage === 'dashboard' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:shadow-md'}`}><span className="text-xl">📊</span><span className="font-medium text-base">Dashboard</span></button>
                  <button onClick={() => setCurrentPage('medicines')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${currentPage === 'medicines' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:shadow-md'}`}><span className="text-xl">💊</span><span className="font-medium text-base">Medicines</span></button>
                  <button onClick={() => setCurrentPage('add')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${currentPage === 'add' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:shadow-md'}`}><span className="text-xl">➕</span><span className="font-medium text-base">Add Medicine</span></button>
                  <button onClick={() => setCurrentPage('expiry')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${currentPage === 'expiry' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:shadow-md'}`}><span className="text-xl">📅</span><span className="font-medium text-base">Expiry Tracker</span></button>
                  <button onClick={() => setCurrentPage('contact')} className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 ${currentPage === 'contact' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg' : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:shadow-md'}`}><span className="text-xl">📞</span><span className="font-medium text-base">Contact</span></button>
                </div>
              </nav>
            </div>
            {/* Main Content */}
            <main className="flex-1 overflow-auto pb-20 md:pb-0">
              <div className="min-h-full p-2 sm:p-4 md:p-0">
                {renderPage()}
              </div>
            </main>
          </div>
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className={`${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-3 shadow-2xl`}>
              <div className="flex justify-around items-center max-w-md mx-auto">
                <button onClick={() => setCurrentPage('dashboard')} className={`flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 ${currentPage === 'dashboard' ? 'scale-110' : ''}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${currentPage === 'dashboard' ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/30' : darkMode ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}><span className="text-lg">📊</span></div><span className={`text-xs mt-1 font-medium transition-colors duration-300 ${currentPage === 'dashboard' ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span></button>
                <button onClick={() => setCurrentPage('medicines')} className={`flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 ${currentPage === 'medicines' ? 'scale-110' : ''}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${currentPage === 'medicines' ? 'bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-green-500/30' : darkMode ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}><span className="text-lg">💊</span></div><span className={`text-xs mt-1 font-medium transition-colors duration-300 ${currentPage === 'medicines' ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Medicines</span></button>
                <button onClick={() => setCurrentPage('add')} className={`flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 ${currentPage === 'add' ? 'scale-110' : ''}`}><div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${currentPage === 'add' ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-orange-500/40' : darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-blue-600/30' : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/30'}`}><span className="text-xl">➕</span></div><span className={`text-xs mt-1 font-medium transition-colors duration-300 ${currentPage === 'add' ? 'text-orange-600' : darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Add</span></button>
                <button onClick={() => setCurrentPage('expiry')} className={`flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 ${currentPage === 'expiry' ? 'scale-110' : ''}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${currentPage === 'expiry' ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-red-500/30' : darkMode ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}><span className="text-lg">📅</span></div><span className={`text-xs mt-1 font-medium transition-colors duration-300 ${currentPage === 'expiry' ? 'text-red-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expiry</span></button>
                <button onClick={() => setCurrentPage('contact')} className={`flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 ${currentPage === 'contact' ? 'scale-110' : ''}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${currentPage === 'contact' ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-purple-500/30' : darkMode ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}><span className="text-lg">📞</span></div><span className={`text-xs mt-1 font-medium transition-colors duration-300 ${currentPage === 'contact' ? 'text-purple-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contact</span></button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
