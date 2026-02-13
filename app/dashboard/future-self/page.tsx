'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    Camera,
    History,
    RefreshCcw,
    Sparkles,
    User,
    Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';

const FUTURE_MODES = [
    { id: 'aging', name: 'Temporal Aging Synthesis', description: 'Run biology_v4.2 to project subject physiology 30 years forward.', icon: User },
    { id: 'lifestyle', name: 'Prosperity Path Projection', description: 'Map subject metadata to high-tier socioeconomic environments.', icon: Zap },
    { id: 'cybernetic', name: 'Augmented Neural Evolution', description: 'Simulate high-tech biometric integration and cyber-physical upgrades.', icon: Sparkles }
];

export default function FutureSelfPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [selectedImage, setSelectedImage] = useState<{ file: File, preview: string } | null>(null);
    const [selectedMode, setSelectedMode] = useState('aging');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage({ file, preview: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = () => {
        if (!selectedImage) return;
        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => {
            setIsGenerating(false);
            setResultImage(selectedImage.preview); // Placeholder
        }, 3000);
    };

    return (
        <div className="h-full flex flex-col bg-black text-emerald-500 font-mono relative overflow-hidden">
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,1,0.02))] bg-[length:100%_4px,3px_100%] opacity-20" />

            {/* Header */}
            <header className="px-8 py-4 border-b border-emerald-500/20 flex items-center justify-between shrink-0 bg-black/50 backdrop-blur-3xl z-40 relative">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <Zap size={20} fill="currentColor" className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-emerald-400 tracking-tighter uppercase italic">
                            {isBn ? 'ভবিষ্যৎ স্বয়ং' : 'Future Self '}
                        </h2>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mt-0.5">
                            Bypassing Temporal Architecture
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-6 text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        System: Stable
                    </div>
                    <button className="p-2.5 text-emerald-700 hover:text-emerald-400 border border-transparent hover:border-emerald-500/20 rounded-xl transition-all">
                        <History size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedImage(null);
                            setResultImage(null);
                        }}
                        className="p-2.5 text-emerald-700 hover:text-emerald-400 border border-transparent hover:border-emerald-500/20 rounded-xl transition-all"
                    >
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 relative z-30 custom-scrollbar">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

                    {/* Portrait Canvas */}
                    <div className="order-2 lg:order-1 flex flex-col gap-6 relative group">
                        {/* Glow effect for canvas */}
                        <div className="absolute -inset-1 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000 bg-emerald-500 rounded-[50px] pointer-events-none" />

                        <div
                            onClick={() => !selectedImage && fileInputRef.current?.click()}
                            className={`aspect-[4/5] rounded-[48px] border border-emerald-500/30 relative overflow-hidden group flex items-center justify-center transition-all duration-500 bg-[#050505] shadow-[inset_0_0_50px_rgba(0,0,0,1)]
                                ${selectedImage
                                    ? 'border-emerald-500/50'
                                    : 'hover:border-emerald-400 cursor-pointer ring-1 ring-emerald-500/10 hover:ring-emerald-500/30'}`}
                        >
                            {/* Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98111_1px,transparent_1px),linear-gradient(to_bottom,#10b98111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {isGenerating ? (
                                    <motion.div
                                        key="generating"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12"
                                    >
                                        <div className="relative w-24 h-24 mb-8">
                                            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
                                            <div className="absolute inset-0 border-t-2 border-emerald-400 rounded-full animate-spin" />
                                            <Sparkles className="absolute inset-0 m-auto text-emerald-400 animate-pulse" size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-[0.5em] mb-2 italic">Decrypting Bio-Data...</h3>
                                        <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap animate-typing">
                                            Executing temporal_map_v2.exe | Bypassing Firewall...
                                        </p>
                                    </motion.div>
                                ) : null}

                                {resultImage ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative w-full h-full p-3 group/result"
                                    >
                                        <img src={resultImage} alt="Future Self" className="w-full h-full object-cover rounded-[40px] opacity-90 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]" />

                                        {/* Result HUD Overlay */}
                                        <div className="absolute inset-8 pointer-events-none border border-emerald-500/20 rounded-[32px]">
                                            <div className="absolute top-4 left-4 text-[9px] uppercase font-bold tracking-widest text-emerald-400/60">Subject_01: Identified</div>
                                            <div className="absolute bottom-4 right-4 text-[9px] uppercase font-bold tracking-widest text-emerald-400/60">Success Rate: 99.4%</div>
                                        </div>

                                        <div className="absolute top-8 right-8 flex gap-2">
                                            <button onClick={() => { setSelectedImage(null); setResultImage(null); }} className="p-3 rounded-2xl bg-black border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                                <RefreshCcw size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : selectedImage ? (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="relative w-full h-full p-3"
                                    >
                                        <img src={selectedImage.preview} alt="Upload Preview" className="w-full h-full object-cover rounded-[40px] opacity-20 grayscale blur-[4px]" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <div
                                                className="w-24 h-24 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-6 hover:scale-110 transition-transform cursor-pointer group/zap"
                                                onClick={handleGenerate}
                                            >
                                                <Zap fill="currentColor" size={36} className="group-hover/zap:scale-125 transition-transform" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald-400 px-8 py-3 rounded-none border-x border-emerald-500/40 bg-emerald-500/5 backdrop-blur-md">Initialize Uplink</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center p-12 relative"
                                    >
                                        <div className="w-20 h-20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto mb-10 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500 relative overflow-hidden">
                                            <div className="absolute inset-0 animate-pulse bg-emerald-500/5" />
                                            <Camera size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-[0.4em] mb-3 leading-none italic">Awaiting Subject</h3>
                                        <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                                            Feed biometric visual data into the stream.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <input ref={fileInputRef} type="file" onChange={handleUpload} className="hidden" accept="image/*" />
                        </div>
                    </div>

                    {/* Right Side: Parameters */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="bg-[#080808] backdrop-blur-3xl rounded-[32px] p-7 border border-emerald-500/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 block flex items-center gap-2">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                Decoder_Protocol
                            </label>

                            <div className="space-y-3">
                                {FUTURE_MODES.map((mode) => {
                                    const Icon = mode.icon;
                                    const isSelected = selectedMode === mode.id;
                                    return (
                                        <div
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 group relative overflow-hidden
                                                ${isSelected
                                                    ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                                    : 'border-emerald-500/10 bg-black/50 hover:border-emerald-500/40'}`}
                                        >
                                            {isSelected && <div className="absolute inset-y-0 left-0 w-1 bg-emerald-400" />}
                                            <div className={`p-2.5 rounded-lg transition-colors ${isSelected ? 'text-emerald-400' : 'text-emerald-900 group-hover:text-emerald-600'}`}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-xs font-bold transition-colors uppercase tracking-widest ${isSelected ? 'text-emerald-400 [text-shadow:0_0_10px_rgba(16,185,129,0.5)]' : 'text-emerald-800'}`}>
                                                    {mode.name}
                                                </h4>
                                                <p className="text-[9px] text-emerald-900 font-bold uppercase tracking-widest mt-1">
                                                    Status: {isSelected ? 'In_Queu' : 'Standby'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-8 border-t border-emerald-500/20">
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedImage || isGenerating}
                                    className={`w-full py-5 rounded-none font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border
                                        ${!selectedImage || isGenerating
                                            ? 'border-emerald-900 text-emerald-900 cursor-not-allowed opacity-50 bg-black'
                                            : 'border-emerald-500 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'}`}
                                >
                                    {isGenerating ? <RefreshCcw size={16} className="animate-spin" /> : <><Zap size={16} fill="currentColor" /> {isBn ? 'ডিক্রিপ্ট করুন' : 'Execute Decrypt'}</>}
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-black border border-emerald-500/10 flex gap-5 items-start relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-12 h-12 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 bg-emerald-500/5 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
                                <Sparkles size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] mb-2 leading-none flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rotate-45" /> Neural_Log
                                </h5>
                                <p className="text-[10px] text-emerald-900 font-bold uppercase tracking-widest leading-relaxed">
                                    Temporal synthesis identifies subject path with 98% probability. encryption_level: HIGH.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-10 select-none">
                <div className="absolute top-0 right-0 w-full h-full text-[8px] leading-tight text-emerald-500 whitespace-pre font-mono p-4">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="opacity-[0.1]" style={{ marginLeft: `${Math.random() * 100}%` }}>
                            {Math.random().toString(2).substring(2, 10)} 0x{Math.random().toString(16).substring(2, 6).toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
