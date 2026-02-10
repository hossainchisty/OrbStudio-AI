'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { ToolType } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import {
    Camera,
    Check,
    Clipboard,
    RefreshCcw,
    Share2,
    Upload,
    User,
    X,
    Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';

export default function FashionPhotographyPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    // Core States
    const [modelType, setModelType] = useState<'precise' | 'creative'>('precise');
    const [imageSize, setImageSize] = useState<'2K' | '4K'>('2K');
    const [prompt, setPrompt] = useState('');

    // Upload States
    const [modelImage, setModelImage] = useState<{ file: File, preview: string } | null>(null);
    const [garmentImages, setGarmentImages] = useState<{ file: File, preview: string }[]>([]);
    const [backgroundImage, setBackgroundImage] = useState<{ file: File, preview: string } | null>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Refs
    const modelInputRef = useRef<HTMLInputElement>(null);
    const garmentInputRef = useRef<HTMLInputElement>(null);
    const bgInputRef = useRef<HTMLInputElement>(null);

    const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setModelImage({ file, preview: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGarmentImages(prev => [...prev, { file, preview: reader.result as string }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBackgroundImage({ file, preview: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedPrompt(null);

        // Build logic for prompt generation based on these complex inputs
        const instruction = `Fashion Studio generation request:
        - Mode: ${modelType} model selection
        - Target Size: ${imageSize}
        - User Prompt: ${prompt || 'Standard high-fashion pose'}
        - Inputs: Model image provided, ${garmentImages.length} garment images provided, ${backgroundImage ? 'Custom background provided' : 'AI generated background'}.
        
        Create a professional AI generation prompt for a virtual try-on and commercial fashion shoot. Provide ONLY the prompt text.`;

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
            setGeneratedPrompt(data.text);
        } catch (err) {
            console.error("Failed to generate fashion prompt:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!generatedPrompt) return;
        navigator.clipboard.writeText(generatedPrompt);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const UploadZone = ({ title, subtitle, desc, onUpload, inputRef, multiple = false, currentFiles = [] }: any) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {title}
                </label>
                {currentFiles.length > 0 && (
                    <button onClick={() => multiple ? setGarmentImages([]) : title.includes('Model') ? setModelImage(null) : setBackgroundImage(null)} className="text-[10px] text-red-500 font-bold hover:underline">Clear</button>
                )}
            </div>

            <div
                onClick={() => inputRef.current?.click()}
                className="group relative cursor-pointer bg-white dark:bg-black/20 border-2 border-dashed border-slate-100 dark:border-white/5 hover:border-purple-500/40 rounded-2xl p-5 transition-all"
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white mb-1">{subtitle}</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">{desc}</p>
                </div>
                <input type="file" ref={inputRef} onChange={onUpload} multiple={multiple} className="hidden" accept="image/*" />
            </div>

            {/* Previews */}
            {currentFiles.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-2">
                    {currentFiles.map((f: any, i: number) => (
                        <div key={i} className="relative w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-black">
                            <img src={f.preview} className="w-full h-full object-cover" alt="preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                <X size={10} className="text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#020005] overflow-hidden relative">
            {/* Header */}
            <header className="px-8 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-black/10 backdrop-blur-3xl z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            {isBn ? 'ফ্যাশন ফটোগ্রাফি স্টুডিও' : 'Fashion Photography Studio'}
                        </h2>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 opacity-70">
                            {isBn ? 'হাই-এন্ড ফ্যাশন জেনারেশন' : 'High-End Aesthetic Engineering'}
                        </p>
                    </div>
                </div>
                <button className="p-2.5 text-slate-400 hover:text-purple-500 rounded-xl transition-all">
                    <RefreshCcw size={18} />
                </button>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
                {/* Left Side: Inputs */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar border-r border-slate-100 dark:border-white/5">
                    <div className="max-w-xl mx-auto space-y-6">

                        {/* 1. Model Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-500">Model Selection *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'precise', label: 'Precise Model', sub: 'High accuracy' },
                                    { id: 'creative', label: 'Creative Model', sub: 'Varied poses' }
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setModelType(m.id as any)}
                                        className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left group
                                            ${modelType === m.id
                                                ? 'bg-purple-600 dark:bg-purple-500 text-white border-purple-600 shadow-xl shadow-purple-500/20 scale-[1.02]'
                                                : 'bg-white dark:bg-white/3 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-purple-500/30'}`}
                                    >
                                        <span className="text-xs font-black mb-0.5">{m.label}</span>
                                        <span className={`text-[9px] font-medium opacity-60 ${modelType === m.id ? 'text-white' : ''}`}>{m.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Upload Model */}
                        <UploadZone
                            title="Upload Model"
                            subtitle="Upload Model Image*"
                            desc="Click to browse, drag & drop, or paste"
                            onUpload={handleModelUpload}
                            inputRef={modelInputRef}
                            currentFiles={modelImage ? [modelImage] : []}
                        />

                        {/* 3. Upload Garments */}
                        <UploadZone
                            title="Upload Garments Image*"
                            subtitle="Choose Garments Image"
                            desc="Click to browse, drag & drop, or paste (multiple)"
                            onUpload={handleGarmentUpload}
                            inputRef={garmentInputRef}
                            multiple={true}
                            currentFiles={garmentImages}
                        />

                        {/* 4. Upload Background */}
                        <UploadZone
                            title="Upload Background Img (Optional)"
                            subtitle="Choose Background Image"
                            desc="Click to browse, drag & drop, or paste"
                            onUpload={handleBgUpload}
                            inputRef={bgInputRef}
                            currentFiles={backgroundImage ? [backgroundImage] : []}
                        />

                        {/* 5. Prompt */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prompt (Optional)</label>
                            <div className="relative">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your desired style, pose, vibe, or setting..."
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 outline-none min-h-[100px] resize-none"
                                />
                                <div className="absolute bottom-3 right-3 text-[9px] text-slate-400 font-bold uppercase tracking-widest">Optional</div>
                            </div>
                        </div>

                        {/* 6. Image Size */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Image Size *</label>
                            <div className="flex gap-3">
                                {['2K', '4K'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setImageSize(size as any)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border
                                            ${imageSize === size
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                                                : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-white/5 hover:border-purple-500/30'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !modelImage || garmentImages.length === 0}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95
                                ${isGenerating || !modelImage || garmentImages.length === 0
                                    ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed border border-white/5'
                                    : 'bg-purple-600 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] shadow-purple-500/20'}`}
                        >
                            {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <><Zap size={18} fill="currentColor" /> {isBn ? 'ভিশন তৈরি করুন' : 'Generate Vision'}</>}
                        </button>
                    </div>
                </div>

                {/* Right Side: Result */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-black/30 backdrop-blur-sm">
                    <div className="max-w-xl mx-auto h-full flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">Studio Outcome</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Your professional production assets will appear here.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center min-h-[400px]">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                        <Camera size={48} className="relative z-10 text-purple-500 animate-bounce" />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Calculating Aesthetics...</h4>
                                    <p className="text-[11px] text-slate-400 font-medium max-w-[200px]">Our AI is processing your model and garments for a high-end result.</p>
                                </motion.div>
                            ) : generatedPrompt ? (
                                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-brand/50 blur-xl opacity-10 group-hover:opacity-30 transition-opacity rounded-[32px]" />
                                        <div className="relative bg-white dark:bg-black/40 backdrop-blur-3xl border border-slate-100 dark:border-white/10 rounded-[28px] p-6 shadow-2xl">
                                            <div className="prose dark:prose-invert max-w-none text-sm md:text-base font-medium leading-relaxed italic text-slate-700 dark:text-slate-200">
                                                "{generatedPrompt}"
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex flex-wrap gap-3">
                                                <button onClick={handleCopy} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all active:scale-95 ${copySuccess ? 'bg-emerald-500 text-white shadow-lg' : 'bg-purple-600 dark:bg-white text-white dark:text-slate-900 shadow-md'}`}>
                                                    {copySuccess ? <Check size={16} strokeWidth={3} /> : <Clipboard size={16} strokeWidth={2.5} />}
                                                    {copySuccess ? 'Copied!' : 'Copy Prompt'}
                                                </button>
                                                <button className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-purple-500 transition-all"><Share2 size={20} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center min-h-[400px]">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-white/5"><Zap size={32} /></div>
                                    <h4 className="text-base font-black text-slate-400 dark:text-slate-600 tracking-tight">Studio Outcome Pending</h4>
                                    <p className="text-[11px] text-slate-300 dark:text-slate-700 font-medium mt-2 max-w-[220px]">Upload your model and garments to generate a professional fashion vision.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
