import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductColor, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, Heart, ShoppingBag, Truck, ShieldCheck, 
  RotateCcw, Ruler, Check, Flame, Sparkles, ChevronRight, 
  Share2, ArrowLeft, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    language, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setActiveView,
    setActiveCategory,
    showToast,
    t,
    theme 
  } = useApp();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product?.colors[0] || { nameTh: 'Default', nameEn: 'Default', hex: '#fff' });
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'Free Size');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'size' | 'care' | 'shipping'>('desc');
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">{language === 'th' ? 'ไม่พบข้อมูลสินค้า' : 'Product not found'}</p>
        <button
          onClick={() => setActiveView('products')}
          className="mt-4 px-6 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold"
        >
          {t.home.viewAll}
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    const added = addToCart(product, selectedColor, selectedSize, quantity);
    if (added) {
      setActiveView('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: language === 'th' ? product.titleTh : product.titleEn,
        text: `Check out ${product.titleEn} on Cozy Select!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'th' ? 'คัดลอกลิงก์สินค้าแล้ว' : 'Copied link to clipboard', 'success');
    }
  };

  // Related products from same category or fallback
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isNew))
    .slice(0, 4);

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button onClick={() => setActiveView('home')} className="hover:text-pink-500 transition-colors">
            {t.nav.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button 
            onClick={() => {
              setActiveCategory(product.category);
              setActiveView('products');
            }} 
            className="hover:text-pink-500 transition-colors capitalize"
          >
            {t.categories[product.category] || product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-white font-medium truncate max-w-xs">
            {language === 'th' ? product.titleTh : product.titleEn}
          </span>
        </div>

        {/* Product Showcase: Gallery + Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery (5-6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-3/4 w-full rounded-3xl overflow-hidden bg-rose-50/30 dark:bg-slate-900 border border-pink-100/80 dark:border-slate-800 shadow-xl shadow-pink-100/30 dark:shadow-none group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={language === 'th' ? product.titleTh : product.titleEn}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* SOLD OUT Overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                  <span className="text-white font-serif-luxury font-black text-xl border-4 border-white px-6 py-2 rounded-xl rotate-[-6deg] shadow-2xl">
                    {t.product.soldOut}
                  </span>
                  <p className="text-pink-200 text-xs font-semibold mt-3">
                    {language === 'th' ? 'สินค้าหมดชั่วคราว อยู่ระหว่างเติมสต็อก' : 'Currently sold out, restock in progress'}
                  </p>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.product.newBadge}
                  </span>
                )}
                {product.isSale && product.discountPercent && (
                  <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    -{product.discountPercent}% {t.product.saleBadge}
                  </span>
                )}
              </div>

              {/* Share and Wishlist Floating Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                    isWishlisted 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-white hover:text-pink-500'
                  }`}
                  title={t.nav.wishlist}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-white hover:text-pink-500 backdrop-blur-md transition-colors shadow-md cursor-pointer"
                  title="Share Product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImage === idx 
                        ? 'border-pink-500 scale-105 shadow-md shadow-pink-300/40' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Purchase Controls (6-7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Rating & Stock status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-xs sm:text-sm">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-400 text-xs">({product.reviewCount} {t.product.reviews})</span>
                </div>

                {/* Stock Indicator */}
                {isSoldOut ? (
                  <span className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold px-3 py-1 rounded-full text-xs">
                    {t.product.soldOut}
                  </span>
                ) : isLowStock ? (
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    {t.product.lowStock.replace('{count}', String(product.stock))}
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-3 py-1 rounded-full text-xs">
                    {t.product.inStock} ({product.stock} {language === 'th' ? 'ชิ้น' : 'units'})
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-slate-900 dark:text-white leading-tight">
                {language === 'th' ? product.titleTh : product.titleEn}
              </h1>

              {/* Price Box */}
              <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-900/60 border border-pink-100 dark:border-slate-800">
                <span className="text-3xl sm:text-4xl font-black text-pink-600 dark:text-pink-400">
                  ฿{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base sm:text-lg text-slate-400 line-through">
                    ฿{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {language === 'th' ? `ประหยัด ${product.discountPercent}%` : `Save ${product.discountPercent}%`}
                  </span>
                )}
              </div>

              {/* Short Bio */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'th' ? product.descriptionTh : product.descriptionEn}
              </p>

              {/* Color Swatches */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {t.product.selectColor}: <span className="font-normal text-pink-600">{language === 'th' ? selectedColor.nameTh : selectedColor.nameEn}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedColor.nameEn === color.nameEn
                          ? 'border-pink-500 bg-pink-50 text-pink-900 ring-2 ring-pink-400/30 dark:bg-pink-950 dark:text-pink-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-pink-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: color.hex }} />
                      <span>{language === 'th' ? color.nameTh : color.nameEn}</span>
                      {selectedColor.nameEn === color.nameEn && <Check className="w-3.5 h-3.5 text-pink-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {t.product.selectSize}: <span className="font-normal text-pink-600">{selectedSize}</span>
                  </span>
                  <button
                    onClick={() => setShowSizeModal(true)}
                    className="text-pink-500 hover:text-pink-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{t.product.sizeChart}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-12 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-pink-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              {!isSoldOut && (
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.product.quantity}:</span>
                  <div className="flex items-center border border-pink-200 dark:border-slate-700 rounded-xl overflow-hidden bg-rose-50/40 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-pink-200/50 dark:text-slate-200 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-black text-slate-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-pink-200/50 dark:text-slate-200 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    ({language === 'th' ? `สูงสุด ${product.stock} ชิ้น` : `Max ${product.stock} units`})
                  </span>
                </div>
              )}

            </div>

            {/* CTAs: Add to Cart & Buy Now */}
            <div className="pt-6 border-t border-pink-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Add to Cart Button */}
                <button
                  disabled={isSoldOut}
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    isSoldOut
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/30 hover:scale-[1.01]'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isSoldOut ? t.product.soldOut : t.product.addToCart}</span>
                </button>

                {/* Buy Now Button */}
                <button
                  disabled={isSoldOut}
                  onClick={handleBuyNow}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSoldOut
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                      : 'bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 shadow-md hover:scale-[1.01]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>{t.product.buyNow}</span>
                </button>
              </div>

              {/* Fast Assurance Perks */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                <div className="p-2 rounded-xl bg-pink-50/50 dark:bg-slate-900 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-pink-500" />
                  <span>{language === 'th' ? 'ส่งไว 1-2 วัน' : '1-2 Days Fast Delivery'}</span>
                </div>
                <div className="p-2 rounded-xl bg-pink-50/50 dark:bg-slate-900 flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-pink-500" />
                  <span>{language === 'th' ? 'เปลี่ยนไซส์ใน 7 วัน' : '7 Days Easy Exchange'}</span>
                </div>
                <div className="p-2 rounded-xl bg-pink-50/50 dark:bg-slate-900 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-pink-500" />
                  <span>{language === 'th' ? 'ของแท้ QC 100%' : '100% Quality Check'}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Product Details / Specifications */}
        <div className="pt-8 border-t border-pink-100 dark:border-slate-800">
          
          {/* Tabs Nav */}
          <div className="flex items-center justify-center gap-2 border-b border-pink-100 dark:border-slate-800 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'desc'
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                  : 'text-slate-600 hover:text-pink-500 hover:bg-pink-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'th' ? 'รายละเอียดสินค้า' : 'Product Description'}
            </button>

            <button
              onClick={() => setActiveTab('size')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'size'
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                  : 'text-slate-600 hover:text-pink-500 hover:bg-pink-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {t.product.sizeChart}
            </button>

            <button
              onClick={() => setActiveTab('care')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'care'
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                  : 'text-slate-600 hover:text-pink-500 hover:bg-pink-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'th' ? 'การดูแลรักษา' : 'Fabric & Care'}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'shipping'
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                  : 'text-slate-600 hover:text-pink-500 hover:bg-pink-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'th' ? 'การจัดส่ง' : 'Delivery & Returns'}
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="py-8 max-w-3xl mx-auto">
            {activeTab === 'desc' && (
              <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {language === 'th' ? 'เกี่ยวกับสินค้าชิ้นนี้' : 'About this Piece'}
                  </h3>
                  <p>{language === 'th' ? product.descriptionTh : product.descriptionEn}</p>
                </div>

                {product.features && (
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                      {language === 'th' ? 'จุดเด่นของดีไซน์' : 'Design Highlights'}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.material && (
                  <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800 border border-pink-100 dark:border-slate-700">
                    <span className="font-bold text-pink-600">{language === 'th' ? 'เนื้อผ้า (Material): ' : 'Material: '}</span>
                    <span>{product.material}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'th' ? 'ตารางขนาดสินค้า (Size Guide - Inches)' : 'Size Guide (Inches)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'th' ? '*ขนาดอาจมีความคลาดเคลื่อน 0.5 - 1 นิ้วจากการตัดเย็บ' : '*Measurements may vary 0.5 - 1 inch'}
                  </p>
                </div>

                {product.sizeChart && product.sizeChart.length > 0 ? (
                  <div className="rounded-2xl border border-pink-100 dark:border-slate-700 overflow-hidden shadow-xs">
                    <table className="w-full text-center text-xs sm:text-sm">
                      <thead className="bg-pink-50 dark:bg-slate-800 font-bold text-pink-900 dark:text-pink-200">
                        <tr>
                          <th className="py-3 px-4">Size</th>
                          {product.sizeChart[0]?.bust && <th className="py-3 px-4">Bust (อก)</th>}
                          {product.sizeChart[0]?.waist && <th className="py-3 px-4">Waist (เอว)</th>}
                          {product.sizeChart[0]?.hip && <th className="py-3 px-4">Hip (สะโพก)</th>}
                          {product.sizeChart[0]?.length && <th className="py-3 px-4">Length (ยาว)</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-100 dark:divide-slate-800">
                        {product.sizeChart.map((row, i) => (
                          <tr key={i} className="hover:bg-rose-50/30 dark:hover:bg-slate-800/50">
                            <td className="py-3 px-4 font-bold text-pink-600">{row.size}</td>
                            {row.bust && <td className="py-3 px-4">{row.bust}</td>}
                            {row.waist && <td className="py-3 px-4">{row.waist}</td>}
                            {row.hip && <td className="py-3 px-4">{row.hip}</td>}
                            {row.length && <td className="py-3 px-4">{row.length}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-6">Free Size: อก 30-36" ยาว 16"</p>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'th' ? 'คำแนะนำการซักและดูแลรักษา' : 'Care Instructions'}
                </h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>{product.careInstructions || (language === 'th' ? 'ควรซักมือด้วยน้ำเย็น หรือใส่ถุงถนอมผ้าเมื่อซักเครื่อง' : 'Hand wash cold or gentle cycle in laundry bag')}</li>
                  <li>{language === 'th' ? 'หลีกเลี่ยงการใช้น้ำยาฟอกขาว' : 'Do not bleach'}</li>
                  <li>{language === 'th' ? 'ควรรีดด้วยความร้อนต่ำ และกลับด้านรีดเพื่อถนอมลายสกรีน' : 'Iron inside-out on low heat'}</li>
                  <li>{language === 'th' ? 'ตากในที่ร่มมีลมโกรก เพื่อให้สีสดใสยาวนาน' : 'Line dry in shade to preserve color vibrancy'}</li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'th' ? 'เงื่อนไขการจัดส่งและการคืนสินค้า' : 'Shipping & Return Policies'}
                </h3>
                <p>
                  {language === 'th'
                    ? '• จัดส่งด่วนทุกวันจันทร์ - เสาร์ ผ่าน Flash / Kerry Express ได้รับสินค้าภายใน 1-2 วันทำการ\n• ฟรีค่าจัดส่งเมื่อสั่งซื้อครบ ฿990 ขึ้นไป\n• หากใส่ไม่พอดี สามารถติดต่อแอดมินเพื่อขอเปลี่ยนไซส์ได้ภายใน 7 วัน'
                    : '• Express shipping Mon-Sat via Flash/Kerry. Arrives in 1-2 business days.\n• Free standard shipping on orders over ฿990.\n• Hassle-free size exchange within 7 days of receipt.'}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* You May Also Like / Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-pink-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-pink-500 uppercase tracking-widest block mb-1">
                  MATCHING STYLE
                </span>
                <h2 className="text-2xl font-serif-luxury font-bold text-slate-900 dark:text-white">
                  {t.product.relatedProducts}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveCategory(product.category);
                  setActiveView('products');
                }}
                className="text-xs sm:text-sm font-bold text-pink-500 hover:text-pink-600"
              >
                {t.home.viewAll} →
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Chart Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full p-6 rounded-3xl shadow-2xl border border-pink-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-luxury flex items-center gap-2">
                <Ruler className="w-5 h-5 text-pink-500" />
                <span>{t.product.sizeChart}</span>
              </h3>
              <button onClick={() => setShowSizeModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {product.sizeChart && product.sizeChart.length > 0 ? (
              <table className="w-full text-center text-xs sm:text-sm border-collapse">
                <thead className="bg-pink-50 dark:bg-slate-800 font-bold text-pink-600">
                  <tr>
                    <th className="py-2.5">Size</th>
                    {product.sizeChart[0]?.bust && <th>Bust (อก)</th>}
                    {product.sizeChart[0]?.waist && <th>Waist (เอว)</th>}
                    {product.sizeChart[0]?.hip && <th>Hip (สะโพก)</th>}
                    {product.sizeChart[0]?.length && <th>Length (ยาว)</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100 dark:divide-slate-800">
                  {product.sizeChart.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-bold text-pink-500">{row.size}</td>
                      {row.bust && <td>{row.bust}</td>}
                      {row.waist && <td>{row.waist}</td>}
                      {row.hip && <td>{row.hip}</td>}
                      {row.length && <td>{row.length}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-sm text-slate-500 py-4">Standard Free Size (Bust 32-36", Length 16")</p>
            )}

            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition-colors"
            >
              {language === 'th' ? 'เข้าใจแล้ว' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
