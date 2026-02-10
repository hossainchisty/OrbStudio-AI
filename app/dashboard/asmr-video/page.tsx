'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    Headphones,
    Monitor,
    Play,
    Settings2,
    Smartphone,
    Sparkles,
    Video
} from 'lucide-react';
import { useState } from 'react';

const DEMO_STYLES = [
    { id: 'cutting', name: 'Cutting', category: 'Satisfying', color: 'bg-rose-500' },
    { id: 'slime', name: 'Slime Play', category: 'Textures', color: 'bg-emerald-500' },
    { id: 'keyboard', name: 'Keyboard Sounds', category: 'Tech', color: 'bg-blue-500' },
    { id: 'smear', name: 'Smear & Spread', category: 'Mixing', color: 'bg-purple-500' },
    { id: 'petri', name: 'Petri Dish', category: 'Micro', color: 'bg-cyan-500' },
    { id: 'pens', name: 'Magic Pens', category: 'Art', color: 'bg-amber-500' },
    { id: 'bedroom', name: 'Bedroom', category: 'Ambience', color: 'bg-indigo-500' },
    { id: 'upstairs', name: 'Upstairs', category: 'Atmosphere', color: 'bg-slate-500' },
];

export default function ASMRVideoPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
    const [shotCount, setShotCount] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 3000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#020005]">
            <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black/20 backdrop-blur-xl z-20 sticky top-0">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-3">
                        <Sparkles className="text-emerald-500" />
                        {isBn ? 'ASMR স্টাইল ভিডিও' : 'ASMR Video Studio'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest pl-9">
                        {isBn ? 'জেনারেটিভ অডিও এবং ভিডিও' : 'Sensory Audio & Visual Generation'}
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Panel: Style Selection */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Headphones size={20} className="text-emerald-500" />
                                {isBn ? 'অডিও স্টাইল বেছে নিন' : 'Choose Audio Experience'}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {DEMO_STYLES.map((style) => (
                                    <div
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={`group cursor-pointer relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300
                                            ${selectedStyle === style.id
                                                ? 'border-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                                                : 'border-transparent hover:border-emerald-500/50 hover:scale-[1.02]'}`}
                                    >
                                        <div className={`absolute inset-0 ${style.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                            <div className={`w-12 h-12 rounded-full ${style.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                                <Play fill="currentColor" size={20} />
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white leading-tight">
                                                {style.name}
                                            </span>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">
                                                {style.category}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Settings */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Settings2 size={20} className="text-emerald-500" />
                                {isBn ? 'সেটিংস' : 'Configuration'}
                            </h3>

                            {/* Aspect Ratio */}
                            <div className="mb-8">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                    {isBn ? 'ভিডিও ফরম্যাট' : 'Video Format'}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setAspectRatio('9:16')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${aspectRatio === '9:16' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-100 dark:border-white/10 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <Smartphone size={24} className="mb-2" />
                                        <span className="font-bold text-xs">9:16 Short</span>
                                    </button>
                                    <button
                                        onClick={() => setAspectRatio('16:9')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${aspectRatio === '16:9' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-100 dark:border-white/10 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <Monitor size={24} className="mb-2" />
                                        <span className="font-bold text-xs">16:9 Landscape</span>
                                    </button>
                                </div>
                            </div>

                            {/* Shot Count */}
                            <div className="mb-8">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                    {isBn ? 'শট সংখ্যা' : 'Number of Shots'}
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="1"
                                        value={shotCount}
                                        onChange={(e) => setShotCount(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <span className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-black flex items-center justify-center shadow-lg">
                                        {shotCount}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!selectedStyle || isGenerating}
                                className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <span className="animate-pulse">Creating...</span>
                                ) : (
                                    <>
                                        <Video size={20} />
                                        {isBn ? 'ভিডিও তৈরি করুন' : 'Generate Video'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

