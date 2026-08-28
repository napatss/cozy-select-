import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Heart, ShoppingBag, User, Sun, Moon, 
  Menu, X, Sparkles, ShieldCheck, Truck, ChevronDown, 
  ArrowRight, Tag, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCategory } from '../types';

export const Navbar: React.FC = () => {
  const { 
    language, setLanguage, 
    theme, setTheme, 
    t, 
    activeView, setActiveView,
    activeCategory, setActiveCategory,
    cartCount, 
    wishlist,
    products,
    viewProductDetail,
    currentUser,
    isAdminLoggedIn,
    setIsAuthModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for live search dropdown
  const searchResults = searchQuery.trim() === '' ? [] : products.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.titleTh.toLowerCase().includes(q) ||
      p.titleEn.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.descriptionTh.toLowerCase().includes(q)
    );
  }).slice(0, 6);

  const handleCategoryNav = (cat: ProductCategory) => {
    setActiveCategory(cat);
    setActiveView('products');
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
  };

  const navLinks: { label: string; category?: ProductCategory; view?: any }[] = [
    { label: t.nav.home, view: 'home' },
    { label: t.nav.allProducts, category: 'all' },
    { label: t.nav.newArrivals, category: 'new' },
    { label: t.nav.cropTop, category: 'crop_top' },
    { label: t.nav.babyTees, category: 'baby_tees' },
    { label: t.nav.tankTops, category: 'tank_tops' },
    { label: t.nav.tShirts, category: 't_shirts' },
    { label: t.nav.pants, category: 'pants' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-electric-pink via-baby-pink to-electric-pink text-white text-xs py-1.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-baby-pink animate-pulse" />
            <span>{language === 'th' ? '✨ โค้ดลดพิเศษ: ใส่โค้ด "COZY10" ลด 10% | ส่งฟรีเมื่อช้อปครบ ฿990' : '✨ PROMO: USE CODE "COZY10" FOR 10% OFF | FREE SHIPPING OVER ฿990'}</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs">
            <button 
              onClick={() => setActiveView('track')}
              className="flex items-center gap-1.5 hover:text-primary-container/40 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t.nav.trackOrder}</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3 h-3" />
                <span className="font-semibold">{language === 'th' ? 'EN' : 'ไทย'}</span>
              </button>

              {/* Theme Switch */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className={`transition-colors duration-200 border-b ${
        theme === 'dark' 
          ? 'bg-slate-950/85 text-slate-100 border-slate-800 backdrop-blur-md' 
          : 'bg-white/85 text-slate-800 border-primary-container/40 backdrop-blur-md shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-primary-container/40 hover:bg-primary-container/20'
                }`}
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-electric-pink" /> : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div 
              onClick={() => { setActiveView('home'); setActiveCategory('all'); }}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-electric-pink to-baby-pink flex items-center justify-center shadow-md shadow-baby-pink/40 text-white font-bold text-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Cozy <span className="text-electric-pink italic">Select</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-electric-pink -mt-1">
                  Korean & Y2K Fashion
                </span>
              </div>
            </div>

            {/* Real-time Search Bar (Desktop) */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={t.nav.searchPlaceholder}
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-full border outline-hidden transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-400 focus:border-electric-pink focus:ring-2 focus:ring-electric-pink/20'
                      : 'bg-primary-container/15/50 border-baby-pink/80 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-electric-pink focus:ring-2 focus:ring-baby-pink/30'
                  }`}
                />
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-electric-pink" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Dropdown Results */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() !== '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border p-3 z-50 overflow-hidden ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-primary-container/40'
                    }`}
                  >
                    <div className="text-xs font-semibold text-electric-pink uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
                      <span>{language === 'th' ? `ผลการค้นหา (${searchResults.length})` : `Search Results (${searchResults.length})`}</span>
                      <span className="text-[11px] lowercase text-slate-400">press product to view</span>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">
                        {language === 'th' ? 'ไม่พบสินค้าที่ตรงกับการค้นหา' : 'No products found'}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {searchResults.map(product => (
                          <div
                            key={product.id}
                            onClick={() => {
                              viewProductDetail(product.id);
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-primary-container/20/80'
                            }`}
                          >
                            <img
                              src={product.images[0]}
                              alt={product.titleTh}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-100">
                                {language === 'th' ? product.titleTh : product.titleEn}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-electric-pink">฿{product.price.toLocaleString()}</span>
                                {product.compareAtPrice && (
                                  <span className="text-[11px] text-slate-400 line-through">฿{product.compareAtPrice.toLocaleString()}</span>
                                )}
                                {product.stock === 0 ? (
                                  <span className="text-[10px] bg-primary-container/30 text-tertiary font-bold px-1.5 py-0.5 rounded">SOLD OUT</span>
                                ) : product.stock < 5 ? (
                                  <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-1.5 py-0.5 rounded">
                                    {language === 'th' ? `เหลือ ${product.stock}` : `${product.stock} left`}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setActiveCategory('all');
                            setActiveView('products');
                            setIsSearchFocused(false);
                          }}
                          className="mt-2 text-center text-xs font-semibold text-electric-pink hover:text-tertiary py-1.5 border-t border-primary-container/40 dark:border-slate-800"
                        >
                          {language === 'th' ? 'ดูสินค้าทั้งหมดในร้าน →' : 'View all products →'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Wishlist Button */}
              <button
                onClick={() => setActiveView('wishlist')}
                className={`relative p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  activeView === 'wishlist'
                    ? 'bg-electric-pink text-white shadow-md shadow-baby-pink'
                    : theme === 'dark'
                    ? 'hover:bg-slate-800 text-slate-300 hover:text-electric-pink'
                    : 'hover:bg-primary-container/20 text-slate-700 hover:text-electric-pink'
                }`}
                title={t.nav.wishlist}
              >
                <Heart className="w-5 h-5" fill={activeView === 'wishlist' ? 'currentColor' : 'none'} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-electric-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setActiveView('cart')}
                className={`relative p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  activeView === 'cart'
                    ? 'bg-electric-pink text-white shadow-md shadow-baby-pink'
                    : theme === 'dark'
                    ? 'hover:bg-slate-800 text-slate-300 hover:text-electric-pink'
                    : 'hover:bg-primary-container/20 text-slate-700 hover:text-electric-pink'
                }`}
                title={t.nav.cart}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-electric-pink to-tertiary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-electric-pink/40"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* User Account / Login */}
              <button
                onClick={() => {
                  if (currentUser) {
                    setActiveView('profile');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  activeView === 'profile'
                    ? 'bg-electric-pink text-white border-electric-pink shadow-sm'
                    : theme === 'dark'
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-200'
                    : 'border-baby-pink/70 hover:bg-primary-container/20 text-slate-700'
                }`}
              >
                <User className="w-4 h-4 text-electric-pink" />
                <span className="hidden md:inline">
                  {currentUser ? currentUser.name.split(' ')[0] : t.nav.login}
                </span>
              </button>

              {/* Admin Portal Entry Link */}
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-electric-pink dark:border-electric-pink'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
                title="Admin Control Center"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-electric-pink" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>

          {/* Desktop Categories Sub-Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-1 py-2.5 border-t border-primary-container/40/60 dark:border-slate-800/80 text-sm font-medium">
            {navLinks.map((item, idx) => {
              const isSelected = item.view 
                ? activeView === item.view 
                : activeView === 'products' && activeCategory === item.category;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.view) {
                      setActiveView(item.view);
                    } else if (item.category) {
                      handleCategoryNav(item.category);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-electric-pink text-white font-semibold shadow-xs shadow-baby-pink'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:text-electric-pink hover:bg-slate-800/60'
                      : 'text-slate-700 hover:text-tertiary hover:bg-primary-container/20/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-b overflow-hidden shadow-xl ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-primary-container/40 text-slate-800'
            }`}
          >
            <div className="p-4 flex flex-col gap-3">
              {/* Mobile Search input */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.nav.searchPlaceholder}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-hidden ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-primary-container/15/50 border-baby-pink text-slate-800'
                  }`}
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-electric-pink" />
              </div>

              {/* Category Links */}
              <div className="grid grid-cols-2 gap-1.5 pt-2">
                {navLinks.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.view) {
                        setActiveView(item.view);
                      } else if (item.category) {
                        handleCategoryNav(item.category);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      (item.view && activeView === item.view) || (activeView === 'products' && activeCategory === item.category)
                        ? 'bg-electric-pink text-white'
                        : theme === 'dark'
                        ? 'bg-slate-800/70 hover:bg-slate-800'
                        : 'bg-primary-container/20/60 hover:bg-primary-container/40/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Extra Mobile Actions */}
              <div className="pt-3 border-t border-primary-container/40 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => { setActiveView('track'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-1.5 text-electric-pink font-semibold"
                >
                  <Truck className="w-4 h-4" />
                  {t.nav.trackOrder}
                </button>
                <button
                  onClick={() => { setActiveView('admin'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-1.5 text-slate-500 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-electric-pink" />
                  {t.nav.admin}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
