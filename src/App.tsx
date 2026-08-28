import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';

import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackingPage } from './pages/TrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductListPage />;
      case 'product_detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order_success':
        return <OrderSuccessPage />;
      case 'track':
        return <TrackingPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Dynamic View with animation */}
      <main className="flex-1 pb-20 md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer (hidden in admin mode if desired or shown everywhere) */}
      {activeView !== 'admin' && <Footer />}

      {/* Mobile Bottom Floating Navigation */}
      <MobileBottomNav />

      {/* Interactive Quick View Modal */}
      <QuickViewModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
