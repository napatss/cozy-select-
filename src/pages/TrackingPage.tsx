import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { INITIAL_ORDERS } from '../data/initialData';
import {
  Truck, Search, Package, CheckCircle2, Clock,
  MapPin, ShieldCheck, ArrowRight, Sparkles, AlertCircle, Home
} from 'lucide-react';
import { motion } from 'motion/react';

export const TrackingPage: React.FC = () => {
  const { trackOrderId, setTrackOrderId, language, t, theme, lastPlacedOrder } = useApp();
  const [searchInput, setSearchInput] = useState(trackOrderId || (lastPlacedOrder?.id || 'COZY-882101'));
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchError('');

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setFoundOrder(data.data);
      } else {
        // Local fallback
        const local = (lastPlacedOrder && (lastPlacedOrder.id === query || lastPlacedOrder.trackingNumber === query))
          ? lastPlacedOrder
          : INITIAL_ORDERS.find(o => o.id.toLowerCase() === query.toLowerCase() || (o.trackingNumber && o.trackingNumber.toLowerCase() === query.toLowerCase()));

        if (local) {
          setFoundOrder(local);
        } else {
          setFoundOrder(null);
          setSearchError(language === 'th' ? 'ไม่พบข้อมูลคำสั่งซื้อหรือเลขพัสดุนี้' : 'Order or tracking number not found');
        }
      }
    } catch {
      // Local fallback
      const local = INITIAL_ORDERS.find(o => o.id.toLowerCase() === query.toLowerCase() || (o.trackingNumber && o.trackingNumber.toLowerCase() === query.toLowerCase()));
      if (local) {
        setFoundOrder(local);
      } else {
        setSearchError('Error looking up order');
      }
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchInput) {
      handleSearch(searchInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simplified 4-stage stepper to match the "Track your package" template
  const steps = [
    { key: 'placed', labelTh: 'สั่งซื้อสำเร็จ', labelEn: 'Placed', icon: CheckCircle2 },
    { key: 'processing', labelTh: 'กำลังแพ็กสินค้า', labelEn: 'Processing', icon: Package },
    { key: 'shipped', labelTh: 'จัดส่งแล้ว', labelEn: 'Shipped', icon: Truck },
    { key: 'delivered', labelTh: 'ส่งสำเร็จ', labelEn: 'Delivered', icon: Home }
  ];

  const getActiveStepIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending': return 0;
      case 'paid': return 0;
      case 'processing': return 1;
      case 'packed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 1;
    }
  };

  const activeIndex = foundOrder ? getActiveStepIndex(foundOrder.orderStatus) : 2;
  const progressPercent = (activeIndex / (steps.length - 1)) * 100;

  const mockTimelineEvents = [
    { time: '14:20 น. วันนี้', titleTh: 'พัสดุอยู่ระหว่างนำส่งโดยพนักงานจัดส่ง', titleEn: 'Out for delivery with courier driver', location: 'สาขา วัฒนา' },
    { time: '08:45 น. วันนี้', titleTh: 'พัสดุถึงศูนย์กระจายสินค้าปลายทาง', titleEn: 'Arrived at destination distribution center', location: 'ศูนย์คัดแยก กรุงเทพฯ' },
    { time: '19:30 น. เมื่อวาน', titleTh: 'เข้ารับพัสดุจากคลังสินค้า Cozy Select', titleEn: 'Picked up from Cozy Select Warehouse', location: 'คลังสินค้า สยาม' },
    { time: '14:00 น. เมื่อวาน', titleTh: 'ยืนยันคำสั่งซื้อและพิมพ์ใบปะหน้า', titleEn: 'Order confirmed & packing slip generated', location: 'ระบบ Cozy Select' }
  ];

  const estimatedDelivery = language === 'th' ? '24 - 26 ต.ค.' : 'Oct 24 - 26';

  return (
    <div className={`relative overflow-hidden py-10 sm:py-14 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gradient-to-b from-pink-50 via-rose-50/40 to-transparent'}`}>

      {/* Decorative Y2K sparkles (desktop only) */}
      <div className="hidden md:block absolute top-10 left-10 text-pink-300 text-xl select-none">★</div>
      <div className="hidden md:block absolute bottom-16 right-16 text-pink-300 text-2xl select-none">✦</div>
      <div className="hidden md:block absolute top-1/3 left-6 text-pink-200 text-lg select-none">♡</div>
      <div className="hidden md:block absolute bottom-10 right-10 text-pink-300 text-xl select-none">✦</div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

        {/* Brand Logo */}
        <div className="flex justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg border-4 border-pink-200 bg-white flex items-center justify-center">
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-pink-500 text-center leading-tight italic">
              Cozy<br />Select
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>{language === 'th' ? 'ติดตามพัสดุของคุณ' : 'Track your packagerack'}</span>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'th' ? 'กรอกเลขคำสั่งซื้อของคุณเพื่อดูว่าพัสดุไปถึงไหนแล้ว' : t.track.subtitle}
          </p>
        </div>

        {/* Search Pill */}
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchInput); }} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.track.inputPlaceholder || '#Order ID (e.g. CS-9921)'}
              className="w-full pl-6 pr-32 py-4 rounded-full border-2 border-pink-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-pink-400 font-medium text-sm placeholder-slate-400 shadow-[0_4px_20px_rgba(255,193,204,0.35)] transition-all"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-slate-900 dark:bg-pink-500 text-white text-xs font-bold uppercase tracking-wide hover:bg-pink-600 transition-colors shadow-md cursor-pointer"
            >
              {isSearching ? '...' : (t.track.trackButton || 'Track')}
            </button>
          </form>

          {/* Quick Demo Selectors */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>{language === 'th' ? 'ตัวอย่าง:' : 'Sample IDs:'}</span>
            <button
              onClick={() => { setSearchInput('COZY-882101'); handleSearch('COZY-882101'); }}
              className="font-mono text-pink-500 hover:underline"
            >
              COZY-882101
            </button>
            <span>•</span>
            <button
              onClick={() => { setSearchInput('COZY-882102'); handleSearch('COZY-882102'); }}
              className="font-mono text-pink-500 hover:underline"
            >
              COZY-882102
            </button>
          </div>

          {searchError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Result Card */}
        {foundOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border space-y-8 ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 backdrop-blur-md border-pink-100 shadow-xl shadow-pink-100/40 text-slate-800'
            }`}
          >
            {/* Watermark truck icon */}
            <Truck className="w-20 h-20 text-pink-100 dark:text-slate-800 absolute top-4 right-4 pointer-events-none" />

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-900 dark:text-white">
                Order #{foundOrder.id}
              </h2>
            </div>

            {/* Timeline (Placed / Processing / Shipped / Delivered) */}
            <div className="relative w-full">
              <div className="absolute top-4 sm:top-5 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
              <div
                className="absolute top-4 sm:top-5 left-0 h-1 bg-pink-300 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.6)] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="relative flex justify-between">
                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  const isDone = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;
                  return (
                    <div key={st.key} className="flex flex-col items-center gap-2 text-center w-1/4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md transition-all ${
                        isCurrent
                          ? 'bg-pink-500 text-white animate-pulse shadow-pink-400/60'
                          : isDone
                          ? 'bg-pink-400 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
                        isCurrent ? 'text-pink-600' : isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                      }`}>
                        {language === 'th' ? st.labelTh : st.labelEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Details + Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-pink-50/40 dark:bg-slate-800/50 rounded-2xl p-6 border border-pink-100 dark:border-slate-700">

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 border-b border-pink-100 dark:border-slate-700 pb-2">
                  {language === 'th' ? 'ข้อมูลการจัดส่ง' : 'Courier Details'}
                </h3>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'th' ? 'คาดว่าจะถึงวันที่:' : 'Estimated Delivery:'}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-pink-600">{estimatedDelivery}</p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm border border-pink-100 dark:border-slate-700">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-950 rounded-full flex items-center justify-center text-pink-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{foundOrder.shippingMethod?.nameTh || 'Speedy Express'}</p>
                    <p className="text-[11px] text-slate-500">
                      {language === 'th' ? 'เลขพัสดุ:' : 'Tracking:'} {foundOrder.trackingNumber || 'SPX88392011'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location badge panel (stand-in for the map graphic) */}
              <div className="rounded-2xl overflow-hidden h-40 sm:h-44 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-slate-800 dark:to-slate-900 relative flex items-center justify-center border border-pink-100 dark:border-slate-700">
                <MapPin className="w-16 h-16 text-pink-300 dark:text-slate-700 absolute opacity-50" />
                <div className="z-10 bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-full text-xs font-bold text-pink-600 shadow-md flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{mockTimelineEvents[0]?.location || (language === 'th' ? 'อยู่ระหว่างขนส่ง' : 'In Transit')}</span>
                </div>
              </div>
            </div>

            {/* Journey Checkpoints */}
            <div className="pt-2 border-t border-pink-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2 pt-4">
                <Clock className="w-4 h-4 text-pink-500" />
                <span>{language === 'th' ? 'ประวัติการเดินทางของพัสดุ' : 'Tracking Event Checkpoints'}</span>
              </h3>

              <div className="space-y-4 pl-3 border-l-2 border-pink-200 dark:border-slate-700 ml-3">
                {mockTimelineEvents.map((evt, i) => (
                  <div key={i} className="relative pl-4 space-y-0.5">
                    <div className={`w-3 h-3 rounded-full absolute -left-[19px] top-1 border-2 border-white dark:border-slate-900 ${
                      i === 0 ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-0.5">
                      <span className="font-bold text-slate-800 dark:text-white">
                        {language === 'th' ? evt.titleTh : evt.titleEn}
                      </span>
                      <span className="text-[11px] text-pink-500 font-semibold">{evt.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{evt.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Items */}
            <div className="pt-4 border-t border-pink-100 dark:border-slate-800">
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">
                {language === 'th' ? 'สินค้าในพัสดุชิ้นนี้' : 'Items in this Shipment'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {foundOrder.items.map((it: any) => (
                  <div key={it.id} className="p-2.5 rounded-xl bg-pink-50/40 dark:bg-slate-800/40 border border-pink-100 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src={it.product.images[0]}
                      alt="item"
                      className="w-12 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="text-xs min-w-0 flex-1">
                      <p className="font-bold truncate text-slate-800 dark:text-white">{it.product.titleTh}</p>
                      <p className="text-slate-400">Size: {it.selectedSize} • Qty: {it.quantity}</p>
                      <p className="text-pink-600 font-bold">฿{(it.unitPrice * it.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};
