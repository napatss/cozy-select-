import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_ORDERS } from '../data/initialData';
import { 
  User, Package, MapPin, Heart, LogOut, 
  ChevronRight, Truck, CheckCircle2, Clock, ShieldCheck 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    logoutUser, 
    lastPlacedOrder, 
    setActiveView, 
    setTrackOrderId, 
    language, 
    t, 
    theme 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'address' | 'settings'>('orders');

  const orders = [
    ...(lastPlacedOrder ? [lastPlacedOrder] : []),
    ...INITIAL_ORDERS
  ];

  const handleTrackOrder = (orderId: string) => {
    setTrackOrderId(orderId);
    setActiveView('track');
  };

  if (!currentUser) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500">{language === 'th' ? 'กรุณาเข้าสู่ระบบ' : 'Please log in to view your profile'}</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2 bg-electric-pink text-white rounded-xl text-xs font-bold"
        >
          {t.nav.home}
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
          theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-primary-container/40 shadow-lg shadow-primary-container/40/30 text-slate-800'
        }`}>
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-electric-pink to-baby-pink text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-baby-pink">
              {currentUser.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs text-slate-400">{currentUser.email} • {currentUser.phone}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-container/40 dark:bg-pink-950 text-tertiary dark:text-baby-pink text-[11px] font-bold">
                ⭐ Cozy VIP Member
              </span>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-primary-container/15 hover:text-tertiary dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.nav.logout}</span>
          </button>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Nav (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-electric-pink text-white shadow-md shadow-baby-pink'
                  : 'bg-white dark:bg-slate-900 border border-primary-container/40 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-container/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t.profile.myOrders}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('address')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'address'
                  ? 'bg-electric-pink text-white shadow-md shadow-baby-pink'
                  : 'bg-white dark:bg-slate-900 border border-primary-container/40 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-container/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t.profile.savedAddresses}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('wishlist')}
              className="w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between bg-white dark:bg-slate-900 border border-primary-container/40 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-container/20 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-electric-pink" />
                {t.nav.wishlist}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Content (9 cols) */}
          <div className="lg:col-span-9">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-lg font-serif-luxury font-bold text-slate-900 dark:text-white mb-4">
                  {t.profile.myOrders} ({orders.length})
                </h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-5 rounded-3xl border space-y-4 ${
                        theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-primary-container/40 shadow-sm text-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary-container/40 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs sm:text-sm text-tertiary">{order.id}</span>
                          <span className="text-xs text-slate-400">
                            • {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-container/40 text-pink-700 dark:bg-pink-950 dark:text-baby-pink uppercase">
                          {order.orderStatus}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-primary-container/40/50 dark:divide-slate-800">
                        {order.items.map((it) => (
                          <div key={it.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={it.product.images[0]}
                                alt="item"
                                className="w-12 h-14 rounded-lg object-cover bg-primary-container/15"
                              />
                              <div>
                                <p className="font-bold text-slate-800 dark:text-white">{it.product.titleTh}</p>
                                <p className="text-slate-400">Size: {it.selectedSize} • Qty: {it.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-tertiary">฿{(it.unitPrice * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Track button */}
                      <div className="pt-3 border-t border-primary-container/40 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400">{t.cart.total}: </span>
                          <span className="text-base font-black text-tertiary">฿{order.total.toLocaleString()}</span>
                        </div>

                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className="px-4 py-2 rounded-xl bg-electric-pink hover:bg-tertiary text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{t.orderSuccess.trackStatus}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-4">
                <h2 className="text-lg font-serif-luxury font-bold text-slate-900 dark:text-white mb-4">
                  {t.profile.savedAddresses}
                </h2>

                <div className="p-5 rounded-3xl border border-baby-pink bg-white dark:bg-slate-900 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-electric-pink bg-primary-container/20 dark:bg-pink-950 px-2.5 py-0.5 rounded-full">
                      Default Address
                    </span>
                  </div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">แพรวา รัตนเจริญ (089-123-4567)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    99/123 หมู่บ้านสุขใจ ซอย 5 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
