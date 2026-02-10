'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    Download,
    Image,
    Layers,
    PaintBucket,
    Printer,
    Smile,
    Sparkles,
    Sticker,
    Type,
    Wand2
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const STICKER_STYLES = [
    { id: 'cartoon', name: 'Cartoon', icon: Smile, color: 'text-yellow-500' },
    { id: 'pixel', name: 'Pixel Art', icon: Layers, color: 'text-indigo-500' },
    { id: 'illustration', name: 'Illustration', icon: PaintBucket, color: 'text-pink-500' },
    { id: '3d', name: '3D Render', icon: Sparkles, color: 'text-emerald-500' },
];

export default function StickerGeneratorPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('cartoon');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSticker, setGeneratedSticker] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedSticker('https://images.unsplash.com/photo-1596484552993-84729fe24a0d?q=80&w=600&auto=format&fit=crop'); // Placeholder
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#020005]">
            <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black/20 backdrop-blur-xl z-20 sticky top-0">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-3">
                        <Sticker className="text-pink-500" />
                        {isBn ? 'এআই স্টিকার জেনারেটর' : 'AI Sticker Generator'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest pl-9">
                        {isBn ? 'ব্যক্তিগত স্টিকার তৈরি করুন' : 'Create personalized stickers effortlessly'}
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 h-full">

                    {/* Left: Input */}
                    <div className="flex-1 flex flex-col gap-8">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Type size={20} className="text-pink-500" />
                                {isBn ? 'বর্ণনা দিন' : 'Enter a Keyword'}
                            </h3>

                            <div className="relative mb-6">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={isBn ? "যেমন: একটি চতুর বিড়াল..." : "E.g., Cat, Dog, Pizza, Cool..."}
                                    className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/10 focus:border-pink-500 focus:ring-0 transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                                />
                                <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-white dark:bg-black/40 px-2 py-1 rounded-md">
                                    {prompt.length}/200
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                {STICKER_STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 group
                                            ${selectedStyle === style.id
                                                ? 'border-pink-500 bg-pink-50 dark:bg-pink-500/10'
                                                : 'border-slate-100 dark:border-white/5 hover:border-pink-300'}`}
                                    >
                                        <style.icon size={20} className={style.color} />
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedStyle === style.id ? 'text-pink-600 dark:text-pink-400' : 'text-slate-500'}`}>
                                            {style.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!prompt || isGenerating}
                                className="w-full py-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black text-lg shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <span className="animate-pulse">Generating Sticker...</span>
                                ) : (
                                    <>
                                        <Wand2 size={20} />
                                        {isBn ? 'উৎপাদন করুন' : 'Generate Sticker'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="w-full lg:w-1/3 flex flex-col justify-start">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl h-full flex flex-col">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Image size={20} className="text-pink-500" />
                                    {isBn ? 'প্রিভিউ' : 'Result'}
                                </span>
                            </h3>

                            <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-black/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 mb-6 relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center"
                                        >
                                            <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-4" />
                                            <p className="text-xs font-bold text-pink-500 animate-pulse uppercase tracking-widest">Creating Magic...</p>
                                        </motion.div>
                                    ) : generatedSticker ? (
                                        <motion.img
                                            key="image"
                                            src={generatedSticker}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl"
                                        />
                                    ) : (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center p-8 opacity-50"
                                        >
                                            <Sticker size={48} className="mx-auto mb-4 text-slate-400" />
                                            <p className="text-sm font-medium text-slate-400">Your sticker will appear here</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {generatedSticker && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:scale-105 active:scale-95 transition-all">
                                        <Download size={16} /> Save PNG
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/20 transition-all">
                                        <Printer size={16} /> Print Ready
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
