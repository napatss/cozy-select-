import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, setActiveCategory, cartCount, wishlist, currentUser, setIsAuthModalOpen, t } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-primary-container/40 dark:border-slate-800 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => { setActiveCategory('all'); setActiveView('home'); }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeView === 'home' ? 'text-electric-pink font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{t.nav.home}</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => { setActiveCategory('all'); setActiveView('products'); }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeView === 'products' ? 'text-electric-pink font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>{t.nav.allProducts}</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setActiveView('wishlist')}
          className={`relative flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeView === 'wishlist' ? 'text-electric-pink font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Heart className="w-5 h-5" fill={activeView === 'wishlist' ? 'currentColor' : 'none'} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 bg-electric-pink text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span>{t.nav.wishlist}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setActiveView('cart')}
          className={`relative flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeView === 'cart' ? 'text-electric-pink font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-1 bg-electric-pink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span>{t.nav.cart}</span>
        </button>

        {/* Account */}
        <button
          onClick={() => {
            if (currentUser) {
              setActiveView('profile');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeView === 'profile' ? 'text-electric-pink font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{t.nav.account}</span>
        </button>
      </div>
    </div>
  );
};
