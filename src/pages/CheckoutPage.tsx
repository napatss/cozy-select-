import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShippingAddress, ShippingMethod, PaymentMethod, Order 
} from '../types';
import { INITIAL_SHIPPING_METHODS } from '../data/initialData';
import { 
  Truck, CreditCard, QrCode, DollarSign, CheckCircle2, 
  ShieldCheck, Upload, Clock, AlertCircle, ArrowLeft, 
  Sparkles, Lock 
} from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    appliedCoupon, 
    clearCart, 
    setLastPlacedOrder, 
    setActiveView, 
    currentUser, 
    showToast,
    fetchProducts,
    language,
    t,
    theme 
  } = useApp();

  // Address Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: currentUser?.name || 'แพรวา รัตนเจริญ (Praewa R.)',
    phone: currentUser?.phone || '0891234567',
    email: currentUser?.email || 'praewa.cozy@example.com',
    addressLine1: '99/123 หมู่บ้านสุขใจ ซอย 5',
    subDistrict: 'คลองตันเหนือ',
    district: 'วัฒนา',
    province: 'กรุงเทพมหานคร',
    postalCode: '10110',
    notes: 'ฝากไว้ที่ป้อม รปภ. ได้เลยค่ะ'
  });

  // Shipping Method
  const [shippingMethods] = useState<ShippingMethod[]>(INITIAL_SHIPPING_METHODS);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(INITIAL_SHIPPING_METHODS[0]);

  // Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('promptpay_qr');

  // Credit Card Form
  const [cardData, setCardData] = useState({
    cardNumber: '4111 2222 3333 4444',
    cardHolder: 'PRAEWA RATTANACHAREON',
    expiry: '08/28',
    cvv: '888'
  });

  // Slip Upload State
  const [uploadedSlip, setUploadedSlip] = useState<string | null>(null);
  const [qrTimerSeconds, setQrTimerSeconds] = useState(15 * 60); // 15 mins
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Free shipping check
  const isFreeShipping = cartSubtotal >= 990;
  const actualShippingFee = isFreeShipping ? 0 : selectedShippingMethod.price;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + actualShippingFee);

  // Timer countdown for QR
  useEffect(() => {
    const timer = setInterval(() => {
      setQrTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedSlip(reader.result as string);
        showToast(language === 'th' ? 'อัปโหลดสลิปสำเร็จ!' : 'Slip uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const autofillDemoCard = () => {
    setCardData({
      cardNumber: '4532 8920 1123 7789',
      cardHolder: 'PRAEWA COZY',
      expiry: '12/29',
      cvv: '777'
    });
    showToast(language === 'th' ? 'กรอกข้อมูลบัตรทดสอบอัตโนมัติแล้ว' : 'Autofilled demo credit card', 'info');
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.province || !shippingAddress.postalCode) {
      showToast(language === 'th' ? 'กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน' : 'Please fill in all shipping details', 'error');
      return;
    }

    if (selectedPaymentMethod === 'credit_card') {
      if (cardData.cardNumber.replace(/\s/g, '').length < 16 || !cardData.expiry || !cardData.cvv) {
        showToast(language === 'th' ? 'กรุณากรอกข้อมูลบัตรเครดิตให้ถูกต้อง' : 'Please enter valid credit card info', 'error');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        items: cart,
        shippingAddress,
        shippingMethod: selectedShippingMethod,
        paymentMethod: selectedPaymentMethod,
        appliedCoupon: appliedCoupon?.coupon || null,
        subtotal: cartSubtotal,
        discount: discountAmount,
        shippingFee: actualShippingFee,
        total: finalTotal
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLastPlacedOrder(data.data);
        clearCart();
        await fetchProducts(); // Refresh stocks
        setActiveView('order_success');
      } else {
        // Fallback local order creation if offline
        const localOrder: Order = {
          id: `COZY-${Math.floor(100000 + Math.random() * 900000)}`,
          trackingNumber: `TH${Math.floor(10000000 + Math.random() * 90000000)}`,
          customerName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          shippingAddress,
          items: cart,
          shippingMethod: selectedShippingMethod,
          paymentMethod: selectedPaymentMethod,
          paymentStatus: selectedPaymentMethod === 'cod' ? 'pending' : 'paid',
          orderStatus: 'paid',
          subtotal: cartSubtotal,
          discount: discountAmount,
          shippingFee: actualShippingFee,
          total: finalTotal,
          appliedCoupon: appliedCoupon?.coupon,
          createdAt: new Date().toISOString()
        };

        setLastPlacedOrder(localOrder);
        clearCart();
        setActiveView('order_success');
      }
    } catch (err) {
      console.warn('Order fallback to local', err);
      // Fallback
      const fallbackOrder: Order = {
        id: `COZY-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingNumber: `TH${Math.floor(10000000 + Math.random() * 90000000)}`,
        customerName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        shippingAddress,
        items: cart,
        shippingMethod: selectedShippingMethod,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: 'paid',
        orderStatus: 'paid',
        subtotal: cartSubtotal,
        discount: discountAmount,
        shippingFee: actualShippingFee,
        total: finalTotal,
        createdAt: new Date().toISOString()
      };
      setLastPlacedOrder(fallbackOrder);
      clearCart();
      setActiveView('order_success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('cart')}
              className="p-2 rounded-xl border border-pink-100 dark:border-slate-800 hover:bg-pink-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
              {t.checkout.title}
            </h1>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Forms (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Shipping Address Form */}
            <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-pink-100 shadow-sm text-slate-800'
            }`}>
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-serif-luxury font-bold text-slate-900 dark:text-white">
                <span className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center font-sans font-black">
                  1
                </span>
                <span>{t.checkout.shippingAddress}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.fullName} *</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.phone} *</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.email}</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.address} *</label>
                  <input
                    type="text"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    placeholder="บ้านเลขที่, หมู่บ้าน, ถนน, ซอย"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.subDistrict}</label>
                  <input
                    type="text"
                    value={shippingAddress.subDistrict}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, subDistrict: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.district}</label>
                  <input
                    type="text"
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.province} *</label>
                  <input
                    type="text"
                    value={shippingAddress.province}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.postalCode} *</label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t.checkout.notes}</label>
                  <input
                    type="text"
                    value={shippingAddress.notes}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, notes: e.target.value })}
                    placeholder="รายละเอียดเพิ่มเติม (เช่น วางของไว้หน้าประตู)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-rose-50/20 dark:bg-slate-800 outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Method Options */}
            <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-pink-100 shadow-sm text-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base sm:text-lg font-serif-luxury font-bold text-slate-900 dark:text-white">
                  <span className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center font-sans font-black">
                    2
                  </span>
                  <span>{t.checkout.shippingMethod}</span>
                </div>
                {isFreeShipping && (
                  <span className="bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {language === 'th' ? 'ได้รับสิทธิ์ส่งฟรี' : 'Free Shipping Unlocked'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shippingMethods.map((method) => {
                  const isSelected = selectedShippingMethod.id === method.id;
                  const priceToDisplay = isFreeShipping ? 0 : method.price;

                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedShippingMethod(method)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {language === 'th' ? method.nameTh : method.nameEn}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {language === 'th' ? method.estimatedDaysTh : method.estimatedDaysEn}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-bold ${isFreeShipping ? 'text-pink-500' : 'text-slate-900 dark:text-white'}`}>
                          {isFreeShipping ? 'FREE' : `฿${priceToDisplay}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment Method Options */}
            <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-pink-100 shadow-sm text-slate-800'
            }`}>
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-serif-luxury font-bold text-slate-900 dark:text-white">
                <span className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center font-sans font-black">
                  3
                </span>
                <span>{t.checkout.paymentMethod}</span>
              </div>

              {/* Payment Type Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* PromptPay */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('promptpay_qr')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    selectedPaymentMethod === 'promptpay_qr'
                      ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <QrCode className="w-5 h-5 text-pink-500" />
                    {selectedPaymentMethod === 'promptpay_qr' && <CheckCircle2 className="w-4 h-4 text-pink-500" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t.checkout.promptpay}</p>
                    <p className="text-[10px] text-slate-400">Thai QR PromptPay</p>
                  </div>
                </button>

                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('credit_card')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    selectedPaymentMethod === 'credit_card'
                      ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-5 h-5 text-pink-500" />
                    {selectedPaymentMethod === 'credit_card' && <CheckCircle2 className="w-4 h-4 text-pink-500" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t.checkout.creditCard}</p>
                    <p className="text-[10px] text-slate-400">Visa, Mastercard, JCB</p>
                  </div>
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    selectedPaymentMethod === 'cod'
                      ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <DollarSign className="w-5 h-5 text-pink-500" />
                    {selectedPaymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-pink-500" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t.checkout.cod}</p>
                    <p className="text-[10px] text-slate-400">Pay when delivered</p>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Details Area */}
              <div className="mt-4 p-5 rounded-2xl bg-rose-50/40 dark:bg-slate-800/60 border border-pink-100 dark:border-slate-700">
                
                {/* 1. PromptPay QR View */}
                {selectedPaymentMethod === 'promptpay_qr' && (
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-md border text-center flex flex-col items-center shrink-0">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021129370016A000000677010111011300668987654325802TH53037646304"
                        alt="PromptPay QR Code"
                        className="w-36 h-36 object-contain"
                      />
                      <div className="mt-2 text-[11px] font-bold text-slate-700">
                        Cozy Select Co., Ltd.
                      </div>
                      <div className="text-[10px] text-pink-600 font-extrabold">
                        ฿{finalTotal.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-pink-600 bg-pink-100/60 dark:bg-pink-950 px-3 py-1.5 rounded-xl w-fit">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>{language === 'th' ? `ชำระเงินภายใน: ${formatTimer(qrTimerSeconds)} นาที` : `Time remaining: ${formatTimer(qrTimerSeconds)}`}</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {language === 'th'
                          ? '1. สแกน QR Code ด้วย Mobile Banking (K-Plus, SCB Easy, Krungthai NEXT, ฯลฯ)\n2. อัปโหลดสลิปหลักฐานการโอนเงินด้านล่าง'
                          : '1. Scan the QR code using any Thai Mobile Banking app.\n2. Upload your transfer slip below for instant confirmation.'}
                      </p>

                      {/* Slip Upload Box */}
                      <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.checkout.uploadSlip}
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{language === 'th' ? 'เลือกไฟล์สลิป' : 'Choose Slip'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSlipUpload}
                              className="hidden"
                            />
                          </label>
                          {uploadedSlip ? (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {language === 'th' ? 'แนบสลิปเรียบร้อย' : 'Slip attached'}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              {language === 'th' ? '(จำลองการแนบสลิป)' : '(Mock upload supported)'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Credit Card View */}
                {selectedPaymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-white">Secure Card Checkout</span>
                      </div>
                      <button
                        type="button"
                        onClick={autofillDemoCard}
                        className="text-xs text-pink-600 hover:text-pink-700 font-bold underline cursor-pointer"
                      >
                        {language === 'th' ? '⚡ กรอกบัตรทดสอบอัตโนมัติ' : '⚡ Auto-fill Test Card'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          {t.checkout.cardNumber}
                        </label>
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          {t.checkout.cardHolder}
                        </label>
                        <input
                          type="text"
                          value={cardData.cardHolder}
                          onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                          placeholder="NAME ON CARD"
                          className="w-full px-3.5 py-2 text-xs uppercase rounded-xl border border-pink-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            {t.checkout.expiry}
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            {t.checkout.cvv}
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            placeholder="123"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-pink-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-hidden font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. COD View */}
                {selectedPaymentMethod === 'cod' && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                    <p className="font-bold text-slate-800 dark:text-white">
                      {language === 'th' ? 'บริการเก็บเงินปลายทาง (Cash on Delivery)' : 'Cash on Delivery terms'}
                    </p>
                    <p>
                      {language === 'th'
                        ? 'ชำระเงินสดกับพนักงานจัดส่งเมื่อได้รับพัสดุ กรุณาเตรียมเงินพอดีกับยอดคำสั่งซื้อเพื่อความสะดวกรวดเร็ว'
                        : 'Pay cash directly to the courier upon delivery. Please have exact cash ready.'}
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 rounded-3xl border sticky top-24 space-y-5 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-pink-100 shadow-xl shadow-pink-100/50 text-slate-800'
            }`}>
              <h3 className="font-bold text-base font-serif-luxury text-slate-900 dark:text-white">
                {t.cart.summary}
              </h3>

              {/* Items Mini List */}
              <div className="max-h-48 overflow-y-auto space-y-3 divide-y divide-pink-100 dark:divide-slate-800 pr-1">
                {cart.map((it) => (
                  <div key={it.id} className="pt-2 flex items-center gap-3">
                    <img
                      src={it.product.images[0]}
                      alt="item"
                      className="w-12 h-14 rounded-xl object-cover bg-rose-50 shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-bold text-slate-800 dark:text-white truncate">
                        {language === 'th' ? it.product.titleTh : it.product.titleEn}
                      </p>
                      <p className="text-slate-400">
                        {it.selectedSize} • Qty: {it.quantity}
                      </p>
                      <p className="font-bold text-pink-600">
                        ฿{(it.unitPrice * it.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs sm:text-sm border-t border-pink-100 dark:border-slate-800 pt-4">
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
                    {actualShippingFee === 0 ? (
                      <span className="text-pink-500 font-bold">{t.cart.freeShipping}</span>
                    ) : (
                      `฿${actualShippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-pink-100 dark:border-slate-800">
                  <span className="font-bold text-base text-slate-900 dark:text-white">{t.cart.total}</span>
                  <span className="text-2xl font-black text-pink-600 dark:text-pink-400">
                    ฿{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-sm tracking-wider shadow-lg shadow-pink-500/35 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? (language === 'th' ? 'กำลังบันทึกคำสั่งซื้อ...' : 'Processing...') : t.checkout.placeOrder}</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                {language === 'th' ? '🔒 การสั่งซื้อได้รับการคุ้มครองความปลอดภัย 100%' : '🔒 Safe & Encrypted Checkout'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
