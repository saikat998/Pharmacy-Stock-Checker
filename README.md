# 🧪 PharmaCare - Pharmacy Stock & Expiry Tracker

A modern, responsive web application built with React.js to help pharmacies manage their medicine inventory, track expiry dates, and get smart alerts for stock management.

## ✨ Features

### 🏠 Dashboard
- **Real-time Statistics**: Total medicines, out of stock, expiring soon, and expired medicines
- **Animated Counter Cards**: Beautiful animated statistics with smooth transitions
- **Interactive Charts**: Pie charts for stock distribution and bar charts for monthly overview
- **Quick Actions**: Fast navigation to common tasks
- **Recent & Expiring Medicine Lists**: Keep track of latest additions and upcoming expiries

### 📦 Medicine Management
- **Comprehensive Medicine List**: View all medicines in grid or table format
- **Advanced Filtering**: Filter by expiry status, stock status, type, and custom search
- **Sorting Options**: Sort by name, expiry date, quantity, or date added
- **Export Functionality**: Download medicine data as CSV
- **Add/Edit/Delete**: Full CRUD operations with beautiful forms

### ⏰ Smart Alerts & Notifications
- **Expiry Alerts**: Automatic alerts for medicines expiring soon or already expired
- **Stock Alerts**: Low stock and out of stock notifications
- **Real-time Notifications**: Bell icon with badge showing alert count
- **Color-coded Status**: Red for urgent, orange for warnings, green for safe

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations for delightful user experience
- **Clean Interface**: Modern design with Tailwind CSS
- **Dark Mode Ready**: Built with future dark mode support
- **Accessibility**: Keyboard navigation and screen reader friendly

### 🔧 Technical Features
- **Firebase Integration**: Cloud-based data storage and real-time updates
- **React Router**: Smooth navigation between pages
- **Form Validation**: React Hook Form with comprehensive validation
- **State Management**: Context API for global state management
- **Custom Hooks**: Reusable logic for common operations

## 🛠️ Tech Stack

- **Frontend**: React.js 19 with Vite
- **Styling**: Tailwind CSS with custom animations
- **Icons**: React Icons (Feather Icons)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Backend**: Firebase Firestore
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase config
   - Update `src/firebase.js` with your Firebase configuration

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📱 Pages Overview

### Dashboard (`/`)
- Statistics cards with animated counters
- Stock distribution pie chart
- Monthly overview bar chart
- Recent medicines and expiry alerts
- Quick action buttons

### All Medicines (`/medicines`)
- Grid and table view options
- Advanced filtering and sorting
- Search functionality
- Export to CSV
- Edit and delete actions

### Add Medicine (`/add-medicine`)
- Beautiful form with validation
- Medicine details input
- Success animations
- Auto-redirect after successful addition

### Expiry Tracker (`/expiry-tracker`)
- Color-coded expiry status
- Filter by expiry timeframes
- Calendar view (planned)
- Export expiry reports

### Pharmacy Profile (`/profile`)
- Edit pharmacy information
- Upload logo/banner
- Contact details management
- Profile customization

### Settings (`/settings`)
- Application preferences
- Alert configurations
- Export/import data
- Dark mode toggle (planned)

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Success**: Green (#22c55e)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)
- **Gray**: Various shades for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Animations
- **Fade In**: Smooth opacity transitions
- **Slide Up**: Bottom to top animations
- **Bounce In**: Playful entry animations
- **Count Up**: Number counter animations

## 🔮 Future Enhancements

- **Calendar View**: Visual expiry calendar
- **Barcode Scanning**: Mobile barcode scanner integration
- **Multi-pharmacy Support**: Manage multiple pharmacy locations
- **Advanced Analytics**: Detailed reports and insights
- **Mobile App**: React Native mobile application
- **Print Labels**: Medicine label printing
- **Supplier Management**: Track medicine suppliers
- **Purchase Orders**: Automated reordering system

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Firebase** for backend services
- **Feather Icons** for beautiful icons

---

Built with ❤️ for pharmacies worldwide+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
