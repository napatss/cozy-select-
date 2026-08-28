import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Eye, Star, Flame, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    language, 
    viewProductDetail, 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    setQuickViewProduct,
    t,
    theme 
  } = useApp();

  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const currentImage = (isHovered && product.images.length > 1) 
    ? product.images[1] 
    : product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    // Default to first color and size
    const color = product.colors[0];
    const size = product.sizes[0];
    addToCart(product, color, size, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      onClick={() => viewProductDetail(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        theme === 'dark'
          ? 'bg-slate-900/70 border-slate-800 hover:border-electric-pink/50 hover:shadow-xl hover:shadow-pink-950/20'
          : 'bg-white border-primary-container/40/80 hover:border-baby-pink hover:shadow-xl hover:shadow-baby-pink/40'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-primary-container/15/40">
        <img
          src={currentImage}
          alt={language === 'th' ? product.titleTh : product.titleEn}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSoldOut ? 'grayscale-70 opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-gradient-to-r from-electric-pink to-baby-pink text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t.product.newBadge}
            </span>
          )}
          {product.isSale && product.discountPercent && (
            <span className="bg-tertiary text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">
              -{product.discountPercent}% {t.product.saleBadge}
            </span>
          )}
        </div>

        {/* SOLD OUT Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center z-20">
            <div className="border-2 border-white/90 text-white font-serif-luxury font-black text-sm sm:text-base tracking-widest px-4 py-1.5 rounded-lg bg-black/40 rotate-[-6deg] shadow-lg">
              {t.product.soldOut}
            </div>
            <p className="text-[11px] text-baby-pink mt-2 font-medium">
              {language === 'th' ? 'สินค้าหมดชั่วคราว' : 'Out of stock'}
            </p>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 cursor-pointer ${
            isWishlisted
              ? 'bg-electric-pink text-white shadow-md shadow-electric-pink/40'
              : 'bg-white/80 text-slate-700 hover:text-electric-pink dark:bg-slate-900/80 dark:text-slate-200'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Hover Button (Desktop) */}
        {!isSoldOut && (
          <div className="hidden sm:flex absolute bottom-3 inset-x-3 gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
            <button
              onClick={handleQuickView}
              className="flex-1 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white text-xs font-semibold backdrop-blur-md hover:bg-electric-pink hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              {t.product.quickView}
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-2.5">
        
        {/* Rating & Stock Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
          </div>

          {/* Stock Badges */}
          {isSoldOut ? (
            <span className="text-[11px] font-bold text-tertiary dark:text-baby-pink">
              {t.product.soldOut}
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 text-amber-500" />
              {t.product.lowStock.replace('{count}', String(product.stock))}
            </span>
          ) : (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {t.product.inStock} ({product.stock})
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-electric-pink transition-colors leading-snug">
          {language === 'th' ? product.titleTh : product.titleEn}
        </h3>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 py-0.5">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={language === 'th' ? c.nameTh : c.nameEn}
              />
            ))}
            {product.colors.length > 1 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{product.colors.length} {language === 'th' ? 'สี' : 'colors'}
              </span>
            )}
          </div>
        )}

        {/* Price and Add to Cart Section */}
        <div className="pt-2 border-t border-primary-container/40/60 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-tertiary dark:text-electric-pink">
                ฿{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ฿{product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            disabled={isSoldOut}
            onClick={handleQuickAdd}
            className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
              isSoldOut
                ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                : 'bg-primary-container/20 text-tertiary hover:bg-electric-pink hover:text-white dark:bg-slate-800 dark:text-electric-pink dark:hover:bg-electric-pink dark:hover:text-white shadow-xs'
            }`}
            title={isSoldOut ? t.product.soldOut : t.product.addToCart}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
