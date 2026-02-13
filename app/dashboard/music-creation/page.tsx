'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    ChevronDown,
    Heart,
    History,
    Loader2,
    Music,
    Search
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const MODELS = [
    { id: 'v3.5', name: 'v3.5', tag: 'HD', quality: 'Pro Quality' },
    { id: 'v3.0', name: 'v3.0', quality: 'Standard' },
];

const PRESET_STYLES = [
    "World Music", "Christmas Music", "Female Vocals",
    "Plate Reverb", "Delay Effects", "Acoustic Guitar", "Vibrato"
];

export default function MusicCreationPage() {
    const { user } = useUser();
    const { t } = useLanguage();

    const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [lyrics, setLyrics] = useState('');
    const [styles, setStyles] = useState('');
    const [quantity, setQuantity] = useState(2);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'work' | 'collection'>('work');

    const handleCreate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 3000);
    };

    const addStyleTag = (tag: string) => {
        if (!styles.includes(tag)) {
            setStyles(prev => prev ? `${prev}, ${tag}` : tag);
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-6">
            <div className="max-w-[1300px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                            <Music className="w-5 h-5 text-amber-500" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            Music Creation
                        </h1>

                        <div className="relative ml-2">
                            <button
                                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                className="flex items-center gap-2.5 px-4 py-2 bg-slate-900/50 dark:bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 cursor-pointer hover:bg-slate-900/70 dark:hover:bg-black/60 transition-all group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-300">Model</span>
                                <div className="h-3 w-px bg-white/10" />
                                <span className="text-xs font-bold text-white">{selectedModel}</span>
                                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isModelDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-2 w-44 bg-slate-900 dark:bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-1.5"
                                    >
                                        {MODELS.map((model) => (
                                            <button
                                                key={model.id}
                                                onClick={() => {
                                                    setSelectedModel(model.id);
                                                    setIsModelDropdownOpen(false);
                                                }}
                                                className={`w-full flex flex-col items-start p-2.5 rounded-lg transition-all ${selectedModel === model.id
                                                    ? 'bg-amber-500 text-white'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs">{model.name}</span>
                                                    {model.tag && (
                                                        <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${selectedModel === model.id ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                                                            {model.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[9px] opacity-60 mt-0.5">{model.quality}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-[380px_1fr] gap-6">
                    {/* Left Column - Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Lyrics Card */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[24px] p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/70">Lyrics</label>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{lyrics.length} / 3k</span>
                            </div>
                            <textarea
                                value={lyrics}
                                onChange={(e) => setLyrics(e.target.value)}
                                placeholder="Enter song lyrics..."
                                className="w-full h-32 bg-black/20 border border-white/5 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-amber-500/30 transition-all resize-none custom-scrollbar"
                            />
                        </div>

                        {/* Styles Card */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[24px] p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/70">Styles</label>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{styles.length} / 2k</span>
                            </div>
                            <textarea
                                value={styles}
                                onChange={(e) => setStyles(e.target.value)}
                                placeholder="Jazz, 80s Pop..."
                                className="w-full h-20 bg-black/20 border border-white/5 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-amber-500/30 transition-all resize-none custom-scrollbar"
                            />

                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {PRESET_STYLES.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => addStyleTag(tag)}
                                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[9px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Action */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[24px] p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quantity</span>
                                <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
                                    {[1, 2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setQuantity(num)}
                                            className={`w-7 h-7 rounded text-[10px] font-black transition-all ${quantity === num ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={isGenerating}
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-black rounded-xl py-3.5 font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-[0.98]"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Create</span>
                                        <div className="w-px h-3 bg-black/10" />
                                        <span className="text-xs">600</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column - Results */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 flex flex-col min-h-[500px]"
                    >
                        {/* Tabs Header */}
                        <div className="flex items-center gap-6 mb-6 border-b border-white/5 pb-0">
                            {[
                                { id: 'work', name: 'My Work', icon: History },
                                { id: 'collection', name: 'Collection', icon: Heart }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <tab.icon className="w-3.5 h-3.5" />
                                        {tab.name}
                                    </div>
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="music-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                                    )}
                                </button>
                            ))}

                            <div className="flex-1" />

                            <div className="flex items-center bg-white/5 rounded-lg px-3 pb-3 mb-3 border border-white/5">
                                <Search className="w-3 h-3 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-[10px] text-white px-2 py-1.5 w-32 placeholder:text-slate-600 font-medium"
                                />
                            </div>
                        </div>

                        {/* Empty State */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Music className="w-8 h-8 text-slate-700" />
                            </div>
                            <h3 className="text-lg font-black text-white mb-2">Nothing here yet</h3>
                            <p className="text-slate-500 text-xs max-w-[280px] leading-relaxed">
                                Type anything into the textbox on the left to start creating.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
