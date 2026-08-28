import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory } from '../types';
import { Sparkles, ArrowRight, Grid } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryCardItem {
  id: ProductCategory;
  nameTh: string;
  nameEn: string;
  count: number;
  image: string;
  tag: string;
}

export const CategorySection: React.FC = () => {
  const { language, setActiveCategory, setActiveView, t, theme } = useApp();

  const categories: CategoryCardItem[] = [
    {
      id: 'all',
      nameTh: 'สินค้าทั้งหมด',
      nameEn: 'All Collection',
      count: 20,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      tag: 'Explore All'
    },
    {
      id: 'new',
      nameTh: 'สินค้าใหม่',
      nameEn: 'New Arrivals',
      count: 8,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      tag: 'This Week'
    },
    {
      id: 'crop_top',
      nameTh: 'เสื้อครอป',
      nameEn: 'Crop Tops',
      count: 6,
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
      tag: 'Best Seller'
    },
    {
      id: 'baby_tees',
      nameTh: 'Baby Tees',
      nameEn: 'Baby Tees Y2K',
      count: 5,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      tag: 'Trending'
    },
    {
      id: 'tank_tops',
      nameTh: 'เสื้อกล้าม / สายเดี่ยว',
      nameEn: 'Tanks & Camis',
      count: 5,
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
      tag: 'Essential'
    },
    {
      id: 't_shirts',
      nameTh: 'เสื้อยืด',
      nameEn: 'Oversized T-Shirts',
      count: 4,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      tag: 'Comfy Fit'
    },
    {
      id: 'pants',
      nameTh: 'กางเกง',
      nameEn: 'Pants & Bottoms',
      count: 6,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      tag: 'Y2K Street'
    }
  ];

  const handleCategoryClick = (catId: ProductCategory) => {
    setActiveCategory(catId);
    setActiveView('products');
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-electric-pink uppercase tracking-widest mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.categories.title}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
              {t.categories.subtitle}
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveView('products');
            }}
            className="text-xs sm:text-sm font-bold text-electric-pink hover:text-tertiary flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
          >
            <span>{t.home.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleCategoryClick(cat.id)}
              className={`group relative rounded-2xl overflow-hidden aspect-4/5 cursor-pointer border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-slate-800 hover:border-electric-pink/50 shadow-md shadow-black/40' 
                  : 'border-primary-container/40 hover:border-baby-pink shadow-md shadow-baby-pink/30'
              }`}
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={language === 'th' ? cat.nameTh : cat.nameEn}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Tag Badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-tertiary backdrop-blur-md shadow-xs">
                  {cat.tag}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-3 inset-x-3 text-white">
                <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-baby-pink transition-colors">
                  {language === 'th' ? cat.nameTh : cat.nameEn}
                </h3>
                <p className="text-[11px] text-baby-pink/90 mt-0.5">
                  {cat.count} {language === 'th' ? 'รายการ' : 'styles'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
