'use client';

import { TOOLS } from '@/lib/constants';
import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import { ArrowRight, Camera, Image as ImageIcon, Maximize, Music, Play, QrCode, Sparkles, Speech, Sticker, User } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

const IconMap: Record<string, React.FC<any>> = {
    Camera: Camera,
    User: User,
    Image: ImageIcon,
    Play: Play,
    Sparkles: Sparkles,
    Maximize: Maximize,
    Sticker: Sticker,
    QrCode: QrCode,
    Speech: Speech,
    Music: Music,
};

export default function DashboardHub() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    return (
        <div className="relative min-h-full overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -30, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-purple-500/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [0, 40, 0],
                        y: [0, -60, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 blur-[150px] rounded-full"
                />
            </div>

            <div className="relative p-6 md:p-10 lg:p-12 max-w-[1800px] mx-auto z-10">
                {/* Welcome Header */}
                <header className="mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand mb-6 backdrop-blur-md">
                            <Sparkles size={16} className="fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                {isBn ? 'স্বাগতম' : 'Professional Creative Suite'}
                            </span>
                        </div> */}

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
                            <div className="max-w-4xl">
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight">
                                    {isBn ? `হ্যালো, ` : `Hi, `}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-rose-400">
                                        {user?.firstName + ' ' + user?.lastName || 'Creator'}
                                    </span>
                                </h1>
                                <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                                    {isBn
                                        ? 'আপনার ক্রিয়েটিভ ভিশনকে বাস্তবে রূপ দিতে আমাদের এআই টুলগুলো ব্যবহার করুন।'
                                        : 'Step into your AI-powered studio. Select a specialized tool to transform your creative vision into professional-grade visual excellence.'}
                                </p>
                            </div>

                            {/* Stats Badge - Glassmorphic */}
                            {/* <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="hidden lg:flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[24px] shadow-xl min-w-[140px]"
                            >
                                <span className="text-3xl font-black text-brand mb-1">PRO</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{t.profile.planDetails}</span>
                            </motion.div> */}
                        </div>
                    </motion.div>
                </header>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                    {TOOLS.map((tool, index) => {
                        const Icon = IconMap[tool.icon] || Camera;
                        const toolConfigs: Record<string, { gradient: string, shadow: string, glow: string }> = {
                            blue: {
                                gradient: 'from-blue-600 to-blue-400',
                                shadow: 'shadow-blue-500/20',
                                glow: 'bg-blue-500/20'
                            },
                            purple: {
                                gradient: 'from-purple-600 to-purple-400',
                                shadow: 'shadow-purple-500/20',
                                glow: 'bg-purple-500/20'
                            },
                            emerald: {
                                gradient: 'from-emerald-600 to-emerald-400',
                                shadow: 'shadow-emerald-500/20',
                                glow: 'bg-emerald-500/20'
                            },
                            rose: {
                                gradient: 'from-rose-600 to-rose-400',
                                shadow: 'shadow-rose-500/20',
                                glow: 'bg-rose-500/20'
                            },
                            pink: {
                                gradient: 'from-pink-600 to-pink-400',
                                shadow: 'shadow-pink-500/20',
                                glow: 'bg-pink-500/20'
                            },
                            indigo: {
                                gradient: 'from-indigo-600 to-indigo-400',
                                shadow: 'shadow-indigo-500/20',
                                glow: 'bg-indigo-500/20'
                            },
                            amber: {
                                gradient: 'from-amber-600 to-amber-400',
                                shadow: 'shadow-amber-500/20',
                                glow: 'bg-amber-500/20'
                            },
                        };

                        const config = toolConfigs[tool.color];

                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                            >
                                <Link
                                    href={`/dashboard/${tool.id}`}
                                    className="group relative block h-full bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[32px] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-brand/30 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Glass Glow Effect */}
                                    <div className={`absolute -top-20 -right-20 w-48 h-48 ${config.glow} blur-[50px] rounded-full transition-all duration-700 group-hover:scale-150 group-hover:opacity-40`} />

                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white mb-4 shadow-lg ${config.shadow} transition-transform duration-700 group-hover:rotate-[10deg] group-hover:scale-105`}>
                                            <Icon size={20} strokeWidth={2.5} />
                                        </div>

                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-brand transition-colors tracking-tight">
                                            {tool.name}
                                        </h3>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2">
                                            {tool.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-shadow hover:bg-brand-hover transition-all group-hover:scale-105 active:scale-95">
                                                {tool.id === 'fashion-photography'
                                                    ? (isBn ? 'ট্রাই অন' : 'Try On')
                                                    : tool.id === 'video-ads'
                                                        ? (isBn ? 'তৈরি করুন' : 'Create')
                                                        : (isBn ? 'জেনারেট করুন' : 'Generate')
                                                }
                                                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                                            </div>

                                            <span className="text-2xl font-black text-slate-100 dark:text-white/5 select-none group-hover:text-brand/10 transition-colors">
                                                0{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Info Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 p-6 bg-brand/80 backdrop-blur-3xl rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex items-center gap-4 text-center md:text-left">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black mb-0.5">{isBn ? 'নতুন কি আছে?' : "What's New?"}</h4>
                            <p className="text-sm text-white/60 font-medium">{isBn ? 'আরও উন্নত জেনারেশন এবং ইমেজ অ্যানালাইসিস!' : 'Enhanced generation quality and visual analysis models.'}</p>
                        </div>
                    </div>

                    <Link href="/dashboard/creations" className="relative z-10 bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs whitespace-nowrap hover:scale-105 active:scale-95 transition-all shadow-xl">
                        {isBn ? 'আমার গ্যালারি দেখুন' : 'View My Gallery'}
                    </Link>
                </motion.div>

                {/* Footer */}
                <footer className="mt-20 pb-10 text-center">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-4">
                        OrbStudio Creative Suite — v2.0
                    </p>
                    <div className="flex justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <div className="w-1.5 h-1.5 rounded-full bg-brand/40" />
                    </div>
                </footer>
            </div>
        </div>
    );
}
