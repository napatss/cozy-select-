import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Heart, ShoppingBag, Check, Flame, ArrowRight, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductColor } from '../types';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    language, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    viewProductDetail,
    t,
    theme 
  } = useApp();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleAddToCart = () => {
    if (isSoldOut) return;
    const added = addToCart(product, selectedColor, selectedSize, quantity);
    if (added) {
      setQuickViewProduct(null);
    }
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    const added = addToCart(product, selectedColor, selectedSize, quantity);
    if (added) {
      setQuickViewProduct(null);
      // Let context route to cart
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border flex flex-col md:flex-row max-h-[90vh] ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-primary-container/40 text-slate-800'
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-electric-pink hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2 p-4 flex flex-col gap-3 bg-primary-container/15/30 dark:bg-slate-950/40">
            <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.titleTh}
                className="w-full h-full object-cover"
              />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-black text-lg border-2 border-white px-4 py-1 rounded-lg rotate-[-6deg]">
                    {t.product.soldOut}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx ? 'border-electric-pink scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Selectors */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[550px]">
            <div className="space-y-4">
              
              {/* Rating and Stock badge */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} {t.product.reviews})</span>
                </div>
                {isSoldOut ? (
                  <span className="bg-primary-container/30 text-rose-700 font-bold px-2.5 py-0.5 rounded-full text-xs">
                    {t.product.soldOut}
                  </span>
                ) : isLowStock ? (
                  <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    {t.product.lowStock.replace('{count}', String(product.stock))}
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                    {t.product.inStock} ({product.stock})
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h2 className="text-lg sm:text-xl font-bold font-display leading-snug">
                {language === 'th' ? product.titleTh : product.titleEn}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-tertiary dark:text-electric-pink">
                  ฿{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ฿{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="bg-tertiary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                {language === 'th' ? product.descriptionTh : product.descriptionEn}
              </p>

              {/* Color Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  {t.product.selectColor}: <span className="font-normal text-tertiary">{language === 'th' ? selectedColor.nameTh : selectedColor.nameEn}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedColor.nameEn === col.nameEn
                          ? 'border-electric-pink bg-primary-container/20 text-pink-900 ring-2 ring-electric-pink/30 dark:bg-pink-950/40 dark:text-baby-pink'
                          : 'border-slate-200 dark:border-slate-700 hover:border-baby-pink'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: col.hex }} />
                      <span>{language === 'th' ? col.nameTh : col.nameEn}</span>
                      {selectedColor.nameEn === col.nameEn && <Check className="w-3 h-3 text-electric-pink" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection & Size Chart Trigger */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.product.selectSize}: <span className="font-normal text-tertiary">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setShowSizeChart(!showSizeChart)}
                    className="text-xs text-electric-pink hover:text-tertiary font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    {t.product.sizeChart}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-10 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? 'bg-electric-pink text-white border-electric-pink shadow-sm shadow-baby-pink'
                          : 'border-slate-200 dark:border-slate-700 hover:border-baby-pink'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Size Chart Dropdown */}
              {showSizeChart && product.sizeChart && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-xl bg-primary-container/20/70 dark:bg-slate-800/80 border border-baby-pink/50 text-xs overflow-x-auto"
                >
                  <p className="font-bold text-tertiary mb-2">{t.product.sizeChart}</p>
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-baby-pink dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300">
                        <th className="py-1">Size</th>
                        {product.sizeChart[0]?.bust && <th className="py-1">Bust (อก)</th>}
                        {product.sizeChart[0]?.waist && <th className="py-1">Waist (เอว)</th>}
                        {product.sizeChart[0]?.length && <th className="py-1">Length (ยาว)</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizeChart.map((row, i) => (
                        <tr key={i} className="border-b border-primary-container/40/50 dark:border-slate-800">
                          <td className="py-1 font-bold text-tertiary">{row.size}</td>
                          {row.bust && <td className="py-1">{row.bust}</td>}
                          {row.waist && <td className="py-1">{row.waist}</td>}
                          {row.length && <td className="py-1">{row.length}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {/* Quantity Stepper */}
              {!isSoldOut && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.product.quantity}:</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1 text-slate-600 hover:bg-primary-container/40 dark:text-slate-300 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-1 text-slate-600 hover:bg-primary-container/40 dark:text-slate-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-primary-container/40 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  disabled={isSoldOut}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSoldOut
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800'
                      : 'bg-electric-pink hover:bg-tertiary text-white shadow-lg shadow-electric-pink/30'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isSoldOut ? t.product.soldOut : t.product.addToCart}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                    isWishlisted 
                      ? 'bg-primary-container/20 border-baby-pink text-electric-pink dark:bg-pink-950' 
                      : 'border-slate-200 dark:border-slate-700 hover:bg-primary-container/20 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  viewProductDetail(product.id);
                }}
                className="text-center text-xs text-electric-pink hover:text-tertiary font-bold py-1 flex items-center justify-center gap-1"
              >
                {t.product.viewDetail} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
