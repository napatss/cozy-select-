import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Mail, Phone, MapPin, Instagram, 
  Send, ShieldCheck, Truck, RefreshCw, CreditCard, 
  ChevronRight, Heart 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveCategory, setActiveView, showToast, t, theme } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeModalInfo, setActiveModalInfo] = useState<{ title: string; content: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast(language === 'th' ? 'กรุณากรอกอีเมลให้ถูกต้อง' : 'Please enter a valid email', 'error');
      return;
    }
    showToast(
      language === 'th' 
        ? 'ขอบคุณที่ติดตามข่าวสาร! รับโค้ด WELCOME ลด 15% ในอีเมล' 
        : 'Thank you for subscribing! Check your email for code WELCOME 15% off', 
      'success'
    );
    setNewsletterEmail('');
  };

  const openPolicy = (type: 'faq' | 'shipping' | 'return' | 'privacy' | 'terms') => {
    const policies = {
      faq: {
        title: language === 'th' ? 'คำถามที่พบบ่อย (FAQ)' : 'Frequently Asked Questions (FAQ)',
        content: language === 'th' 
          ? 'Q: สินค้าจัดส่งกี่วันถึง?\nA: จัดส่งผ่าน Flash / Kerry / J&T ใช้เวลา 1-2 วันทำการ ทั่วประเทศ\n\nQ: มีบริการเก็บเงินปลายทางไหม?\nA: มีบริการ COD สามารถเลือกในหน้าชำระเงินได้เลยค่ะ\n\nQ: วิธีดูแลรักษาเสื้อผ้า?\nA: แนะนำซักมือหรือใส่ถุงซักถนอมผ้า รีดด้านในเพื่อถนอมลายสกรีนและเพชรคริสตัล'
          : 'Q: How long does delivery take?\nA: Domestic express shipping takes 1-2 business days.\n\nQ: Do you offer Cash on Delivery?\nA: Yes, COD is supported at checkout.\n\nQ: Care instructions?\nA: Hand wash cold or gentle machine cycle in laundry bag. Iron inside out.'
      },
      shipping: {
        title: language === 'th' ? 'นโยบายการจัดส่ง (Shipping Policy)' : 'Shipping Policy',
        content: language === 'th'
          ? 'ทางร้าน Cozy Select จัดส่งสินค้าทุกวันจันทร์ - เสาร์ (ตัดรอบ 14:00 น.)\n- Flash Express: ฿35 (1-2 วัน)\n- J&T Express: ฿40 (1-2 วัน)\n- Kerry Express: ฿45 (1-2 วัน)\n- ไปรษณีย์ไทย EMS: ฿50 (1-3 วัน)\n✨ ช้อปครบ ฿990 รับสิทธิ์ ส่งฟรี ทั่วประเทศ!'
          : 'Cozy Select ships Mon-Sat (14:00 cutoff).\n- Flash Express: ฿35 (1-2 days)\n- J&T Express: ฿40 (1-2 days)\n- Kerry Express: ฿45 (1-2 days)\n- Thai Post EMS: ฿50 (1-3 days)\n✨ FREE SHIPPING on all orders over ฿990!'
      },
      return: {
        title: language === 'th' ? 'นโยบายการเปลี่ยน/คืนสินค้า (Return & Refund)' : 'Return & Refund Policy',
        content: language === 'th'
          ? 'สามารถเปลี่ยนไซส์หรือคืนสินค้าได้ภายใน 7 วัน นับจากวันที่ได้รับพัสดุ\nเงื่อนไข:\n1. สินค้าต้องอยู่ในสภาพสมบูรณ์ ไม่ผ่านการซัก ป้ายแท็กครบ\n2. กรณีสินค้าชำรุดจากทางร้าน ทางร้านรับผิดชอบค่าส่งเปลี่ยนฟรี 100%'
          : 'Size exchanges and returns accepted within 7 days of delivery.\nConditions:\n1. Items must be unworn, unwashed with original tags attached.\n2. In case of defective items, we cover all shipping costs.'
      },
      privacy: {
        title: language === 'th' ? 'นโยบายความเป็นส่วนตัว (Privacy Policy)' : 'Privacy Policy',
        content: language === 'th'
          ? 'Cozy Select ให้ความสำคัญสูงสุดกับความปลอดภัยของข้อมูลผู้ใช้ ข้อมูลส่วนบุคคล เช่น ชื่อ ที่อยู่ เบอร์โทรศัพท์ และอีเมล จะถูกนำมาใช้เพื่อการจัดส่งสินค้าและประสานงานคำสั่งซื้อเท่านั้น ข้อมูลการชำระเงินในระบบ Demo มีความปลอดภัย ไม่มีการจัดเก็บข้อมูลบัตรเครดิตจริง'
          : 'Cozy Select respects your privacy. Personal data (Name, address, phone, email) is strictly used for fulfilling orders and service updates. Payment sandbox does not store actual credit cards.'
      },
      terms: {
        title: language === 'th' ? 'ข้อกำหนดและเงื่อนไข (Terms & Conditions)' : 'Terms & Conditions',
        content: language === 'th'
          ? 'การสั่งซื้อสินค้าผ่านเว็บไซต์ Cozy Select ถือว่าผู้ซื้อยอมรับข้อกำหนดเรื่องราคา สต็อก และเงื่อนไขการรับประกันสินค้า สินค้าทุกชิ้นได้รับการตรวจสอบคุณภาพมาตรฐาน QC ก่อนจัดส่ง'
          : 'By placing an order on Cozy Select, you agree to our pricing, stock availability, and guarantee terms. All items pass strict quality control prior to dispatch.'
      }
    };

    setActiveModalInfo(policies[type]);
  };

  return (
    <footer className={`border-t transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-slate-950 text-slate-300 border-slate-800'
        : 'bg-white text-slate-600 border-primary-container/40'
    }`}>
      
      {/* Top Newsletter & Promo Banner */}
      <div className="border-b border-primary-container/40 dark:border-slate-800 py-10 bg-primary-container/15/40 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-electric-pink" />
              <span>{language === 'th' ? 'รับส่วนลด 15% สำหรับการสั่งซื้อแรก' : 'Get 15% OFF Your First Order'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'th' ? 'สมัครรับจดหมายข่าวเพื่อรับโค้ดส่วนลดและอัปเดตแฟชั่นใหม่ก่อนใคร' : 'Subscribe to receive exclusive drop alerts & secret VIP discount codes'}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={language === 'th' ? 'กรอกอีเมลของคุณ...' : 'Enter your email address...'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-baby-pink dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-hidden focus:border-electric-pink focus:ring-2 focus:ring-baby-pink/30 text-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-electric-pink hover:bg-tertiary text-white font-bold text-xs tracking-wider shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>{language === 'th' ? 'สมัครรับสิทธิ์' : 'Subscribe'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-electric-pink to-baby-pink flex items-center justify-center text-white font-bold shadow-md shadow-baby-pink">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif-luxury text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Cozy <span className="text-electric-pink italic">Select</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              {language === 'th'
                ? 'Cozy Select แบรนด์เสื้อผ้าแฟชั่นสไตล์เกาหลี + Y2K คัดสรรเนื้อผ้าคุณภาพสูง ดีไซน์น่ารัก ผสมผสานความหรูหราและความสบายในทุกวันของคุณ'
                : 'Cozy Select is a curated Korean & Y2K fashion label celebrating effortless cuteness, luxury aesthetics, and ultimate everyday comfort.'}
            </p>

            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-electric-pink shrink-0" />
                <span>Siam Square One, Pathum Wan, Bangkok 10330</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-electric-pink shrink-0" />
                <span>02-888-COZY (02-888-2699)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-electric-pink shrink-0" />
                <span>hello@cozyselect.com</span>
              </p>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              {language === 'th' ? 'หมวดหมู่สินค้า' : 'Shop Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveCategory('all'); setActiveView('products'); }} className="hover:text-electric-pink transition-colors">
                  {t.categories.all}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('new'); setActiveView('products'); }} className="hover:text-electric-pink transition-colors">
                  {t.categories.new}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('crop_top'); setActiveView('products'); }} className="hover:text-electric-pink transition-colors">
                  {t.categories.crop_top}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('baby_tees'); setActiveView('products'); }} className="hover:text-electric-pink transition-colors">
                  {t.categories.baby_tees}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('tank_tops'); setActiveView('products'); }} className="hover:text-electric-pink transition-colors">
                  {t.categories.tank_tops}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('pants'); setActiveView('products'); }} className="hover:text-electric-pink transition-colors">
                  {t.categories.pants}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              {language === 'th' ? 'บริการลูกค้า' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('track')} className="hover:text-electric-pink transition-colors flex items-center gap-1">
                  <span>{t.nav.trackOrder}</span>
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('faq')} className="hover:text-electric-pink transition-colors">
                  {language === 'th' ? 'คำถามที่พบบ่อย (FAQ)' : 'FAQ'}
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('shipping')} className="hover:text-electric-pink transition-colors">
                  {language === 'th' ? 'นโยบายการจัดส่ง' : 'Shipping Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('return')} className="hover:text-electric-pink transition-colors">
                  {language === 'th' ? 'การเปลี่ยนและคืนสินค้า' : 'Returns & Refunds'}
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('privacy')} className="hover:text-electric-pink transition-colors">
                  {language === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('terms')} className="hover:text-electric-pink transition-colors">
                  {language === 'th' ? 'ข้อกำหนดและเงื่อนไข' : 'Terms of Service'}
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Social */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'th' ? 'ช่องทางชำระเงิน' : 'Payment Methods'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded-md bg-primary-container/40/70 dark:bg-slate-800 text-[10px] font-bold text-pink-700 dark:text-baby-pink">PromptPay QR</span>
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">VISA</span>
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">Mastercard</span>
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">JCB</span>
              <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-slate-800 text-[10px] font-bold text-emerald-700">K-Plus / SCB</span>
              <span className="px-2 py-1 rounded-md bg-amber-100 dark:bg-slate-800 text-[10px] font-bold text-amber-800">COD ปลายทาง</span>
            </div>

            <h4 className="font-bold text-sm text-slate-900 dark:text-white pt-2">
              {language === 'th' ? 'ติดตามเรา' : 'Follow Cozy Community'}
            </h4>
            <div className="flex items-center gap-2">
              <a href="#instagram" className="p-2 rounded-full bg-primary-container/20 dark:bg-slate-800 hover:bg-electric-pink hover:text-white text-electric-pink transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#tiktok" className="p-2 rounded-full bg-primary-container/20 dark:bg-slate-800 hover:bg-electric-pink hover:text-white text-electric-pink transition-colors font-bold text-xs">
                TikTok
              </a>
              <a href="#line" className="p-2 rounded-full bg-primary-container/20 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-emerald-600 transition-colors font-bold text-xs">
                Line: @cozyselect
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-primary-container/40 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 Cozy Select Co., Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with love for Korean Y2K Fashion lovers</span>
            <Heart className="w-3.5 h-3.5 text-electric-pink fill-electric-pink inline" />
          </p>
        </div>
      </div>

      {/* Policy Modal */}
      {activeModalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl shadow-2xl border border-primary-container/40 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-luxury">{activeModalInfo.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {activeModalInfo.content}
            </p>
            <button
              onClick={() => setActiveModalInfo(null)}
              className="w-full py-2.5 rounded-xl bg-electric-pink text-white font-bold text-xs hover:bg-tertiary transition-colors cursor-pointer"
            >
              {language === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
