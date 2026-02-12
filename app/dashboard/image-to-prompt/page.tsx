'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { ToolType } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import {
    Check,
    Clipboard,
    Image as ImageIcon,
    RefreshCcw,
    Share2,
    Sparkles,
    Upload,
    X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';

function ImageToPromptContent() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';
    const router = useRouter();
    const searchParams = useSearchParams();
    const conversationIdFromUrl = searchParams.get('id');

    // States
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(conversationIdFromUrl);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch existing prompt if conversation ID exists
    useEffect(() => {
        if (conversationIdFromUrl) {
            fetchExistingPrompt(conversationIdFromUrl);
        }
    }, [conversationIdFromUrl]);

    const fetchExistingPrompt = async (id: string) => {
        try {
            const res = await fetch(`/api/chats/${id}/messages`);
            const data = await res.json();
            if (data.messages && data.messages.length > 0) {
                // Find the first assistant message and the first user message with image
                const userMsg = data.messages.find((m: any) => m.role === 'user' && m.image);
                const assistantMsg = data.messages.find((m: any) => m.role === 'assistant');

                if (userMsg?.image) setImagePreview(userMsg.image);
                if (assistantMsg?.content) setGeneratedPrompt(assistantMsg.content);
            }
        } catch (err) {
            console.error("Error fetching existing prompt:", err);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setGeneratedPrompt(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setGeneratedPrompt(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleGeneratePrompt = async () => {
        if (!imagePreview) return;

        setIsAnalyzing(true);
        setError(null);
        setGeneratedPrompt(null);

        const instruction = `Analyze this image with extreme precision to create a high-fidelity, professional AI generation prompt. 
The goal is to recreate this image exactly. 
Include intricate details regarding:
- Subject matter, textures, and anatomical/structural accuracy.
- Artistic style, technical medium, and specific rendering techniques (e.g., Unreal Engine 5, Ray Traced, Cinematic Bokeh).
- Precise lighting conditions, color palette, grading, and atmospheric mood.
- Compositional elements, camera lens specifications (e.g., 85mm f/1.8), and framing.
- TEXTUAL CONTENT: If there is any text present, particularly Bangla (Bengali) script, incorporate it exactly as it appears, specifying the typography, calligraphy style, and placement to ensure the script is rendered correctly.

OUTPUT CONSTRAINT: Provide ONLY the final prompt text. No introductory remarks, no labels, and no explanations.`;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: instruction,
                    subject: 'image-to-prompt' as ToolType,
                    conversation_id: conversationId,
                    image: imagePreview
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setGeneratedPrompt(data.text);

            if (data.conversation_id && !conversationId) {
                setConversationId(data.conversation_id);
                router.replace(`/dashboard/image-to-prompt?id=${data.conversation_id}`);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to analyze image');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCopy = () => {
        if (!generatedPrompt) return;
        navigator.clipboard.writeText(generatedPrompt);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#020005] overflow-hidden relative">
            {/* Ambient Background Glows - Premium Dark Mode */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden dark:block">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-brand/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Header */}
            <header className="px-8 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-black/10 backdrop-blur-3xl z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-inner">
                        <ImageIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                            {isBn ? 'ইমেজ টু প্রম্পট' : 'Image to Prompt Studio'}
                        </h2>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 opacity-70">
                            {isBn ? 'ভিজ্যুয়াল আনালিসিস স্টুডিও' : 'Visual Analysis & Engineering'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setConversationId(null);
                            removeImage();
                            router.push('/dashboard/image-to-prompt');
                        }}
                        className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-500/20"
                        title="New Analysis"
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
                {/* Left Side: Upload */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar border-r border-slate-100 dark:border-white/5 bg-transparent">
                    <div className="max-w-xl mx-auto h-full flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                {isBn ? 'সংকেত আপলোড করুন' : 'Upload Your Reference'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {isBn
                                    ? 'একটি ছবি আপলোড করুন যা থেকে আপনি উচ্চমানের প্রম্পট তৈরি করতে চান।'
                                    : 'Upload an image to extract high-fidelity AI prompts and professional visual descriptors.'}
                            </p>
                        </div>

                        <div
                            className={`flex-1 min-h-[300px] rounded-[32px] border-2 border-dashed transition-all relative overflow-hidden group shadow-2xl shadow-emerald-500/5
                                ${imagePreview
                                    ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-500/5'
                                    : 'border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:bg-emerald-50/5 dark:hover:bg-white/5'}`}
                        >
                            {!imagePreview ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-125 group-hover:scale-150 transition-transform duration-500" />
                                        <div className="relative w-14 h-14 bg-white dark:bg-white/5 backdrop-blur-xl border border-emerald-500/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                            <Upload size={28} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">
                                        {isBn ? 'ড্রপ করুন অথবা ব্রাউজ করুন' : 'Drop Image Here'}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-6">
                                        JPG, PNG up to 10MB
                                    </p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-emerald-600 dark:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest"
                                    >
                                        {isBn ? 'ফাইল সিলেক্ট করুন' : 'Select Files'}
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col">
                                    <div className="relative flex-1 p-4 flex items-center justify-center bg-white/5 dark:bg-black/20 min-h-[250px]">
                                        <img
                                            src={imagePreview}
                                            className="max-w-full max-h-[280px] rounded-2xl object-contain shadow-2xl border-2 border-white dark:border-white/10"
                                            alt="Preview"
                                        />
                                        <button
                                            onClick={removeImage}
                                            className="absolute top-4 right-4 bg-black/60 backdrop-blur-2xl text-white p-2 rounded-xl hover:bg-red-500 transition-all border border-white/20 shadow-2xl"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {!generatedPrompt && !isAnalyzing && (
                                        <div className="p-4 bg-white/50 dark:bg-white/5 backdrop-blur-md border-t border-emerald-500/10">
                                            <button
                                                onClick={handleGeneratePrompt}
                                                className="w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white py-3.5 rounded-xl font-black text-base shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-3 transition-all active:scale-95 group"
                                            >
                                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                                {isBn ? 'প্রম্পট তৈরি করুন' : 'Generate Prompt'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Output */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-black/30 backdrop-blur-sm">
                    <div className="max-w-xl mx-auto">
                        <div className="mb-6">
                            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                {isBn ? 'এআই প্রম্পট আউটপুট' : 'AI Prompt Intelligence'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {isBn
                                    ? 'আপনার ছবির ভিত্তিতে তৈরি করা উন্নত প্রম্পট।'
                                    : 'Visual attributes converted into a professional engineering prompt.'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/80 dark:bg-white/5 backdrop-blur-3xl rounded-[48px] p-12 text-center border border-slate-100 dark:border-white/10 shadow-2xl min-h-[450px] flex flex-col items-center justify-center"
                                >
                                    <div className="relative mb-10">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                                        <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin relative z-10" />
                                        <Sparkles className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={40} />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                                        {isBn ? 'ছবি বিশ্লেষণ করা হচ্ছে...' : 'Analyzing Visuals...'}
                                    </h4>
                                    <p className="text-slate-400 dark:text-slate-500 font-medium max-w-[280px] leading-relaxed">
                                        {isBn ? 'আমাদের এআই আপনার ছবির প্রতিটা বিশেষত্ব খুঁজছে।' : 'Our AI is dissecting every detail of your image to craft the perfect prompt.'}
                                    </p>
                                </motion.div>
                            ) : generatedPrompt ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-brand/50 blur-xl opacity-10 group-hover:opacity-30 transition-opacity rounded-[32px]" />
                                        <div className="relative bg-white dark:bg-black/40 backdrop-blur-3xl border border-slate-100 dark:border-white/10 rounded-[28px] p-6 shadow-2xl">
                                            <div className="prose dark:prose-invert max-w-none text-sm md:text-base font-medium leading-relaxed italic text-slate-700 dark:text-slate-200">
                                                "{generatedPrompt}"
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex flex-wrap gap-3">
                                                <button
                                                    onClick={handleCopy}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all active:scale-95
                                                        ${copySuccess
                                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 shadow-md'}`}
                                                >
                                                    {copySuccess ? <Check size={16} strokeWidth={3} /> : <Clipboard size={16} strokeWidth={2.5} />}
                                                    {copySuccess ? (isBn ? 'কপি সফল' : 'Copied!') : (isBn ? 'প্রম্পট কপি করুন' : 'Copy Prompt')}
                                                </button>

                                                <button className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-500 transition-all active:scale-95">
                                                    <Share2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex gap-4 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                            <Sparkles size={16} />
                                        </div>
                                        <div className="relative z-10">
                                            <h5 className="font-black text-emerald-900 dark:text-emerald-300 mb-0.5 uppercase tracking-widest text-[9px]">AI Insight</h5>
                                            <p className="text-[10px] text-emerald-800/80 dark:text-emerald-400/80 font-medium leading-tight">
                                                {isBn
                                                    ? 'এই প্রম্পটটি আমাদের টুলে ব্যবহার করে দেখুন নতুন ভেরিয়েন্ট তৈরির জন্য।'
                                                    : 'Try this prompt in our Photography tool for stunning variations.'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[48px] p-12 text-center border border-dashed border-slate-200 dark:border-white/10 min-h-[450px] flex flex-col items-center justify-center">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-8 text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-white/5">
                                        <Sparkles size={40} />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-400 dark:text-slate-600 tracking-tight">
                                        {isBn ? 'ফলাফল এখানে প্রদর্শিত হবে' : 'Result will appear here'}
                                    </h4>
                                    <p className="text-slate-300 dark:text-slate-700 font-medium mt-3 max-w-[200px] mx-auto leading-relaxed">
                                        {isBn ? 'ছবি বিশ্লেষণ করার পর প্রম্পট পাবেন।' : 'The intelligence engine is waiting for your input.'}
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-5 rounded-2xl border border-red-100 dark:border-red-500/20 text-sm font-bold flex items-center gap-3"
                            >
                                <X className="shrink-0" size={18} />
                                {error}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ImageToPromptPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center bg-white dark:bg-[#020005]">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>}>
            <ImageToPromptContent />
        </Suspense>
    );
}
