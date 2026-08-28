import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, ProductSortOption } from '../types';
import { Filter, SlidersHorizontal, Sparkles, ArrowUpDown, X, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductListPage: React.FC = () => {
  const { products, activeCategory, setActiveCategory, language, t, theme } = useApp();

  const [sortOption, setSortOption] = useState<ProductSortOption>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: t.categories.all },
    { id: 'new', label: t.categories.new },
    { id: 'crop_top', label: t.categories.crop_top },
    { id: 'baby_tees', label: t.categories.baby_tees },
    { id: 'tank_tops', label: t.categories.tank_tops },
    { id: 't_shirts', label: t.categories.t_shirts },
    { id: 'pants', label: t.categories.pants },
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory === 'new' && !p.isNew) return false;
      if (activeCategory !== 'all' && activeCategory !== 'new' && p.category !== activeCategory) {
        return false;
      }
      // In-stock filter
      if (inStockOnly && p.stock <= 0) return false;
      // Price filter
      if (p.price > maxPrice) return false;
      // Size filter
      if (selectedSizeFilter !== 'all' && !p.sizes.includes(selectedSizeFilter)) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'best_seller') return b.rating - a.rating;
      // Default: newest
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [products, activeCategory, sortOption, inStockOnly, maxPrice, selectedSizeFilter]);

  const resetFilters = () => {
    setInStockOnly(false);
    setMaxPrice(2000);
    setSelectedSizeFilter('all');
    setSortOption('newest');
  };

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-pink-500 font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'แคตตาล็อกสินค้า' : 'Product Catalog'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 dark:text-white">
            {categories.find(c => c.id === activeCategory)?.label || t.nav.allProducts}
          </h1>
        </div>

        {/* Category Tabs (Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                  : theme === 'dark'
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters and Sorting Bar */}
        <div className={`p-4 rounded-2xl border mb-8 flex flex-wrap items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/90 border-pink-100 shadow-sm'
        }`}>
          {/* Left: Filter Toggle & Results Count */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 text-xs font-bold hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isFilterDrawerOpen ? (language === 'th' ? 'ซ่อนตัวกรอง' : 'Hide Filters') : (language === 'th' ? 'ตัวกรองเพิ่มเติม' : 'Filter Options')}</span>
            </button>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'th' ? `พบสินค้า ${filteredProducts.length} รายการ` : `Showing ${filteredProducts.length} products`}
            </span>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">{t.filters.sortBy}:</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as ProductSortOption)}
                className={`pl-3 pr-8 py-1.5 text-xs font-bold rounded-xl border outline-hidden transition-colors cursor-pointer appearance-none ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-rose-50/40 border-pink-200 text-slate-800'
                }`}
              >
                <option value="newest">{t.filters.newest}</option>
                <option value="price_asc">{t.filters.priceLowHigh}</option>
                <option value="price_desc">{t.filters.priceHighLow}</option>
                <option value="best_seller">{t.filters.bestSeller}</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        {isFilterDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-5 rounded-2xl border mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-pink-50/30 border-pink-100 text-slate-800'
            }`}
          >
            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span>{t.filters.priceRange}</span>
                <span className="text-pink-500 font-black">฿0 - ฿{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={200}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* In-stock Only */}
            <div className="flex items-center">
              <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-500 accent-pink-500 focus:ring-pink-400"
                />
                <span>{t.filters.inStockOnly}</span>
              </label>
            </div>

            {/* Size Filter */}
            <div>
              <span className="text-xs font-bold block mb-2">{t.filters.size}</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSizeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    selectedSizeFilter === 'all'
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-pink-300'
                  }`}
                >
                  All
                </button>
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSizeFilter(sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedSizeFilter === sz
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-pink-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end justify-start sm:justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-pink-600 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-pink-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.filters.resetFilters}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Responsive Product Grid: 4 Desktop / 3 Tablet / 2 Mobile */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-rose-50/20 dark:bg-slate-900/30 rounded-3xl border border-dashed border-pink-200 dark:border-slate-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center mx-auto text-pink-500">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-serif-luxury">
              {language === 'th' ? 'ไม่พบสินค้าที่ตรงกับเงื่อนไข' : 'No products match your filters'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {language === 'th' ? 'ลองปรับตัวกรองราคาหรือเลือกหมวดหมู่อื่นดูนะคะ' : 'Try adjusting your price range or clearing selected filters.'}
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-pink-500 text-white text-xs font-bold shadow-md hover:bg-pink-600 transition-colors"
            >
              {t.filters.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
