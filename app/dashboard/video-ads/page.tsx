'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { ToolType } from '@/lib/types';
import { Check, Clipboard, Film, Play, RefreshCcw, Share2, Sparkles, Upload, Video, X, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export default function VideoAdsPage() {
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [modelType, setModelType] = useState<'lite' | 'pro'>('lite');
    const [prompt, setPrompt] = useState('');
    const [inputImage, setInputImage] = useState<{ file?: File, preview: string } | null>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedScript, setGeneratedScript] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // Handle paste from clipboard
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setInputImage({ file: blob, preview: reader.result as string });
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setInputImage({ file, preview: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleEnhance = () => {
        const enhanced = `high-converting video ad, ${prompt}, dynamic transitions, hook-based structure, professional voiceover, compelling call-to-action, ${modelType === 'pro' ? '1080p' : '720p'} resolution`;
        setPrompt(enhanced);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedScript(null);

        const instruction = `Video Ad Generation request:
        - Resolution: ${modelType === 'lite' ? '720p' : '1080p'}
        - User Prompt: ${prompt}
        - Input image: ${inputImage ? 'Provided' : 'Not provided'}
        
        Create a professional video ad script and visual concept. Include hook, main content, transition suggestions, and call-to-action. Provide ONLY the script and visual directions.`;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: instruction,
                    subject: 'video-ads' as ToolType,
                }),
            });

            const data = await response.json();
            setGeneratedScript(data.text);
        } catch (err) {
            console.error("Failed to generate video ad:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!generatedScript) return;
        navigator.clipboard.writeText(generatedScript);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#020005] overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden dark:block">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-red-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Header */}
            <header className="px-8 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-black/10 backdrop-blur-3xl z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <Play size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            {isBn ? 'ভিডিও এডস স্টুডিও' : 'Video Ads Studio'}
                        </h2>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 opacity-70">
                            {isBn ? 'হাই-কনভার্টিং ভিডিও জেনারেশন' : 'High-Converting Video Generation'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setInputImage(null);
                        setPrompt('');
                        setGeneratedScript(null);
                    }}
                    className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                >
                    <RefreshCcw size={18} />
                </button>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
                {/* Left Side: Inputs */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar border-r border-slate-100 dark:border-white/5">
                    <div className="max-w-xl mx-auto space-y-6">

                        {/* Upload Input Image */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Upload Input Image*</label>
                            <div
                                onClick={() => inputRef.current?.click()}
                                className="group cursor-pointer bg-white dark:bg-black/20 border-2 border-dashed border-slate-100 dark:border-white/5 hover:border-rose-500/40 rounded-2xl p-8 transition-all relative"
                            >
                                {inputImage ? (
                                    <div className="relative">
                                        <img src={inputImage.preview} className="w-full h-48 object-cover rounded-xl" alt="input" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setInputImage(null);
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={20} />
                                        </div>
                                        <span className="text-sm font-black text-slate-900 dark:text-white mb-1">Choose Input Image</span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-500 font-medium">Ready for paste or click to browse</p>
                                    </div>
                                )}
                                <input type="file" ref={inputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>

                        {/* Prompt */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prompt *</label>
                            <div className="relative">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the video you want to generate..."
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl p-4 pr-20 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500/20 outline-none min-h-[120px] resize-none"
                                />
                                <button
                                    onClick={handleEnhance}
                                    className="absolute top-3 right-3 px-3 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-700 transition-all"
                                >
                                    Enhance
                                </button>
                            </div>
                        </div>

                        {/* Model Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Model Selection *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'lite', label: 'Lite Model', sub: '720p Resolution' },
                                    { id: 'pro', label: 'Pro Model', sub: '1080p Resolution' }
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setModelType(m.id as any)}
                                        className={`flex flex-col items-start p-5 rounded-2xl border transition-all text-left group
                                            ${modelType === m.id
                                                ? 'bg-rose-600 dark:bg-rose-500 text-white border-rose-600 shadow-xl shadow-rose-500/20 scale-[1.02]'
                                                : 'bg-white dark:bg-white/3 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-rose-500/30'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${modelType === m.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-white/5'}`}>
                                            {m.id === 'lite' ? <Video size={16} className={modelType === m.id ? 'text-white' : ''} /> : <Film size={16} className={modelType === m.id ? 'text-white' : ''} />}
                                        </div>
                                        <span className="text-xs font-black mb-1">{m.label}</span>
                                        <span className={`text-[9px] font-medium opacity-60 ${modelType === m.id ? 'text-white' : ''}`}>{m.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95
                                ${isGenerating || !prompt
                                    ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                                    : 'bg-rose-600 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02]'}`}
                        >
                            {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <><Sparkles size={18} fill="currentColor" /> {isBn ? 'ভিডিও তৈরি করুন' : 'Generate Video Concept'}</>}
                        </button>
                    </div>
                </div>

                {/* Right Side: Result */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-black/30 backdrop-blur-sm">
                    <div className="max-w-xl mx-auto h-full flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                                {isBn ? 'স্টুডিও আউটপুট' : 'Studio Outcome'}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {isBn ? 'আপনার ভিডিও স্ক্রিপ্ট এবং ভিজ্যুয়াল কনসেপ্ট এখানে প্রদর্শিত হবে।' : 'Your video script and visual concept will appear here.'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center min-h-[400px]">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                        <Play size={48} className="relative z-10 text-rose-500 animate-bounce" />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                                        {isBn ? 'ভিডিও কনসেপ্ট তৈরি হচ্ছে...' : 'Crafting Video Concept...'}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 font-medium max-w-[200px]">
                                        {isBn ? 'এআই আপনার জন্য একটি হাই-কনভার্টিং ভিডিও স্ক্রিপ্ট তৈরি করছে।' : 'Our AI is creating a high-converting video script and visual pacing for you.'}
                                    </p>
                                </motion.div>
                            ) : generatedScript ? (
                                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/50 to-pink-500/50 blur-xl opacity-10 group-hover:opacity-30 transition-opacity rounded-[32px]" />
                                        <div className="relative bg-white dark:bg-black/40 backdrop-blur-3xl border border-slate-100 dark:border-white/10 rounded-[28px] p-6 shadow-2xl">
                                            <div className="prose dark:prose-invert max-w-none text-sm md:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                                                {generatedScript}
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex flex-wrap gap-3">
                                                <button onClick={handleCopy} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all active:scale-95 ${copySuccess ? 'bg-emerald-500 text-white shadow-lg' : 'bg-rose-600 dark:bg-white text-white dark:text-slate-900 shadow-md'}`}>
                                                    {copySuccess ? <Check size={16} strokeWidth={3} /> : <Clipboard size={16} strokeWidth={2.5} />}
                                                    {copySuccess ? (isBn ? 'কপি সফল' : 'Copied!') : (isBn ? 'স্ক্রিপ্ট কপি করুন' : 'Copy Script')}
                                                </button>
                                                <button className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-all"><Share2 size={20} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center shrink-0">
                                                <Sparkles size={16} />
                                            </div>
                                            <div>
                                                <h5 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-1">Pro Tip</h5>
                                                <p className="text-[10px] text-rose-900/80 dark:text-rose-300/80 font-medium leading-relaxed">
                                                    {isBn ? 'আপনার ভিডিও স্ক্রিপ্টে হুক, মেইন কন্টেন্ট, এবং কল-টু-অ্যাকশন যুক্ত করুন সর্বোচ্চ কনভার্শনের জন্য।' : 'Enhance your video with dynamic B-roll, background music, and on-screen text overlays for maximum engagement.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center min-h-[400px]">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-white/5"><Zap size={32} /></div>
                                    <h4 className="text-base font-black text-slate-400 dark:text-slate-600 tracking-tight">
                                        {isBn ? 'স্টুডিও আউটপুট প্রতীক্ষায়' : 'Studio Outcome Pending'}
                                    </h4>
                                    <p className="text-[11px] text-slate-300 dark:text-slate-700 font-medium mt-2 max-w-[220px]">
                                        {isBn ? 'আপনার ভিডিও স্ক্রিপ্ট এবং কনসেপ্ট জেনারেট করতে একটি প্রম্পট লিখুন।' : 'Describe your video concept to generate a professional script and visual directions.'}
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
