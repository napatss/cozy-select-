import React from 'react';
import { useApp } from '../context/AppContext';
import { Instagram, Sparkles, Heart, Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export const LookbookSection: React.FC = () => {
  const { language, t, theme } = useApp();

  const lookbookImages = [
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      handle: '@pimm.cozy',
      tag: '#BabyPinkRibbon'
    },
    {
      img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      handle: '@mint.y2k',
      tag: '#AngelWingsTee'
    },
    {
      img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
      handle: '@bell_stylist',
      tag: '#SilkLaceCamisole'
    },
    {
      img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      handle: '@charlotte_k',
      tag: '#VintageWideJeans'
    }
  ];

  const testimonials = [
    {
      name: 'คุณแพรวา (Praewa T.)',
      rating: 5,
      commentTh: 'เสื้อครอปไหมพรมโบว์ชมพูน่ารักมากกก เนื้อผ้านุ่มยืดหยุ่นดี ใส่แล้วเข้ารูปสวยเป๊ะ จัดส่งไวมาก 1 วันถึงเลยค่ะ 💕',
      commentEn: 'The pink ribbon knit crop top is insanely cute! Fabric is super soft, fits like a dream. Arrived in just 1 day!',
      item: 'Baby Pink Ribbed Crop Top'
    },
    {
      name: 'คุณจริญญา (Jarinya S.)',
      rating: 5,
      commentTh: 'เสื้อเบบี้ทีปีกนางฟ้าทรง Y2K สวยตาแตกมากกก เพชรแน่น ซักแล้วไม่หลุด ประทับใจ packaging กล่องสีชมพูสุดๆ',
      commentEn: 'Angel wings rhinestone baby tee is stunning! Crystals stay firmly attached after wash. Packaging is so luxury.',
      item: 'Y2K Angel Wings Baby Tee'
    },
    {
      name: 'คุณมินตรา (Mintra K.)',
      rating: 5,
      commentTh: 'กางเกงยีนส์ฟอกเอวสูงทรงสวย ขาดูยาวเรียวมาก เนื้อผ้าไม่แข็ง แมตช์กับเสื้อได้ทุกลุค กลายเป็นร้านโปรดแล้วค่ะ',
      commentEn: 'High waist vintage denim elongates my legs instantly. Comfortable and chic. Cozy Select is now my go-to store!',
      item: 'High-Waist Washed Denim Jeans'
    }
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-primary-container/40/60 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Instagram Lookbook Community */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-electric-pink uppercase tracking-widest px-3 py-1 rounded-full bg-primary-container/20 dark:bg-pink-950 mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>@CozySelect.official</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
              {t.home.lookbookTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t.home.lookbookSub}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {lookbookImages.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-primary-container/40 dark:border-slate-800 shadow-md"
              >
                <img
                  src={item.img}
                  alt={item.handle}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                  <p className="text-xs font-bold">{item.handle}</p>
                  <p className="text-[11px] text-baby-pink font-medium">{item.tag}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Reviews Carousel / Grid */}
        <div className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-electric-pink uppercase tracking-widest px-3 py-1 rounded-full bg-primary-container/20 dark:bg-pink-950 mb-2">
              <Star className="w-3.5 h-3.5 fill-electric-pink text-electric-pink" />
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 dark:text-white">
              {t.home.reviewsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t.home.reviewsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-3xl border relative flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                    : 'bg-white border-primary-container/40 shadow-xl shadow-primary-container/40/40 text-slate-800'
                }`}
              >
                <Quote className="w-8 h-8 text-baby-pink/40 absolute top-5 right-5" />
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic">
                    "{language === 'th' ? item.commentTh : item.commentEn}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-primary-container/40/60 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-[11px] text-electric-pink font-medium">{item.item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
