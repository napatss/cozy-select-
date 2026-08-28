import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Truck, Tag, ArrowRight, Copy } from 'lucide-react';
import { motion } from 'motion/react';

export const PromoBanners: React.FC = () => {
  const { language, setActiveCategory, setActiveView, applyCouponCode, showToast, t, theme } = useApp();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCouponCode(code);
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Banner 1: Up to 30% OFF */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-electric-pink via-baby-pink to-tertiary text-white shadow-xl shadow-electric-pink/20 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                <Tag className="w-3 h-3" />
                {language === 'th' ? 'โปรโมชั่นแรง' : 'Special Offer'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-black leading-tight">
                {t.home.promoBanner1Title}
              </h3>
              <p className="text-xs sm:text-sm text-primary-container/40 font-normal">
                {t.home.promoBanner1Desc}
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveCategory('crop_top');
                  setActiveView('products');
                }}
                className="px-4 py-2 rounded-xl bg-white text-tertiary text-xs font-bold shadow-md hover:bg-primary-container/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'th' ? 'ช้อปเลย' : 'Shop Sale'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCopyCode('COZY10')}
                className="text-xs font-bold text-primary-container/40 hover:text-white flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Apply COZY10 coupon"
              >
                <span>Code: <strong>COZY10</strong></span>
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* Banner 2: FREE SHIPPING */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 border flex flex-col justify-between ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-primary-container/40 text-slate-800 shadow-xl shadow-primary-container/40/50'
            }`}
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary-container/40 dark:bg-pink-950 text-tertiary dark:text-baby-pink">
                <Truck className="w-3 h-3" />
                {t.home.promoBanner2Title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-black text-slate-900 dark:text-white leading-tight">
                {language === 'th' ? 'ส่งฟรีทั่วประเทศ' : 'Free Shipping'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t.home.promoBanner2Desc}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveView('products');
                }}
                className="w-full py-2.5 rounded-xl bg-primary-container/20 dark:bg-slate-800 text-tertiary dark:text-electric-pink text-xs font-bold hover:bg-electric-pink hover:text-white dark:hover:bg-electric-pink dark:hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'th' ? 'เริ่มเลือกซื้อสินค้า' : 'Shop Over ฿990'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Banner 3: NEW COLLECTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-electric-pink text-white">
                <Sparkles className="w-3 h-3" />
                {t.home.promoBanner3Title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-black text-baby-pink leading-tight">
                {language === 'th' ? 'Y2K ROMANCE' : 'Y2K ROMANCE'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.home.promoBanner3Desc}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setActiveCategory('baby_tees');
                  setActiveView('products');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-electric-pink to-tertiary text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'th' ? 'ดูคอลเลกชัน Baby Tees' : 'Explore Baby Tees'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
