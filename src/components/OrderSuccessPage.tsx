import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Sparkles, Truck, ArrowRight, 
  Copy, ShoppingBag, Package, MapPin, CreditCard, Printer 
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderSuccessPage: React.FC = () => {
  const { lastPlacedOrder, setActiveView, setTrackOrderId, showToast, language, t, theme } = useApp();

  // Run confetti burst on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#ec4899', '#fda4af', '#e879f9']
      });
    } catch {
      // Ignored if canvas-confetti is not loaded
    }
  }, []);

  if (!lastPlacedOrder) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500">{language === 'th' ? 'ไม่พบคำสั่งซื้อล่าสุด' : 'No recent order found'}</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2 rounded-xl bg-electric-pink text-white text-xs font-bold"
        >
          {t.nav.home}
        </button>
      </div>
    );
  }

  const order = lastPlacedOrder;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    showToast(language === 'th' ? 'คัดลอกเลขออเดอร์แล้ว' : 'Copied Order ID', 'success');
  };

  const handleTrackThisOrder = () => {
    setTrackOrderId(order.id);
    setActiveView('track');
  };

  return (
    <div className="py-8 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Success Banner Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 sm:p-8 rounded-3xl border text-center space-y-4 ${
            theme === 'dark'
              ? 'bg-slate-900/90 border-slate-800 text-white'
              : 'bg-white border-primary-container/40 shadow-xl shadow-primary-container/40/50 text-slate-800'
          }`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-electric-pink to-baby-pink text-white flex items-center justify-center mx-auto shadow-lg shadow-electric-pink/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
              {t.orderSuccess.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.orderSuccess.subtitle}
            </p>
          </div>

          {/* Order ID & Tracking Number Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-container/20 dark:bg-slate-800 border border-primary-container/40 dark:border-slate-700">
              <span className="text-xs text-slate-500">{t.orderSuccess.orderId}:</span>
              <span className="text-xs font-mono font-black text-tertiary dark:text-electric-pink">{order.id}</span>
              <button onClick={handleCopyOrderId} className="p-1 hover:text-tertiary">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {order.trackingNumber && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Truck className="w-3.5 h-3.5 text-electric-pink" />
                <span className="text-xs text-slate-500">{t.orderSuccess.trackingNumber}:</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Details Breakdown Card */}
        <div className={`p-6 sm:p-7 rounded-3xl border space-y-6 ${
          theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-primary-container/40 shadow-md shadow-primary-container/40/30 text-slate-800'
        }`}>
          
          <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-slate-900 dark:text-white border-b border-primary-container/40 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span>{language === 'th' ? 'รายการสินค้าที่สั่งซื้อ' : 'Purchased Items'}</span>
            <span className="text-xs font-sans font-normal text-slate-400">
              {new Date(order.createdAt).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </h2>

          {/* Purchased Items List */}
          <div className="divide-y divide-primary-container/40/60 dark:divide-slate-800">
            {order.items.map((it) => (
              <div key={it.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={it.product.images[0]}
                    alt={it.product.titleTh}
                    className="w-14 h-16 rounded-xl object-cover bg-primary-container/15 shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-white truncate">
                      {language === 'th' ? it.product.titleTh : it.product.titleEn}
                    </p>
                    <p className="text-slate-400">
                      {it.selectedColor.nameEn} • Size: {it.selectedSize} • Qty: {it.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold text-tertiary dark:text-electric-pink">
                    ฿{(it.unitPrice * it.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-primary-container/40 dark:border-slate-800 text-xs">
            
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary-container/15/30 dark:bg-slate-800/60 border border-primary-container/40 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-electric-pink" />
                <span>{language === 'th' ? 'ที่อยู่จัดส่ง' : 'Delivery Address'}</span>
              </p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {order.shippingAddress.addressLine1} {order.shippingAddress.subDistrict} {order.shippingAddress.district} {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary-container/15/30 dark:bg-slate-800/60 border border-primary-container/40 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-electric-pink" />
                <span>{language === 'th' ? 'การชำระเงินและการจัดส่ง' : 'Payment & Delivery'}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Method: <span className="font-bold capitalize text-tertiary">{order.paymentMethod.replace('_', ' ')}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Courier: <span className="font-semibold">{order.shippingMethod.nameTh}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Status: <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">{order.orderStatus}</span>
              </p>
            </div>

          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-primary-container/40 dark:border-slate-800 space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-500">
              <span>{t.cart.subtotal}</span>
              <span>฿{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{t.cart.discount}</span>
                <span>-฿{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>{t.cart.shippingFee}</span>
              <span>{order.shippingFee === 0 ? t.cart.freeShipping : `฿${order.shippingFee.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-primary-container/40 dark:border-slate-800 font-bold text-base">
              <span>{t.cart.total}</span>
              <span className="text-xl sm:text-2xl font-black text-tertiary dark:text-electric-pink">
                ฿{order.total.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleTrackThisOrder}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-electric-pink hover:bg-tertiary text-white font-bold text-xs sm:text-sm shadow-lg shadow-electric-pink/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>{t.orderSuccess.trackStatus}</span>
          </button>

          <button
            onClick={() => setActiveView('products')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-baby-pink dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-primary-container/20 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-electric-pink" />
            <span>{t.orderSuccess.backToHome}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Print Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
