import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Calculator,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 'meals',
    tag: 'লাইভ মিল ট্র্যাকিং',
    tagEn: 'Live Meal Tracking',
    title: 'সহজ ও নিখুঁত মিল কাউন্টিং',
    titleEn: 'Smart & Seamless Daily Meal Tracking',
    description: 'সকাল, দুপুর ও রাতের মিল ট্র্যাক করুন ০.২৫ স্টেপ নির্ভুলতায়। খাতা-কলমের গোলমাল ছাড়াই মেম্বাররা নিজেরাই মিল রিকোয়েস্ট জমা দিতে পারে।',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80',
    badges: ['০.২৫ স্টেপ সাপোর্ট', 'সকাল • দুপুর • রাত', 'সকাল ৮:৩০ কাট-অফ'],
    floatingCard: {
      icon: UtensilsCrossed,
      color: 'from-amber-500 to-orange-500',
      label: 'আজকের মিল কাউন্ট',
      value: '৪.৭৫ মিল',
      sub: 'স্বয়ংক্রিয়ভাবে সংরক্ষিত'
    }
  },
  {
    id: 'bazar',
    tag: 'স্মার্ট বাজার প্ল্যানার',
    tagEn: 'Smart Bazar Planner',
    title: 'বাজারের ফর্দ ও ডিউটি শিডিউল',
    titleEn: 'Grocery Checklist & Bazar Duty Scheduler',
    description: 'কার কোন দিন বাজার ডিউটি এবং কি কি বাজার করতে হবে — সব এক ক্লিকে ফর্দ তৈরি করুন এবং কেনাকাটার পর সরাসরি মেস খরচে রূপান্তর করুন।',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
    badges: ['১-ক্লিকে খরচে রূপান্তর', 'বাজার ডিউটি ক্যালেন্ডার', 'আইটেম বাজেট ট্র্যাকিং'],
    floatingCard: {
      icon: ShoppingBag,
      color: 'from-emerald-500 to-teal-500',
      label: 'চলতি সপ্তাহের বাজার',
      value: '৳ ৪,৮৫০.০০',
      sub: '৬টি আইটেম ক্রয় সম্পন্ন'
    }
  },
  {
    id: 'calculator',
    tag: 'স্বয়ংক্রিয় মিল রেট',
    tagEn: 'Auto Meal Rate Engine',
    title: 'স্বয়ংক্রিয় মিল রেট ও জিরো ফ্র্যাকশন এরর',
    titleEn: 'Instant Meal Rate & Zero Precision Error',
    description: 'বাজার খরচ ও মোট মিলের অনুপাতে তাৎক্ষণিক মিল রেট হিসাব। খালার বেতন, গ্যাস ও ওয়াইফাই বিল সমান ভাগে বন্টনসহ শতভাগ স্বচ্ছতা।',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&auto=format&fit=crop&q=80',
    badges: ['জিরো ফ্র্যাকশন ড্রাফট', 'সমান ভাগে অন্যান্য খরচ', 'রিয়েল-টাইম ব্যালেন্স'],
    floatingCard: {
      icon: Calculator,
      color: 'from-indigo-500 to-purple-500',
      label: 'চলতি মিল রেট',
      value: '৳ ৫১.৩০',
      sub: 'মোট মিল: ১৬৬.০০ • খরচ: ৳ ৮,৫১৫'
    }
  },
  {
    id: 'harmony',
    tag: '১০০% স্বচ্ছ হিসাব',
    tagEn: '100% Transparent Ledger',
    title: 'বন্ধুত্ব থাকুক অটুট, হিসাব হোক পরিষ্কার',
    titleEn: 'Stress-Free Living & Instant Payment Reminders',
    description: 'বিকাশ/নগদ জমার স্বচ্ছ হিসাব ও ডিপোজিট হিস্ট্রি। বকেয়া টাকা উত্তোলনে অস্বস্তি দূর করতে ১-ক্লিক সৌজন্যমূলক হোয়াটসঅ্যাপ তাগাদা মেসেজ।',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop&q=80',
    badges: ['১-ক্লিক হোয়াটসঅ্যাপ তাগাদা', 'বিকাশ ও নগদ ট্রানজেকশন', 'মাসিক পিডিএফ রসিদ'],
    floatingCard: {
      icon: ShieldCheck,
      color: 'from-rose-500 to-pink-500',
      label: 'মেস রিজার্ভ ব্যালেন্স',
      value: '+ ৳ ২,৪২০.০০',
      sub: 'সকল হিসাব স্বচ্ছ ও সুরক্ষিত'
    }
  }
];

export const HeroCarousel = ({ onLaunchDemo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoPlayRef = useRef(null);

  const totalSlides = SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentSlide = SLIDES[currentIndex];
  const FloatingIcon = currentSlide.floatingCard.icon;

  return (
    <div
      className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative ambient background glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-70 dark:opacity-50 pointer-events-none" />

      {/* Main Carousel Shell */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-2xl">
        {/* Slides Track */}
        <div className="relative h-[480px] sm:h-[460px] md:h-[500px] w-full overflow-hidden">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center brightness-75 contrast-105"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />

                {/* Dark Vignette & Gradient Overlays for Maximum Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent sm:w-3/4" />

                {/* Slide Content */}
                <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-end text-left max-w-3xl">
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-3 w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{slide.tag}</span>
                    <span className="text-emerald-400/50">•</span>
                    <span className="hidden sm:inline text-emerald-200/80 text-[11px] font-normal">
                      {slide.tagEn}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {slide.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-200/90 leading-relaxed max-w-2xl">
                    {slide.description}
                  </p>

                  {/* Feature Badges */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {slide.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 dark:bg-slate-800/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* CTA link inside slide */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => onLaunchDemo && onLaunchDemo('manager')}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                    >
                      <span>লাইভ ডেমো দেখুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/20 transition-all"
                    >
                      <span>ফ্রি রেজিস্ট্রেশন</span>
                    </Link>
                  </div>
                </div>

                {/* Floating Metric Card (Visible on tablet & desktop) */}
                <div className="hidden lg:flex absolute top-12 right-12 z-20">
                  <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 min-w-[240px] animate-fade-in">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${slide.floatingCard.color} flex items-center justify-center text-white shadow-md shrink-0`}
                    >
                      <FloatingIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">
                        {slide.floatingCard.label}
                      </p>
                      <p className="text-lg font-bold text-white font-mono tracking-tight">
                        {slide.floatingCard.value}
                      </p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                        {slide.floatingCard.sub}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Bar (Bottom Overlay) */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 z-20 flex items-center gap-2 sm:gap-3">
          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer"
            title={isPlaying ? 'Pause Auto-slide' : 'Play Auto-slide'}
            aria-label="Toggle auto play"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="w-9 h-9 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-md"
            title="Previous Slide"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-md"
            title="Next Slide"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Dots / Bars (Bottom Left) */}
        <div className="absolute bottom-5 sm:bottom-7 left-6 sm:left-10 z-20 flex items-center gap-2">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                  isActive
                    ? 'w-8 bg-emerald-400'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                title={slide.title}
              />
            );
          })}
          <span className="text-[11px] font-mono font-medium text-slate-300/80 ml-2 hidden sm:inline">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>
      </div>
    </div>
  );
};
