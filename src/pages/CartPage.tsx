import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Trash2, Tag, ArrowRight, ArrowLeft, 
  Truck, Sparkles, CheckCircle2, X 
} from 'lucide-react';
import { motion } from 'motion/react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeAppliedCoupon,
    setActiveView,
    language,
    t,
    theme 
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const freeShippingThreshold = 990;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const estimatedShipping = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 35);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + estimatedShipping);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCouponCode(couponInput.trim());
    setIsApplyingCoupon(false);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4 text-center space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center mx-auto text-pink-500 shadow-xl shadow-pink-200/40">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-slate-900 dark:text-white">
            {t.cart.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.cart.emptyDesc}
          </p>
          <button
            onClick={() => setActiveView('products')}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/30 hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.cart.continueShopping}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Back to Shop */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
              {t.cart.title} <span className="text-pink-500 text-lg sm:text-xl font-normal">({cartCount} {language === 'th' ? 'ชิ้น' : 'items'})</span>
            </h1>
          </div>
          <button
            onClick={() => setActiveView('products')}
            className="text-xs sm:text-sm font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.cart.continueShopping}</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className={`p-4 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-pink-50/50 border-pink-100 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-pink-600 dark:text-pink-300">
              <Truck className="w-4 h-4" />
              {isFreeShipping 
                ? (language === 'th' ? '🎉 ยินดีด้วย! คุณได้รับสิทธิ์ จัดส่งฟรี ทั่วประเทศ' : '🎉 You unlocked FREE SHIPPING!') 
                : (language === 'th' ? `ซื้อเพิ่มอีก ฿${amountNeededForFreeShipping.toLocaleString()} เพื่อรับสิทธิ์ส่งฟรี!` : `Add ฿${amountNeededForFreeShipping.toLocaleString()} more for FREE SHIPPING!`)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              ฿{cartSubtotal.toLocaleString()} / ฿{freeShippingThreshold.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Content: Items List + Summary Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className={`rounded-3xl border divide-y overflow-hidden ${
              theme === 'dark' 
                ? 'bg-slate-900/80 border-slate-800 divide-slate-800' 
                : 'bg-white border-pink-100 divide-pink-100 shadow-sm'
            }`}>
              {cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Item Image & Description */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.titleTh}
                      className="w-18 h-22 sm:w-20 sm:h-24 rounded-2xl object-cover bg-rose-50 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                        {language === 'th' ? item.product.titleTh : item.product.titleEn}
                      </h3>
                      
                      {/* Selected Attributes */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: item.selectedColor.hex }} />
                          {language === 'th' ? item.selectedColor.nameTh : item.selectedColor.nameEn}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-pink-500">Size: {item.selectedSize}</span>
                      </div>

                      <div className="text-sm font-bold text-pink-600 dark:text-pink-400 sm:hidden">
                        ฿{item.unitPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Price, Stepper & Delete Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6">
                    
                    {/* Unit Price (Desktop) */}
                    <div className="hidden sm:block text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ฿{item.unitPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-pink-200 dark:border-slate-700 rounded-xl overflow-hidden bg-rose-50/40 dark:bg-slate-800">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-pink-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-pink-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm sm:text-base font-black text-pink-600 dark:text-pink-400">
                        ฿{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title={t.cart.deleteItem}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Clear Cart button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'ล้างสินค้าทั้งหมดในตะกร้า' : 'Clear all items'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Coupon & Order Summary Box (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Coupon Code Box */}
            <div className={`p-5 rounded-3xl border space-y-3 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-pink-100 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Tag className="w-4 h-4 text-pink-500" />
                <span>{t.cart.couponCode}</span>
              </div>

              {appliedCoupon ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        {appliedCoupon.coupon.code}
                      </p>
                      <p className="text-[11px] text-emerald-600">
                        {language === 'th' ? `ลดทันที ฿${appliedCoupon.discountAmount.toLocaleString()}` : `Saved ฿${appliedCoupon.discountAmount.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeAppliedCoupon}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder={t.cart.couponPlaceholder}
                    className="flex-1 px-3.5 py-2 text-xs uppercase font-bold rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/30 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {t.cart.applyCoupon}
                  </button>
                </form>
              )}

              {/* Quick Promo Codes Suggestions */}
              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-500 dark:text-slate-400">{language === 'th' ? 'โค้ดแนะนำ:' : 'Suggested Codes:'}</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyCouponCode('COZY10')}
                    className="px-2 py-0.5 rounded-lg bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 font-bold border border-pink-200 dark:border-slate-700 hover:bg-pink-100"
                  >
                    COZY10 (-10%)
                  </button>
                  <button
                    onClick={() => applyCouponCode('Y2K50')}
                    className="px-2 py-0.5 rounded-lg bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 font-bold border border-pink-200 dark:border-slate-700 hover:bg-pink-100"
                  >
                    Y2K50 (-฿50)
                  </button>
                  <button
                    onClick={() => applyCouponCode('FREESHIP')}
                    className="px-2 py-0.5 rounded-lg bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 font-bold border border-pink-200 dark:border-slate-700 hover:bg-pink-100"
                  >
                    FREESHIP
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-pink-100 shadow-md shadow-pink-100/40 text-slate-800'
            }`}>
              <h3 className="font-bold text-base font-serif-luxury text-slate-900 dark:text-white">
                {t.cart.summary}
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm border-b border-pink-100 dark:border-slate-800 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t.cart.subtotal}</span>
                  <span className="font-semibold">฿{cartSubtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{t.cart.discount} ({appliedCoupon.coupon.code})</span>
                    <span>-฿{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t.cart.shippingFee}</span>
                  <span className="font-semibold">
                    {estimatedShipping === 0 ? (
                      <span className="text-pink-500 font-bold">{t.cart.freeShipping}</span>
                    ) : (
                      `฿${estimatedShipping.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-base text-slate-900 dark:text-white">{t.cart.total}</span>
                <span className="text-2xl font-black text-pink-600 dark:text-pink-400">
                  ฿{grandTotal.toLocaleString()}
                </span>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => setActiveView('checkout')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm tracking-wider shadow-lg shadow-pink-500/35 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.cart.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
