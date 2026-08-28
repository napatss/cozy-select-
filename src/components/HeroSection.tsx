import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import heroModel from '@/assets/hero-model.jpg';

export const HeroSection: React.FC = () => {
  const { language, setActiveView, setActiveCategory } = useApp();

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[720px] flex items-center justify-center overflow-hidden bg-baby-pink/20">
      {/* Background Editorial Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroModel}
          alt="Cozy Select Korean Y2K Fashion"
          className="w-full h-full object-cover object-top opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas-white via-canvas-white/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-baby-pink/15 via-transparent to-baby-pink/10" />
      </div>

      {/* Top-right decorative wordmark */}
      <div className="hidden sm:block absolute top-8 right-8 md:right-16 text-right z-10 select-none">
        <p className="font-headline text-2xl md:text-4xl font-bold text-canvas-white/80 leading-[0.95] tracking-tight drop-shadow-sm">
          COZY<br />SEOUL
        </p>
      </div>

      {/* Floating Y2K Stickers */}
      <div className="hidden md:block absolute top-[18%] left-[8%] text-electric-pink text-3xl drop-shadow-md animate-pulse z-10 select-none">★</div>

      <div className="hidden md:flex absolute top-[30%] left-[10%] -rotate-6 flex-col items-start z-10 select-none">
        <span className="font-headline text-2xl lg:text-3xl font-extrabold text-canvas-white [-webkit-text-stroke:1.5px_#FF1493] tracking-tight leading-[0.9] drop-shadow-lg">
          Y2K<br />VIBES
        </span>
      </div>

      <div className="hidden md:flex absolute bottom-[26%] left-[7%] -rotate-3 flex-col items-start z-10 select-none">
        <span className="font-headline text-xl lg:text-2xl font-extrabold text-canvas-white [-webkit-text-stroke:1.2px_#FF1493] tracking-tight leading-[0.9] drop-shadow-lg">
          GIRLY<br />POP
        </span>
      </div>

      <div className="hidden md:block absolute top-[46%] right-[10%] rotate-6 z-10 select-none">
        <span className="font-headline text-2xl lg:text-3xl font-extrabold text-canvas-white [-webkit-text-stroke:1.2px_#FF1493] tracking-tight drop-shadow-lg">
          SEOUL
        </span>
      </div>

      {/* Decorative heart chip (purely visual, matches sticker sheet in reference) */}
      <div
        className="hidden md:flex absolute top-[24%] right-[12%] w-10 h-10 rounded-full bg-canvas-white/70 backdrop-blur-md items-center justify-center text-electric-pink shadow-md z-10 select-none"
        aria-hidden="true"
      >
        <Heart className="w-4 h-4" />
      </div>

      <div className="hidden md:block absolute top-[54%] left-[24%] text-baby-pink text-2xl drop-shadow-md z-10 select-none">✦</div>
      <div className="hidden md:block absolute bottom-[20%] right-[22%] text-2xl z-10 select-none">🦋</div>
      <div className="hidden md:block absolute top-[36%] right-[26%] text-electric-pink/70 text-xl z-10 select-none">♡</div>

      {/* Center Glass Panel */}
      <div className="relative z-20 text-center px-6 sm:px-margin-desktop max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 sm:p-10 rounded-[2.5rem] shadow-[0_40px_40px_rgba(255,193,204,0.35)] border border-baby-pink"
        >
          <h1 className="font-headline text-4xl sm:text-6xl font-extrabold text-street-black uppercase tracking-tight mb-3">
            Cozy Select
          </h1>
          <p className="text-sm sm:text-base font-semibold text-electric-pink mb-7 max-w-md mx-auto">
            {language === 'th'
              ? 'Cute looks. Bold attitude. แฟชั่นที่เป็นตัวคุณ ♡'
              : 'Cute looks. Bold attitude. Fashion that is truly you ♡'}
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveView('products');
            }}
            className="bg-street-black text-canvas-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full uppercase tracking-widest hover:scale-[0.98] transition-transform duration-200 flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
          >
            <span>{language === 'th' ? 'ช้อป Y2K' : 'Shop Y2K'}</span>
            <span className="w-6 h-6 rounded-full bg-electric-pink flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 text-canvas-white" />
            </span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-canvas-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-street-black animate-bounce">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
    </section>
  );
};
