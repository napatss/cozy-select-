import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { PromoBanners } from '../components/PromoBanners';
import { ProductCard } from '../components/ProductCard';
import { LookbookSection } from '../components/LookbookSection';
import { Sparkles, ArrowRight, Flame, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { products, setActiveView, setActiveCategory, t, language } = useApp();

  // Featured New In Products (first 4-8 items with isNew or highest rating)
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = products.filter(p => p.rating >= 4.8).slice(0, 4);

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* 1. Hero Fashion Showcase */}
      <HeroSection />

      {/* 2. Shop by Category Grid */}
      <CategorySection />

      {/* 3. Promo Banners & Discounts */}
      <PromoBanners />

      {/* 4. New Arrivals Showcase */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-electric-pink uppercase tracking-widest mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW ARRIVALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
                {t.home.newArrivalsTitle}
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveCategory('new');
                setActiveView('products');
              }}
              className="text-xs sm:text-sm font-bold text-electric-pink hover:text-tertiary flex items-center gap-1 group cursor-pointer"
            >
              <span>{t.home.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Best Seller Showcase */}
      <section className="py-10 sm:py-14 bg-primary-container/15/30 dark:bg-slate-900/30 border-y border-primary-container/40/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-electric-pink uppercase tracking-widest mb-2.5">
                <Flame className="w-3.5 h-3.5 text-electric-pink" />
                <span>TRENDING NOW</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
                {t.home.bestSellersTitle}
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveView('products');
              }}
              className="text-xs sm:text-sm font-bold text-electric-pink hover:text-tertiary flex items-center gap-1 group cursor-pointer"
            >
              <span>{t.home.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. Instagram Lookbook & Customer Testimonials */}
      <LookbookSection />
    </div>
  );
};
