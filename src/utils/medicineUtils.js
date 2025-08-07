import { format, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';

// Date formatting utilities
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, formatStr);
};

// Calculate days until expiry
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
  const today = new Date();
  return differenceInDays(expiry, today);
};

// Check if medicine is expired
export const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
  const today = new Date();
  return isBefore(expiry, today);
};

// Check if medicine is expiring soon
export const isExpiringSoon = (expiryDate, days = 30) => {
  if (!expiryDate) return false;
  const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
  const today = new Date();
  const threshold = addDays(today, days);
  return isBefore(expiry, threshold) && isAfter(expiry, today);
};

// Get expiry status
export const getExpiryStatus = (expiryDate) => {
  if (isExpired(expiryDate)) {
    return { status: 'expired', color: 'danger', label: 'Expired' };
  }
  if (isExpiringSoon(expiryDate, 30)) {
    return { status: 'expiring_soon', color: 'warning', label: 'Expiring Soon' };
  }
  return { status: 'safe', color: 'success', label: 'Safe' };
};

// Calculate stock status
export const getStockStatus = (quantity, minStock = 10) => {
  if (quantity === 0) {
    return { status: 'out_of_stock', color: 'danger', label: 'Out of Stock' };
  }
  if (quantity <= minStock) {
    return { status: 'low_stock', color: 'warning', label: 'Low Stock' };
  }
  return { status: 'in_stock', color: 'success', label: 'In Stock' };
};

// Medicine statistics
export const calculateMedicineStats = (medicines) => {
  const total = medicines.length;
  const outOfStock = medicines.filter(med => med.quantity === 0).length;
  const expiringSoon = medicines.filter(med => 
    isExpiringSoon(med.expiryDate, 30) && !isExpired(med.expiryDate)
  ).length;
  const expired = medicines.filter(med => isExpired(med.expiryDate)).length;
  const lowStock = medicines.filter(med => 
    med.quantity > 0 && med.quantity <= (med.minStock || 10)
  ).length;

  return {
    total,
    outOfStock,
    expiringSoon,
    expired,
    lowStock,
    inStock: total - outOfStock - expired,
  };
};

// Filter medicines by various criteria
export const filterMedicines = (medicines, filters) => {
  return medicines.filter(medicine => {
    // Search by name
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesName = medicine.name.toLowerCase().includes(searchTerm);
      const matchesBatch = medicine.batchNo?.toLowerCase().includes(searchTerm);
      if (!matchesName && !matchesBatch) return false;
    }

    // Filter by expiry status
    if (filters.expiryStatus) {
      const { status } = getExpiryStatus(medicine.expiryDate);
      if (filters.expiryStatus !== status) return false;
    }

    // Filter by stock status
    if (filters.stockStatus) {
      const { status } = getStockStatus(medicine.quantity);
      if (filters.stockStatus !== status) return false;
    }

    // Filter by type
    if (filters.type && medicine.type !== filters.type) {
      return false;
    }

    return true;
  });
};

// Sort medicines
export const sortMedicines = (medicines, sortBy, sortOrder = 'asc') => {
  return [...medicines].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'expiryDate':
        aValue = new Date(a.expiryDate);
        bValue = new Date(b.expiryDate);
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

// Generate CSV data
export const generateCSV = (medicines) => {
  const headers = ['Name', 'Batch No.', 'Type', 'Quantity', 'Expiry Date', 'Status', 'Days Until Expiry'];
  const rows = medicines.map(med => [
    med.name,
    med.batchNo || '',
    med.type || '',
    med.quantity,
    formatDate(med.expiryDate),
    getExpiryStatus(med.expiryDate).label,
    getDaysUntilExpiry(med.expiryDate) || 'N/A',
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// Generate alerts
export const generateAlerts = (medicines) => {
  const alerts = [];

  medicines.forEach(medicine => {
    // Expired medicines
    if (isExpired(medicine.expiryDate)) {
      alerts.push({
        id: `expired-${medicine.id}`,
        type: 'expired',
        priority: 'high',
        medicine,
        message: `${medicine.name} has expired`,
        date: new Date(),
      });
    }
    // Expiring soon
    else if (isExpiringSoon(medicine.expiryDate, 30)) {
      const daysLeft = getDaysUntilExpiry(medicine.expiryDate);
      alerts.push({
        id: `expiring-${medicine.id}`,
        type: 'expiring_soon',
        priority: daysLeft <= 7 ? 'high' : 'medium',
        medicine,
        message: `${medicine.name} expires in ${daysLeft} days`,
        date: new Date(),
      });
    }

    // Low stock
    if (medicine.quantity > 0 && medicine.quantity <= (medicine.minStock || 10)) {
      alerts.push({
        id: `low-stock-${medicine.id}`,
        type: 'low_stock',
        priority: 'medium',
        medicine,
        message: `${medicine.name} is running low (${medicine.quantity} left)`,
        date: new Date(),
      });
    }

    // Out of stock
    if (medicine.quantity === 0) {
      alerts.push({
        id: `out-stock-${medicine.id}`,
        type: 'out_of_stock',
        priority: 'high',
        medicine,
        message: `${medicine.name} is out of stock`,
        date: new Date(),
      });
    }
  });

  return alerts.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};
