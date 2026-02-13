'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    ChevronRight,
    Heart,
    History,
    MessageCircle,
    MoreHorizontal,
    Search,
    Sparkles,
    Star,
    Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const CHARACTERS = [
    {
        id: 'elara',
        name: 'Elara Von Weiss',
        role: 'Quantum Historian',
        description: 'Elara remembers every detail of your previous conversations, weaving them into an evolving narrative about the future of time.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format',
        style: 'Modern Academic',
        rarity: 'Legendary',
        traits: ['Meticulous', 'Vibrant', 'Nostalgic']
    },
    {
        id: 'sora',
        name: 'Sora Tanaka',
        role: 'Cyber-Neon Artist',
        description: 'A rebel from a futuristic Shibuya. Her stories adapt to your aesthetic preferences, creating a world that feels tailored to your vision.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format',
        style: 'Streetwear Tech',
        rarity: 'Epic',
        traits: ['Energetic', 'Creative', 'Bold']
    },
    {
        id: 'mira',
        name: 'Mira Thorne',
        role: 'Gothic Archivist',
        description: 'Guardian of the Dark Library. She remembers your fears and victories, evolving her personality based on the depth of your trust.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format',
        style: 'Victorian Gothic',
        rarity: 'Rare',
        traits: ['Mysterious', 'Loyal', 'Profound']
    }
];

export default function MeetHerPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [selectedChar, setSelectedChar] = useState(CHARACTERS[0].id);
    const activeChar = CHARACTERS.find(c => c.id === selectedChar) || CHARACTERS[0];

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#020005]">
            {/* Header */}
            <header className="px-8 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-black/10 backdrop-blur-3xl z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-inner">
                        <Heart size={20} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isBn ? 'তার সাথে দেখা করুন' : 'Meet Her'}
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                            Living Characters • Evolving Stories
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                        <Search size={14} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Find your companion..."
                            className="bg-transparent border-none outline-none text-xs font-medium text-slate-600 dark:text-slate-300 w-40 placeholder:text-slate-400"
                        />
                    </div>
                    <button className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                        <History size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-4 md:p-8 lg:p-10 gap-8">
                {/* Left Side: Character List */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 relative z-10">
                    <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                        {CHARACTERS.map((char) => (
                            <motion.div
                                key={char.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedChar(char.id)}
                                className={`p-4 rounded-[32px] cursor-pointer transition-all border-2 relative overflow-hidden group
                                    ${selectedChar === char.id
                                        ? 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-500/10 shadow-2xl shadow-rose-500/10'
                                        : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-rose-500/20 shadow-xl shadow-black/5'}`}
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="relative">
                                        <div className={`absolute -inset-1 rounded-full blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity bg-rose-500/30 ${selectedChar === char.id ? 'opacity-100' : ''}`} />
                                        <img src={char.avatar} alt={char.name} className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-black shadow-lg" />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-black flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-black transition-colors ${selectedChar === char.id ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                                            {char.name}
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                                            {char.role}
                                        </p>
                                    </div>
                                    <ChevronRight size={16} className={`text-slate-300 transition-transform ${selectedChar === char.id ? 'rotate-90 text-rose-500' : ''}`} />
                                </div>
                                {selectedChar === char.id && (
                                    <div className="mt-4 pt-4 border-t border-rose-500/10 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => <Star key={i} size={8} fill="currentColor" className="text-rose-500" />)}
                                        </div>
                                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Active Bond</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-auto p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                        <Sparkles size={20} className="text-indigo-500 mb-4 animate-pulse" />
                        <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-2 leading-none">Global Evolution</h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Characters are part of a shared matrix. Their stories adapt based on collective intelligence and individual bonds.
                        </p>
                    </div>
                </div>

                {/* Right Side: Portrait & Interaction */}
                <div className="flex-1 relative z-10 flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeChar.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-[40px] border border-slate-100 dark:border-white/10 shadow-2xl relative overflow-hidden flex flex-col"
                        >
                            {/* Ambient Portrait Overlay */}
                            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-rose-500/10 via-transparent to-transparent pointer-events-none" />

                            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1.5 rounded-full bg-rose-500 shadow-xl text-white text-[9px] font-black uppercase tracking-widest">
                                            {activeChar.rarity}
                                        </span>
                                        <div className="flex gap-2">
                                            {activeChar.traits.map(t => (
                                                <span key={t} className="px-3 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-100 dark:border-white/10 text-[9px] font-black text-slate-500 dark:text-white uppercase tracking-widest shadow-sm">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9] mb-8">
                                        Meet <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600">
                                            {activeChar.name.split(' ')[0]}
                                        </span>
                                    </h1>

                                    <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-10 italic">
                                        "{activeChar.description}"
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="p-6 rounded-[32px] bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 shadow-lg">
                                            <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Style</h6>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{activeChar.style}</p>
                                        </div>
                                        <div className="p-6 rounded-[32px] bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 shadow-lg">
                                            <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Last Active</h6>
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Just Now</p>
                                        </div>
                                        <div className="p-6 rounded-[32px] bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 shadow-lg hidden md:block">
                                            <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Complexity</h6>
                                            <div className="flex gap-1 mt-1">
                                                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i <= 3 ? 'bg-rose-500' : 'bg-slate-200 dark:bg-white/10'}`} />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interaction Bar */}
                            <div className="p-6 md:p-8 bg-white/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/10 backdrop-blur-xl">
                                <div className="max-w-3xl mx-auto flex items-center gap-4">
                                    <div className="flex-1 relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                                        <div className="relative flex items-center px-6 py-4 rounded-3xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-inner">
                                            <MessageCircle size={18} className="text-slate-400 mr-4" />
                                            <input
                                                type="text"
                                                placeholder={`Speak with ${activeChar.name.split(' ')[0]}...`}
                                                className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-white w-full placeholder:text-slate-400"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><MoreHorizontal size={16} /></button>
                                                <div className="w-[1px] h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                                                <button className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-rose-500/20">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-14 h-14 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                        <Zap size={18} fill="currentColor" />
                                        <span className="text-[7px] font-black uppercase tracking-widest">Bond</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Background Aesthetics */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-500/10 blur-[150px] rounded-full" />
                <div className="absolute top-[30%] -right-[5%] w-[40%] h-[60%] bg-rose-500/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-indigo-500/10 blur-[180px] rounded-full" />
            </div>
        </div>
    );
}
