'use client';

import { TOOLS } from '@/lib/constants';
import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    ArrowRight,
    Calendar,
    Camera,
    Image as ImageIcon,
    MessageSquare,
    Play,
    Shirt,
    Sparkles,
    Trash2,
    User
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const IconMap: Record<string, React.FC<any>> = {
    'product-photography': Camera,
    'fashion-photography': User,
    'image-to-prompt': ImageIcon,
    'video-ads': Play,
    'virtual-try-on': Shirt,
};

interface Chat {
    id: string;
    title: string;
    subject: string;
    created_at: string;
}

export default function CreationsPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isBn = t.settings.languageName === 'বাংলা';

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch('/api/chats');
            const data = await res.json();
            if (data.chats) {
                setChats(data.chats);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteChat = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(isBn ? 'আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this creation?')) return;

        try {
            // We'll implement a delete API if needed, but for now just filter locally or implement it
            // For now, let's just assume we have a delete endpoint
            const res = await fetch(`/api/chats/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setChats(chats.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    return (
        <div className="relative p-4 md:p-6 lg:p-8 max-w-6xl mx-auto min-h-screen overflow-hidden">
            {/* Ambient Background Elements - Premium Dark Mode */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 hidden dark:block">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-[10%] left-[10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full"
                />
            </div>

            <header className="mb-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand border border-brand/20 shadow-inner">
                            <Sparkles size={20} className="fill-current" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                            {isBn ? 'আপনার ব্যক্তিগত গ্যালারি' : 'Your Vision Archive'}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none uppercase">
                        {isBn ? 'আমার ' : 'My '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-rose-400">
                            {isBn ? 'ক্রিয়েশনস' : 'Creations'}
                        </span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                        {isBn
                            ? 'আপনার সকল এআই জেনারেটেড প্রজেক্ট এবং কনভারসেশন এখানে দেখুন।'
                            : 'Access all your AI-generated projects and creative conversations in one place.'}
                    </p>
                </motion.div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 relative z-10">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                        <Sparkles size={18} className="absolute inset-0 m-auto text-brand animate-pulse" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                        {isBn ? 'গ্যালারি লোড হচ্ছে...' : 'Curating gallery...'}
                    </p>
                </div>
            ) : chats.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center py-16 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl"
                >
                    <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-white/5">
                        <ImageIcon size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                        {isBn ? 'এখনও কোনো সৃষ্টি নেই' : 'No creations yet'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto font-medium text-sm">
                        {isBn
                            ? 'আপনার প্রথম এআই ফটোগ্রাফি প্রোজেক্ট শুরু করতে ড্যাশবোর্ডে যান।'
                            : 'Transform your vision into reality. Head back to the dashboard to start.'}
                    </p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-xl font-black shadow-xl shadow-brand-shadow hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
                        {isBn ? 'শুরু করুন' : 'Start Creating'}
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10">
                    {chats.map((chat, index) => {
                        const Icon = IconMap[chat.subject] || MessageSquare;
                        const tool = TOOLS.find(t => t.id === chat.subject);

                        return (
                            <motion.div
                                key={chat.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                            >
                                <Link
                                    href={`/dashboard/${chat.subject}?id=${chat.id}`}
                                    className="group relative block bg-white/60 dark:bg-white/5 backdrop-blur-3xl border border-white dark:border-white/10 rounded-[28px] p-5 shadow-lg hover:shadow-2xl hover:border-brand/30 transition-all duration-500 overflow-hidden min-h-[180px] flex flex-col"
                                >
                                    {/* Glass Glow */}
                                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand/5 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />

                                    <div className="relative z-10 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-brand/10 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-brand shadow-lg shadow-brand-shadow group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                                                    <Icon size={20} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                                    <Calendar size={10} strokeWidth={3} />
                                                    {new Date(chat.created_at).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[8px] font-black rounded-lg uppercase tracking-[0.15em] border border-slate-100 dark:border-white/5">
                                                    {tool?.name || chat.subject}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-brand transition-colors tracking-tight">
                                            {chat.title}
                                        </h3>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-brand uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                                {isBn ? 'ডিটেইলস' : 'Open'}
                                                <ArrowRight size={14} strokeWidth={3} />
                                            </div>
                                            <button
                                                onClick={(e) => deleteChat(chat.id, e)}
                                                className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
