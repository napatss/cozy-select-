import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setActiveView, language, t } = useApp();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-500 uppercase tracking-widest mb-1">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>SAVED ITEMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
              {t.nav.wishlist} <span className="text-pink-500 text-base font-normal">({wishlist.length})</span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={() => setActiveView('products')}
              className="text-xs sm:text-sm font-bold text-pink-500 hover:text-pink-600 cursor-pointer"
            >
              {t.home.viewAll} →
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-20 bg-rose-50/20 dark:bg-slate-900/30 rounded-3xl border border-dashed border-pink-200 dark:border-slate-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center mx-auto text-pink-500 shadow-md">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-serif-luxury">
              {language === 'th' ? 'ยังไม่มีสินค้าใน Wishlist' : 'Your Wishlist is Empty'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {language === 'th' ? 'กดที่รูปหัวใจบนสินค้าที่คุณชื่นชอบเพื่อบันทึกไว้ดูภายหลัง' : 'Click the heart icon on any product to save your favorites.'}
            </p>
            <button
              onClick={() => setActiveView('products')}
              className="px-6 py-3 rounded-2xl bg-pink-500 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-pink-600 transition-colors"
            >
              {t.home.viewAll}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
