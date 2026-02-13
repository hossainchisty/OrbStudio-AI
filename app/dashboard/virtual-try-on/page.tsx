'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { ToolType } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import {
    Check,
    Clipboard,
    History,
    RefreshCcw,
    Share2,
    Shirt,
    Sparkles,
    User,
    Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';

export default function VirtualTryOnPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    // Core States
    const [prompt, setPrompt] = useState('');
    const [modelImage, setModelImage] = useState<{ file: File, preview: string } | null>(null);
    const [garmentImage, setGarmentImage] = useState<{ file: File, preview: string } | null>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Refs
    const modelInputRef = useRef<HTMLInputElement>(null);
    const garmentInputRef = useRef<HTMLInputElement>(null);

    const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setModelImage({ file, preview: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setGarmentImage({ file, preview: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!modelImage || !garmentImage) return;
        setIsGenerating(true);
        setGeneratedResult(null);

        // This is a simulation/prompt engineering tool for now
        const instruction = `Virtual Try-On request:
        - Target Look: ${prompt || 'Professional seamless integration'}
        - Model description: Provided via image
        - Garment description: Provided via image
        
        Generate a professional visual description of the resulting high-end look after the AI virtual try-on process. Focus on fit, lighting, texture blending, and overall aesthetic. Provide ONLY the descriptive result.`;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: instruction,
                    subject: 'fashion-photography' as ToolType,
                }),
            });

            const data = await response.json();
            setGeneratedResult(data.text);
        } catch (err) {
            console.error("Failed to generate try-on result:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!generatedResult) return;
        navigator.clipboard.writeText(generatedResult);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#020005] overflow-hidden relative">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden dark:block">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-purple-500/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Header */}
            <header className="px-8 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-black/10 backdrop-blur-3xl z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-inner">
                        <Shirt size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                            {isBn ? 'ভার্চুয়াল ট্রাই-অন' : 'Virtual Try-On Hub'}
                        </h2>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 opacity-70">
                            {isBn ? 'এআই ড্রেস চেঞ্জিং স্টুডিও' : 'AI-Powered Clothing Swap'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 text-slate-400 hover:text-indigo-500 rounded-xl transition-all">
                        <History size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setModelImage(null);
                            setGarmentImage(null);
                            setPrompt('');
                            setGeneratedResult(null);
                        }}
                        className="p-2.5 text-slate-400 hover:text-indigo-500 rounded-xl transition-all"
                    >
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-10 custom-scrollbar">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-start">

                        {/* Left Side: Inputs */}
                        <div className="space-y-8 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-[40px] p-6 md:p-8 border border-slate-100 dark:border-white/10 shadow-2xl">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Upload Model */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Target Model*</label>
                                    <div
                                        onClick={() => modelInputRef.current?.click()}
                                        className={`group aspect-square cursor-pointer bg-white dark:bg-black/20 border-2 border-dashed rounded-[32px] p-4 transition-all relative overflow-hidden flex flex-col items-center justify-center text-center
                                            ${modelImage ? 'border-indigo-500/30' : 'border-slate-100 dark:border-white/5 hover:border-indigo-500/40'}`}
                                    >
                                        {modelImage ? (
                                            <>
                                                <img src={modelImage.preview} className="absolute inset-0 w-full h-full object-cover" alt="model" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                                                        <RefreshCcw size={16} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/5">
                                                    <User size={24} />
                                                </div>
                                                <span className="text-xs font-black text-slate-900 dark:text-white mb-1">Human Model</span>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Image of model</p>
                                            </>
                                        )}
                                        <input type="file" ref={modelInputRef} onChange={handleModelUpload} className="hidden" accept="image/*" />
                                    </div>
                                </div>

                                {/* Upload Clothing */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Clothing Item*</label>
                                    <div
                                        onClick={() => garmentInputRef.current?.click()}
                                        className={`group aspect-square cursor-pointer bg-white dark:bg-black/20 border-2 border-dashed rounded-[32px] p-4 transition-all relative overflow-hidden flex flex-col items-center justify-center text-center
                                            ${garmentImage ? 'border-indigo-500/30' : 'border-slate-100 dark:border-white/5 hover:border-indigo-500/40'}`}
                                    >
                                        {garmentImage ? (
                                            <>
                                                <img src={garmentImage.preview} className="absolute inset-0 w-full h-full object-cover" alt="garment" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                                                        <RefreshCcw size={16} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/5">
                                                    <Shirt size={24} />
                                                </div>
                                                <span className="text-xs font-black text-slate-900 dark:text-white mb-1">Garment</span>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Clothing Shot</p>
                                            </>
                                        )}
                                        <input type="file" ref={garmentInputRef} onChange={handleGarmentUpload} className="hidden" accept="image/*" />
                                    </div>
                                </div>
                            </div>

                            {/* Prompt */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Style Instructions (Optional)</label>
                                    <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe fit, tucking style, or specific look adjustments..."
                                        className="relative w-full bg-white dark:bg-black/40 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-0 outline-none min-h-[80px] resize-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !modelImage || !garmentImage}
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95
                                    ${isGenerating || !modelImage || !garmentImage
                                        ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed grayscale'
                                        : 'bg-indigo-600 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] shadow-indigo-500/20'}`}
                            >
                                {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <><Zap size={18} fill="currentColor" /> {isBn ? 'ট্রাই-অন শুরু করুন' : 'Start Try-On'}</>}
                            </button>
                        </div>

                        {/* Right Side: Result */}
                        <div className="h-full flex flex-col">
                            <div className="mb-6 flex items-center justify-between px-2">
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight uppercase leading-none">Outcome</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI Visualization</p>
                                </div>
                                <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                                    AI Precise
                                </div>
                            </div>

                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[40px] border border-dashed border-indigo-500/20 p-10 text-center min-h-[400px]">
                                            <div className="relative mb-8">
                                                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                                                <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin relative z-10" />
                                                <Shirt className="absolute inset-0 m-auto text-indigo-500 animate-bounce" size={32} />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Modeling Assets...</h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">Processing garment architecture integration</p>
                                        </motion.div>
                                    ) : generatedResult ? (
                                        <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                            <div className="relative group">
                                                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-[40px]" />
                                                <div className="relative bg-white dark:bg-black/40 backdrop-blur-3xl border border-slate-100 dark:border-white/10 rounded-[40px] p-8 shadow-2xl">
                                                    <div className="prose dark:prose-invert max-w-none text-sm md:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                                                        {generatedResult}
                                                    </div>
                                                    <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex flex-wrap gap-4">
                                                        <button onClick={handleCopy} className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs transition-all active:scale-95 ${copySuccess ? 'bg-emerald-500 text-white shadow-lg' : 'bg-indigo-600 dark:bg-white text-white dark:text-slate-900 shadow-xl'}`}>
                                                            {copySuccess ? <Check size={18} strokeWidth={3} /> : <Clipboard size={18} strokeWidth={2.5} />}
                                                            {copySuccess ? 'Copied' : 'Export Look'}
                                                        </button>
                                                        <button className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-all shadow-md"><Share2 size={22} /></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/20 flex gap-4 items-start translate-y-2">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/10">
                                                    <Sparkles size={18} />
                                                </div>
                                                <div>
                                                    <h5 className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-1 leading-none">Pro Tip</h5>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                        Ensure the clothing item is shot on a flat surface or a ghost mannequin for the most precise fabric drape.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[40px] border border-dashed border-slate-200 dark:border-white/10 p-12 text-center min-h-[400px]">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-8 text-slate-200 dark:text-slate-800 border border-slate-100 dark:border-white/5">
                                                <Shirt size={40} />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-400 dark:text-slate-600 tracking-tight uppercase leading-none">Ready</h4>
                                            <p className="text-[10px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest mt-4 max-w-[200px] leading-relaxed">
                                                Upload images to architect your look.
                                            </p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
