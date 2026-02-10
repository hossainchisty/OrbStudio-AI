'use client';

import { TOOLS } from '@/lib/constants';
import { PLANS } from '@/lib/constants/plans';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  History,
  Image as ImageIcon,
  Maximize,
  Moon,
  Play,
  PlayCircle,
  QrCode,
  Sparkles,
  Sticker,
  Sun,
  User,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const iconMap = {
  Camera: Camera,
  User: User,
  Image: ImageIcon,
  Play: Play,
  Sparkles: Sparkles,
  Maximize: Maximize,
  Sticker: Sticker,
  QrCode: QrCode,
};

const DEMOS = [
  {
    id: 1,
    model: "Orb-Studio-v2",
    prompt: "Professional perfume bottle on luxury marble, soft studio lighting, cinematic bokeh, 8k resolution, shot on Hasselblad.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    color: "from-blue-500 to-indigo-600",
    tag: "Product"
  },
  {
    id: 2,
    model: "Orb-Fashion-XL",
    prompt: "High-end fashion model in avant-garde metallic clothing, editorial style, dramatic cinematic lighting, urban cyberpunk dusk background.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    color: "from-purple-500 to-pink-600",
    tag: "Fashion"
  },
  {
    id: 3,
    model: "Orb-Vision-Plus",
    prompt: "Minimalist organic skincare set, aesthetic leaf shadows, soft morning sunlight, clean composition, neutral zen textures.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop",
    color: "from-emerald-500 to-teal-600",
    tag: "Cosmetics"
  },
  {
    id: 4,
    model: "Orb-Ads-Ultra",
    prompt: "Luxury supercar driving through a neon-lit tunnel, high-speed motion blur, cinematic light streaks, commercial automotive grade, 8k.",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000&auto=format&fit=crop",
    color: "from-orange-500 to-amber-600",
    tag: "Commercial"
  },
  {
    id: 5,
    model: "Orb-Jewelry-Pro",
    prompt: "Exquisite diamond watch on velvet, macro photography, focused sparkle, soft edge lighting, high-end jewelry commercial.",
    image: "https://images.unsplash.com/photo-1524333892444-2dc67a63d4ee?q=80&w=1000&auto=format&fit=crop",
    color: "from-amber-400 to-yellow-600",
    tag: "Jewelry"
  },
  {
    id: 6,
    model: "Orb-Tech-Vision",
    prompt: "Sleek wireless headphones floating in air, futuristic blue accent lighting, clean minimalist studio background, high-tech aesthetic.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    color: "from-cyan-500 to-blue-600",
    tag: "Tech"
  },
  {
    id: 7,
    model: "Orb-Home-XL",
    prompt: "Scandinavian minimalist living room, soft morning sunlight through large windows, aesthetic furniture, warm cozy atmosphere, 8k.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop",
    color: "from-warm-gray-400 to-stone-600",
    tag: "Interior"
  },
  {
    id: 8,
    model: "Orb-Sneaker-v1",
    prompt: "Premium urban sneaker on concrete, dramatic side lighting, splash of water effect, street style photography, high contrast.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    color: "from-rose-500 to-red-600",
    tag: "Footwear"
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [currentDemo, setCurrentDemo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % DEMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const isBn = t.settings.languageName === 'বাংলা';

  const FAQS = [
    {
      question: isBn ? "OrbStudio কি ভাবে সাহায্য করে?" : "How does OrbStudio help?",
      answer: isBn
        ? "OrbStudio একটি অগ্রসর AI প্ল্যাটফর্ম যা প্রোডাক্ট ফটোগ্রাফি, ফ্যাশন ফটোগ্রাফি এবং ভিডিও অ্যাড জেনারেশনে সাহায্য করে। এটি আপনার আইডিয়াকে হাই-কোয়ালিটি ভিজ্যুয়ালে রূপান্তর করে।"
        : "OrbStudio is an advanced AI platform that helps with product photography, fashion photography, and video ad generation. It transforms your ideas into high-quality visuals."
    },
    {
      question: isBn ? "আমি কি আমার নিজের প্রোডাক্টের ছবি ব্যবহার করতে পারি?" : "Can I use my own product photos?",
      answer: isBn
        ? "হ্যাঁ! আপনি আপনার প্রোডাক্টের ছবি আপলোড করে সেটির চারপাশের পরিবেশ এবং লাইটিং পরিবর্তন করে প্রফেশনাল লুক দিতে পারবেন।"
        : "Yes! You can upload your product photos and change the environment and lighting to give them a professional look."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-500">

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/20 backdrop-blur-3xl border-b border-slate-100/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-lg shadow-brand-shadow">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-inter">
                Orb<span className="text-brand">Studio</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <div className="w-px h-6 bg-slate-200/50 dark:bg-white/10" />

              <SignedOut>
                <div className="flex items-center gap-4">
                  <SignInButton mode="modal">
                    <button className="bg-brand text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-hover transition-all active:scale-95 shadow-xl shadow-brand-shadow dark:shadow-none">
                      {t.common.signup}
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-5">
                  <Link href="/dashboard" className="bg-brand text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-hover transition-all active:scale-95 shadow-xl shadow-brand-shadow dark:shadow-none">
                    {t.common.dashboard}
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-50/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-transparent dark:border-white/5"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-brand text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg shadow-brand-shadow dark:shadow-none">
                    {t.common.login}
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6 lg:px-20 min-h-[90vh] flex items-center overflow-hidden z-10">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col items-start">

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              {isBn ? (
                <>আপনার সৃজনশীলতা <br /><motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-rose-900 via-rose-600 to-rose-900 bg-[length:200%_auto]">এবার বাস্তব হবে</motion.span></>
              ) : (
                <>Imagine. Create. <br /><motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-rose-900 via-rose-600 to-rose-900 bg-[length:200%_auto]">Captivate.</motion.span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-xl leading-relaxed">{t.landing.heroSubtitle}</p>
            <div className="flex flex-wrap items-center gap-5 mb-14">
              <SignedOut><SignUpButton mode="modal"><button className="bg-brand text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all">{t.landing.getStarted}</button></SignUpButton></SignedOut>
              <SignedIn><Link href="/dashboard" className="bg-brand text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all">{t.common.dashboard}</Link></SignedIn>
              <a href="#pricing" className="bg-white/50 dark:bg-black/20 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/80 dark:hover:bg-white/5 transition-all shadow-sm">{t.landing.viewPricing}</a>
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex items-center gap-3.5 bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 px-6 py-3.5 rounded-[22px] shadow-2xl shadow-slate-200/20 dark:shadow-none transition-all duration-300"
              >
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-400 border-2 border-white dark:border-slate-900 shadow-md transform hover:z-10 transition-all" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-400 border-2 border-white dark:border-slate-900 shadow-md transform hover:z-10 transition-all" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-rose-400 border-2 border-white dark:border-slate-900 shadow-md transform hover:z-10 transition-all" />
                </div>
                <span className="text-[15px] font-bold tracking-tight text-slate-500 dark:text-slate-400">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-500 dark:from-rose-400 dark:to-rose-300 font-black text-lg mr-1">
                    {t.landing.statsStudents.split(' ')[0]}
                  </span>
                  {t.landing.statsStudents.split(' ').slice(1).join(' ')}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex items-center gap-3.5 bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 px-6 py-3.5 rounded-[22px] shadow-2xl shadow-slate-200/20 dark:shadow-none transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-2xl bg-brand/10 dark:bg-brand/20 flex items-center justify-center shadow-inner border border-brand/20">
                  <CheckCircle2 size={18} className="text-brand dark:text-rose-400" />
                </div>
                <span className="text-[15px] font-bold tracking-tight text-slate-500 dark:text-slate-400">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-500 dark:from-rose-400 dark:to-rose-300 font-black text-lg mr-1">
                    {t.landing.statsSolutions.split(' ')[0]}
                  </span>
                  {t.landing.statsSolutions.split(' ').slice(1).join(' ')}
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[450px] md:h-[550px] lg:h-[600px] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-purple-500/20 blur-[100px] rounded-full" />

            <div className="relative h-full w-full bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[48px] p-4 shadow-2xl overflow-hidden group">

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDemo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-4 rounded-[36px] overflow-hidden bg-transparent"
                >
                  <img
                    src={DEMOS[currentDemo].image}
                    alt={DEMOS[currentDemo].tag}
                    className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-110 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Floating Model Info */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-6 left-6 right-6 flex justify-between items-start"
                  >
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${DEMOS[currentDemo].color} animate-pulse`} />
                        <span className="text-white text-xs font-black uppercase tracking-widest">{DEMOS[currentDemo].model}</span>
                      </div>
                    </div>
                    <div className="bg-brand text-white px-4 py-2 rounded-full">
                      <span className="text-xs font-black uppercase tracking-widest">{DEMOS[currentDemo].tag}</span>
                    </div>
                  </motion.div>

                  {/* Prompt Box */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[28px] overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Zap size={16} className="text-brand" />
                        </div>
                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{isBn ? 'প্রম্পট' : 'AI PROMPT'}</span>
                      </div>
                      <p className="text-white font-medium text-sm md:text-base leading-relaxed italic">
                        "{DEMOS[currentDemo].prompt}"
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Indicators */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {DEMOS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentDemo(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${currentDemo === i ? 'w-8 bg-brand' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section - Modern SaaS Aesthetic */}
      <section id="tools" className="py-20 px-6 relative overflow-hidden bg-transparent">
        {/* Modern SaaS Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-0.5 bg-brand/50 rounded-full" />
                <span className="text-sm font-black uppercase tracking-[0.4em] text-brand">{isBn ? 'প্রযুক্তি' : 'Capabilities'}</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter"
              >
                {t.landing.subjectsTitle}
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed"
            >
              {t.landing.subjectsSubtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {TOOLS.map((tool, i) => {
              const Icon = iconMap[tool.icon as keyof typeof iconMap] || Camera;
              const accentColor = {
                blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
                emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
              }[tool.color as 'blue' | 'purple' | 'emerald' | 'rose'] || 'bg-brand/10 text-brand';

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative h-full"
                >
                  <div className="h-full p-10 rounded-[40px] bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-slate-100 dark:border-white/5 hover:border-brand/40 dark:hover:border-brand/40 hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-brand/5">
                    <div className={`w-14 h-14 rounded-2xl ${accentColor} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-brand transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium mb-12">
                      {tool.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-slate-400 group-hover:text-brand transition-all duration-300 text-sm font-black uppercase tracking-widest mt-auto border-b-2 border-transparent group-hover:border-brand/20 pb-1">
                      <span>{isBn ? 'শুরু করুন' : 'Get Started'}</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Photography AI Spotlight - New Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20 relative z-10">

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-brand/5 blur-[120px] rounded-full translate-x-1/2" />
            <div className="relative rounded-[48px] overflow-hidden shadow-2xl border-2 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"
                alt="Product AI Showcase"
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Product Info Overlays */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <div className="px-5 py-2.5 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lighting</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand" /> Studio Softbox
                  </p>
                </div>
                <div className="px-5 py-2.5 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Shadows</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Clean & Diffused</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-2 p-3 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                  <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand">
                    <Camera size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-white/60 uppercase">Denoising & Upsampling</span>
                      <span className="text-[10px] font-bold text-brand">100%</span>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-brand w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand/10 border border-brand/20 mb-8">
              <ImageIcon size={16} className="text-brand" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-brand">Studio Visuals</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tighter">
              Product Photography AI
            </h2>

            <div className="space-y-6 mb-12">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Professional product shots in any setting.
              </p>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Consistent lighting, true colors, clean shadows. <span className="text-brand font-black">Any background, any set.</span>
              </p>
            </div>

            <div className="grid gap-6 mb-14">
              {[
                { title: "Lifestyle, flat‑lay, hero, and on‑white in one flow", desc: "Every angle and style your store needs." },
                { title: "Shadow and reflection controls", desc: "Fine-tune physics for unmatched realism." },
                { title: "Export‑ready PNG/JPG with trim & bleed options", desc: "Direct-to-market files formatted for e-commerce." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:-rotate-6">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-brand transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            <button className="group relative inline-flex items-center gap-4 bg-brand text-white px-12 py-6 rounded-[32px] font-black text-xl shadow-[0_20px_40px_-12px_rgba(79,70,229,0.3)] hover:scale-105 transition-all">
              <span className="relative z-10 flex items-center gap-3">
                {isBn ? 'স্টুডিও ফটো তৈরি করুন' : 'Create Studio Photos'}
                <ArrowRight size={24} className="transform group-hover:translate-x-2 transition-all" />
              </span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* Fashion Photography AI Spotlight - New Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-transparent">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-x-0 -bottom-10 h-20 bg-brand/20 blur-[80px] rounded-full mx-auto w-[60%]" />
            <div className="relative rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-2 border-white/40 dark:border-white/5">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
                alt="Fashion AI Showcase"
                className="w-full h-[650px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-2xl border border-white/20 p-5 rounded-[28px]">
                  <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center text-white shadow-xl shadow-brand/30">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-widest">Orb-Virtual-Model-v1</p>
                    <p className="text-white/60 text-xs font-bold">{isBn ? 'স্বয়ংক্রিয় অ্যাপারেল ম্যাপিং' : 'Auto-generated apparel mapping'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand/10 dark:bg-brand/10 border border-brand/20 mb-8">
              <Sparkles size={16} className="text-brand" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-brand">Next-Gen Technology</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tighter">
              Fashion Photography AI
            </h2>

            <div className="space-y-6 mb-12">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Virtual models wearing your apparel.
              </p>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Realistic try‑ons from flat‑lay shots. <span className="text-brand font-black">No casting, no reshoots.</span>
              </p>
            </div>

            <div className="grid gap-6 mb-14">
              {[
                { title: "Pose, angle, and body diversity controls", desc: "Fine-tune and customize your model aesthetics." },
                { title: "Consistent model across a collection", desc: "Professional consistency for your entire catalog." },
                { title: "Natural fabric drape and true product geometry", desc: "AI-powered physics for authentic product representation." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:rotate-6">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-brand transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            <button className="group relative inline-flex items-center gap-4 bg-brand text-white px-12 py-6 rounded-[32px] font-black text-xl shadow-[0_20px_40px_-12px_rgba(79,70,229,0.3)] hover:scale-105 transition-all">
              <span className="relative z-10 flex items-center gap-3">
                {isBn ? 'ফ্যাশন ফটো তৈরি করুন' : 'Create Fashion Photos'}
                <ArrowRight size={24} className="transform group-hover:translate-x-2 transition-all" />
              </span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* AI Ad Maker Spotlight - New Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20 relative z-10">

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-brand/5 blur-[120px] rounded-full translate-x-1/2" />
            <div className="relative rounded-[40px] bg-slate-900 p-8 shadow-2xl border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[9/16] rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/5 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest absolute top-4 left-4">9:16 Reels</span>
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="ad-9-16" />
                </div>
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/5 overflow-hidden group">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest absolute top-4 left-4 z-10">1:1 Post</span>
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="ad-1-1" />
                  </div>
                  <div className="aspect-[4/5] rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden group">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest absolute top-4 left-4 z-10">4:5 Feed</span>
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="ad-4-5" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Generating variants...</span>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-lg bg-brand/20 border border-brand/40" />)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand/10 border border-brand/20 mb-8 text-brand dark:text-rose-400">
              <PlayCircle size={16} />
              <span className="text-xs font-black uppercase tracking-[0.4em]">High-Conversion Ads</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tighter">
              AI Ad Maker
            </h2>

            <div className="space-y-6 mb-12">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                On brand ads, formatted for every channel.
              </p>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Generate dozens of variants, swap hooks, and <span className="text-brand dark:text-rose-400 font-black">ship the winners fast.</span>
              </p>
            </div>

            <div className="grid gap-6 mb-14">
              {[
                { title: "Auto‑layout for 1:1, 4:5, 9:16, 16:9", desc: "One-click multi-format exporting." },
                { title: "Safe‑zone and compliance overlays", desc: "Never worry about UI overlapping your content." },
                { title: "Bulk export with naming conventions", desc: "Seamless integration into your media buyer's workflow." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:-rotate-6">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-brand transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            <button className="group relative inline-flex items-center gap-4 bg-brand text-white px-12 py-6 rounded-[32px] font-black text-xl shadow-[0_20px_40px_-12px_rgba(136,19,55,0.3)] hover:scale-105 transition-all">
              <span className="relative z-10 flex items-center gap-3">
                {isBn ? 'অ্যাড তৈরি করুন' : 'Create Ads'}
                <ArrowRight size={24} className="transform group-hover:translate-x-2 transition-all" />
              </span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* AI Video Generation Spotlight - New Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-brand/10 blur-[100px] rounded-full -translate-x-1/2" />
            <div className="relative rounded-[48px] overflow-hidden shadow-2xl border-2 border-white/20 dark:border-white/5 bg-slate-900 aspect-video flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-motion-light-trails-34638-large.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

              {/* Overlay elements */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">4K Rendering</span>
                  </div>
                  <div className="flex gap-2">
                    {['TikTok', 'Reels', 'Shorts'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-brand/20 backdrop-blur-md rounded-lg text-[8px] font-bold text-white border border-brand/30">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl p-5 rounded-3xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white">
                    <Play size={20} fill="currentColor" />
                  </div>
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ scaleX: [0, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="h-full bg-brand origin-left"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/60">00:15 / 00:30</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand/10 border border-brand/20 mb-8 text-brand dark:text-brand">
              <ImageIcon size={16} />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Cinematic AI</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tighter">
              AI Video Generation
            </h2>

            <div className="space-y-6 mb-12">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Scroll stopping videos in seconds.
              </p>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Reels, pans, turntables, and quick explainers that fit <span className="text-brand dark:text-brand font-black">platform safe zones.</span>
              </p>
            </div>

            <div className="grid gap-6 mb-14">
              {[
                { title: "Templates for Meta, TikTok, and YouTube Shorts", desc: "Native formats for every social platform." },
                { title: "Auto scene generation from images", desc: "Bring your static product shots to life instantly." },
                { title: "Upscale video upto 4k", tag: "Coming Soon", desc: "Ultra-high definition rendering for professional use." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand group-hover:text-white transition-all transform group-hover:rotate-6">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                        {item.title}
                      </h4>
                      {item.tag && (
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="group relative inline-flex items-center gap-4 bg-brand text-white px-12 py-6 rounded-[32px] font-black text-xl shadow-[0_20px_40px_-12px_rgba(136,19,55,0.3)] hover:scale-105 transition-all">
              <span className="relative z-10 flex items-center gap-3">
                {isBn ? 'ভিডিও তৈরি করুন' : 'Create Videos'}
                <ArrowRight size={24} className="transform group-hover:translate-x-2 transition-all" />
              </span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* Comparison Section - The Deal Sealer */}
      <section className="py-24 px-6 relative overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              OrbStudio <span className="text-brand">vs</span> Traditional Shoots
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Why settle for weeks of logistics when you can ship in seconds?
            </p>
          </div>

          <div className="relative">
            {/* VS Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-brand text-white flex items-center justify-center font-black text-2xl shadow-2xl z-20 border-8 border-white dark:border-white/5 hidden lg:flex">
              VS
            </div>

            <div className="grid lg:grid-cols-2 gap-px bg-slate-100 dark:bg-white/5 rounded-[40px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl">

              {/* Traditional Column */}
              <div className="p-12 md:p-16 bg-white dark:bg-transparent">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">

                    <History size={24} />

                  </div>
                  <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Traditional</h3>
                </div>

                <div className="space-y-10">
                  {[
                    { label: "Cost", val: "$2,000 - $5,000+ per day", sub: "Models, studio, gear & crew" },
                    { label: "Turnaround", val: "2 - 4 Weeks", sub: "Booking to final retouching" },
                    { label: "Logistics", val: "Heavy & Complex", sub: "Casting, shipping products, travel" },
                    { label: "Re-shoots", val: "Restart from zero", sub: "Pay full price again" },
                    { label: "Scalability", val: "Linear growth", sub: "More photos = More humans needed" }
                  ].map((item, i) => (
                    <div key={i} className="group">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</p>
                      <p className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-1">{item.val}</p>
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OrbStudio Column */}
              <div className="p-12 md:p-16 bg-slate-50/50 dark:bg-black/20 relative">
                <div className="absolute inset-0 bg-brand/5 pointer-events-none" />
                <div className="flex items-center gap-4 mb-12 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shadow-lg shadow-brand/10">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-black text-brand uppercase tracking-widest">OrbStudio</h3>
                </div>

                <div className="space-y-10 relative z-10">
                  {[
                    { label: "Cost", val: "Included in plan", sub: "Fraction of a single coffee" },
                    { label: "Turnaround", val: "Instant / Seconds", sub: "Real-time generation" },
                    { label: "Logistics", val: "One Browser Tab", sub: "Upload & go. No physical travel" },
                    { label: "Re-shoots", val: "Free & Endless", sub: "Swap prompts in 1 second" },
                    { label: "Scalability", val: "Infinite scale", sub: "1 or 1,000 shots. Same effort." }
                  ].map((item, i) => (
                    <div key={i} className="group">
                      <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">{item.label}</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        {item.val}
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Modern SaaS Aesthetic */}
      <section id="pricing" className="py-20 px-6 relative overflow-hidden bg-transparent">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#881337 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6"
            >
              <Zap size={14} className="text-brand" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-brand">Pricing Plans</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
            >
              {t.landing.pricingTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium"
            >
              {t.landing.pricingSubtitle}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((p, i) => {
              // Convert Taka to Dollar for display (Mock conversion for UI)
              const priceUSD = p.id === 'free' ? '0' : (p.id === 'pro' ? '9' : '49');

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col p-10 rounded-[48px] bg-white dark:bg-black/20 backdrop-blur-3xl border-2 ${p.popular ? 'border-brand shadow-2xl shadow-brand/10' : 'border-slate-100 dark:border-white/5 shadow-sm'}`}
                >
                  {p.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-brand/20">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-10">
                    <h3 className="text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                      {p.label[language]}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">$</span>
                      <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{priceUSD}</span>
                      <span className="text-slate-400 dark:text-slate-500 font-bold ml-1">
                        {p.id === 'free' ? '' : p.period?.[language] || '/mo'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 mb-12 flex-1">
                    {p.features[language].map((f, fi) => (
                      <div key={fi} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium">
                        <div className="mt-1 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={14} className="text-brand" />
                        </div>
                        <span className="text-sm leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>

                  <button className={`group relative w-full py-6 rounded-[32px] font-black text-lg transition-all active:scale-95 ${p.popular ? 'bg-brand text-white hover:bg-brand-hover shadow-xl shadow-brand/20' : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {p.id === 'free' ? (language === 'bn' ? 'ফ্রি শুরু করুন' : 'Start Free') : (p.id === 'pro' ? (language === 'bn' ? 'প্রো মেম্বার হন' : 'Get Started') : (language === 'bn' ? 'বছরের সেরা ডিল নিন' : 'Choose Plan'))}
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-transparent z-10 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-slate-900 dark:text-white">{t.landing.faqTitle}</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-black/20 backdrop-blur-md border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden hover:border-brand/50 transition-all shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-8 py-6 flex items-center justify-between text-left">
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-96' : 'max-h-0 opacity-0'}`}><p className="px-8 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-white/5 pt-4">{faq.answer}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 dark:border-white/5 z-10 relative bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white"><Camera className="w-5 h-5" /></div>
            <span className="text-xl font-black text-slate-900 dark:text-white font-inter">Orb<span className="text-brand">Studio</span></span>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-brand transition-colors uppercase tracking-[0.2em]">{t.common.contact}</a>
            <a href="#" className="hover:text-brand transition-colors uppercase tracking-[0.2em]">{t.common.privacy}</a>
            <a href="#" className="hover:text-brand transition-colors uppercase tracking-[0.2em]">{t.common.terms}</a>
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 font-inter">© {new Date().getFullYear()} OrbStudio. {t.common.rights}</p>
        </div>
      </footer>
    </div>
  );
}
