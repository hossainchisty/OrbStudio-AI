'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    ArrowUpRight,
    Eye,
    History,
    Maximize,
    Sparkles,
    Upload,
    Wand2
} from 'lucide-react';
import { useRef, useState } from 'react';

const UPSCALE_MODES = [
    {
        id: 'precise',
        name: 'Precise Upscale',
        description: 'Faithful restoration with sharp details.',
        icon: Eye,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        id: 'refined',
        name: 'Refined Upscale',
        description: 'Balanced enhancement for general use.',
        icon: Sparkles,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 'creative',
        name: 'Creative Upscale',
        description: 'AI-driven detail hallucination.',
        icon: Wand2,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
];

export default function ImageUpscalePage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [upscaleMode, setUpscaleMode] = useState('refined');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpscale = () => {
        if (!selectedImage) return;
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 3000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#020005]">
            <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black/20 backdrop-blur-xl z-20 sticky top-0">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-3">
                        <Maximize className="text-blue-500" />
                        {isBn ? 'ইমেজ আপস্কেল' : 'Image Upscale'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest pl-9">
                        {isBn ? 'হাই রেজোলিউশন তৈরি করুন' : 'Super-Resolution Enhancement'}
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                    {/* Left: Upload Area */}
                    <div className="flex flex-col gap-6">
                        <div
                            className={`flex-1 min-h-[400px] rounded-3xl border-2 border-dashed transition-all relative overflow-hidden group flex items-center justify-center bg-white dark:bg-white/5
                                ${selectedImage
                                    ? 'border-blue-500/30'
                                    : 'border-slate-200 dark:border-white/10 hover:border-blue-500/40 hover:bg-blue-50/20'}`}
                        >
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain p-4" />
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                                        {isBn ? 'ছবি আপলোড করুন' : 'Upload your image'}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-[200px] mx-auto">
                                        Drag & drop or select from history to enhance quality.
                                    </p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Browse Files
                                    </button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelect}
                            />
                        </div>

                        {/* History Quick Access */}
                        <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <History size={14} />
                                    Recent Generations
                                </h4>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-white/10 shrink-0 border border-transparent hover:border-blue-500 cursor-pointer transition-all" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex flex-col justify-center gap-8 lg:pl-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                                {isBn ? 'আপস্কেল মোড' : 'Upscale Mode'}
                            </h3>
                            <div className="space-y-4">
                                {UPSCALE_MODES.map((mode) => {
                                    const Icon = mode.icon;
                                    const isSelected = upscaleMode === mode.id;
                                    return (
                                        <div
                                            key={mode.id}
                                            onClick={() => setUpscaleMode(mode.id)}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 group
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                                                    : 'border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20 bg-white dark:bg-white/5'}`}
                                        >
                                            <div className={`p-3 rounded-xl ${mode.bg} ${mode.color}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className={`font-black text-base mb-1 transition-colors ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {mode.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                    {mode.description}
                                                </p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                ${isSelected ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={handleUpscale}
                            disabled={!selectedImage || isProcessing}
                            className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">Enhancing...</span>
                            ) : (
                                <>
                                    <ArrowUpRight size={24} strokeWidth={3} />
                                    {isBn ? 'শুরু করুন' : 'Start Upscale'}
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
