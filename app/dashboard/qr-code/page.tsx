'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    AlertTriangle,
    Circle,
    Download,
    Globe,
    Link,
    Palette,
    QrCode,
    Share2,
    Type,
    Wand2
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const QR_STYLES = [
    { name: 'Random', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&h=200&fit=crop' },
    { name: 'Suburban', image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=200&h=200&fit=crop' },
    { name: 'Mecha', image: 'https://images.unsplash.com/photo-1612411995874-972cb7801826?w=200&h=200&fit=crop' },
    { name: 'World Map', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=200&h=200&fit=crop' },
    { name: 'Landscape', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=200&fit=crop' },
    { name: 'Mountain', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop' },
    { name: 'Snowy Village', image: 'https://images.unsplash.com/photo-1518715303843-586e350765b2?w=200&h=200&fit=crop' },
    { name: 'Alaska', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop' },
    { name: 'Psygnosis', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&h=200&fit=crop' },
    { name: 'Picasso', image: 'https://images.unsplash.com/photo-1579783902614-a3fb39279c0f?w=200&h=200&fit=crop' },
    { name: 'Clouds', image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=200&h=200&fit=crop' },
    { name: 'Makoto Shinkai', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop' },
    { name: 'Frozen Island', image: 'https://images.unsplash.com/photo-1518182170546-0766ce6fec93?w=200&h=200&fit=crop' },
    { name: 'Waterfall', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=200&h=200&fit=crop' },
    { name: 'Anime Girl', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=200&h=200&fit=crop' },
    { name: 'Sakura', image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200&h=200&fit=crop' },
    { name: 'Tropical Island', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=200&h=200&fit=crop' },
    { name: 'Floating Island', image: 'https://images.unsplash.com/photo-1627230495810-72cb61214040?w=200&h=200&fit=crop' },
    { name: 'Illustration', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&h=200&fit=crop' },
    { name: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' },
    { name: 'Tiger', image: 'https://images.unsplash.com/photo-1505553943142-1c2386c99c33?w=200&h=200&fit=crop' }
];

export default function QRCodePage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [url, setUrl] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('Random');
    const [customPrompt, setCustomPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQR, setGeneratedQR] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const STYLE_PROMPTS: Record<string, string> = {
        'Random': 'highly detailed artistic illustration, vibrant colors, intricate patterns, 8k resolution, masterpiece',
        'Suburban': 'aerial view of suburban neighborhood with houses and green trees, realistic day lighting, highly detailed, 8k',
        'Mecha': 'intricate mecha robot parts, mechanical details, sci-fi, metallic textures, factory setting, 8k, high quality',
        'World Map': 'old vintage world map, parchment texture, detailed continents, antique style, cartography, golden age',
        'Landscape': 'beautiful landscape, mountains, river, sunset, realistic, highly detailed, nature photography',
        'Mountain': 'majestic snowy mountains, clouds, blue sky, realistic nature photography, 8k',
        'Snowy Village': 'cozy snowy village at winter night, warm lights, detailed snow textures, magical atmosphere, christmas vibe',
        'Alaska': 'alaskan wilderness, glaciers, mountains, cold atmosphere, realistic photography, 8k',
        'Psygnosis': 'psychedelic art style, vibrant colors, surreal shapes, abstract patterns, highly detailed',
        'Picasso': 'cubist art style, picasso painting, abstract shapes, artistic, oil painting texture',
        'Clouds': 'fluffy white clouds in blue sky, aerial view, soft lighting, dreamy atmosphere',
        'Makoto Shinkai': 'anime style, makoto shinkai background art, detailed clouds, lens flare, vibrant colors, emotional atmosphere',
        'Frozen Island': 'frozen island in the middle of ocean, icebergs, cold blue tones, realistic photography',
        'Waterfall': 'majestic waterfall in tropical jungle, lush, dynamic water flow, realistic nature',
        'Anime Girl': 'anime style portrait, cute anime girl, detailed eyes, soft lighting, digital art',
        'Sakura': 'cherry blossoms, pink flowers, japanese garden, spring season, soft lighting, romantic atmosphere',
        'Tropical Island': 'tropical island, palm trees, turquoise water, white sand beach, aerial view, sunny day',
        'Floating Island': 'fantasy floating island, magic crystals, waterfalls falling into void, dreamlike',
        'Illustration': 'vector illustration, flat design, clean lines, vibrant colors, modern art',
        'Cat': 'cute cat portrait, fluffy fur, big eyes, realistic photography, studio lighting',
        'Tiger': 'majestic tiger in the jungle, intense gaze, realistic fur texture, wildlife photography'
    };

    const handleGenerate = async () => {
        if (!url) return;
        setIsGenerating(true);
        setError(null);
        setWarning(null);
        setGeneratedQR(null);

        const prompt = customPrompt || STYLE_PROMPTS[selectedStyle] || STYLE_PROMPTS['Random'];

        try {
            const response = await fetch('/api/qr-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, prompt, style: selectedStyle })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to start generation');
            }

            const prediction = await response.json();

            // If the backend returns success immediately (e.g., standard QR code), use it.
            if (prediction.status === 'succeeded' && prediction.output) {
                setGeneratedQR(Array.isArray(prediction.output) ? prediction.output[0] : prediction.output);

                if (prediction.is_fallback) {
                    setWarning(prediction.error_detail || 'Artistic generation failed. Showing standard QR.');
                }

                setIsGenerating(false);
                return; // Exit, no need to poll
            }

            const predictionId = prediction.id;

            // Poll for result (Only if status is not already succeeded)
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/predictions/${predictionId}`);
                    if (!statusRes.ok) {
                        clearInterval(pollInterval);
                        throw new Error('Failed to check status');
                    }

                    const statusData = await statusRes.json();

                    if (statusData.status === 'succeeded') {
                        clearInterval(pollInterval);
                        setGeneratedQR(Array.isArray(statusData.output) ? statusData.output[0] : statusData.output);
                        if (statusData.is_fallback) {
                            setWarning(statusData.error_detail || 'Artistic generation failed. Showing standard QR.');
                        }
                        setIsGenerating(false);
                    } else if (statusData.status === 'failed' || statusData.status === 'canceled') {
                        clearInterval(pollInterval);
                        setError('Generation failed. Please try again.');
                        setIsGenerating(false);
                    }
                } catch (e) {
                    clearInterval(pollInterval);
                    setError('Error checking status');
                    setIsGenerating(false);
                }
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#020005]">
            <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black/20 backdrop-blur-xl z-20 sticky top-0">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-3">
                        <QrCode className="text-purple-500" />
                        {isBn ? 'আর্টিস্টিক কিউআর কোড' : 'Artistic AI QR Code'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest pl-9">
                        {isBn ? 'স্ক্যান করার মত সুন্দর অভিজ্ঞতা' : 'Bring Delightful Scanning Experience'}
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">

                    {/* Left: Configuration */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* URL Input */}
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Link size={20} className="text-purple-500" />
                                {isBn ? 'গন্তব্য ইউআরএল' : 'Destination Content'}
                            </h3>
                            <div className="relative">
                                <Globe className="absolute top-4 left-4 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://openart.ai/@platypus_unsightly_46"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/10 focus:border-purple-500 focus:ring-0 transition-all text-slate-900 dark:text-white font-medium"
                                />
                            </div>
                        </div>

                        {/* Style Selection */}
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Palette size={20} className="text-purple-500" />
                                    {isBn ? 'স্টাইল বেছে নিন' : 'Pick a Style'}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedStyle}</span>
                            </h3>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                {QR_STYLES.map((style) => (
                                    <button
                                        key={style.name}
                                        onClick={() => setSelectedStyle(style.name)}
                                        className={`relative overflow-hidden aspect-square rounded-xl border-2 transition-all group
                                            ${selectedStyle === style.name
                                                ? 'border-purple-500 ring-2 ring-purple-500/20'
                                                : 'border-slate-100 dark:border-white/5 hover:border-purple-300'}`}
                                    >
                                        <img
                                            src={style.image}
                                            alt={style.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-black/40 ${selectedStyle === style.name ? 'opacity-20' : 'opacity-50 group-hover:opacity-30'} transition-opacity`} />

                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                            <span className={`text-[9px] font-bold uppercase tracking-wide truncate block text-center text-white`}>
                                                {style.name}
                                            </span>
                                        </div>

                                        {selectedStyle === style.name && (
                                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                                                <Circle size={8} fill="currentColor" className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                                    <Type size={14} />
                                    {isBn ? 'কাস্টম প্রম্পট (ঐচ্ছিক)' : 'Custom Prompt (Optional)'}
                                </h4>
                                <input
                                    type="text"
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder={isBn ? "যেমন: একটি শান্ত জঙ্গল..." : "e.g. The shadowy figure of a child wandering through a field of stars"}
                                    className="w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500 focus:ring-0 transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!url || isGenerating}
                            className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-lg shadow-xl shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isGenerating ? (
                                <span className="animate-pulse">Designing QR Code...</span>
                            ) : (
                                <>
                                    <Wand2 size={24} strokeWidth={2.5} />
                                    {isBn ? 'কিউআর কোড তৈরি করুন' : 'Generate Artistic QR'}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right: Preview */}
                    <div className="w-full lg:col-span-1">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col items-center sticky top-24">
                            <div className="w-full aspect-square bg-slate-100 dark:bg-black/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 mb-6 flex items-center justify-center relative overflow-hidden group">
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-black/80 backdrop-blur-sm z-10"
                                        >
                                            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                                            <p className="text-xs font-bold text-purple-500 animate-pulse uppercase tracking-widest">Processing...</p>
                                        </motion.div>
                                    ) : (error) ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                            <p className="text-red-500 font-bold mb-2">Error</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
                                        </div>
                                    ) : generatedQR ? (
                                        <>
                                            <motion.img
                                                key="qr"
                                                src={generatedQR}
                                                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                alt="Generated QR"
                                            />
                                            {warning && (
                                                <div className="absolute bottom-2 inset-x-2 bg-yellow-500/90 text-white text-[10px] p-2 rounded-lg backdrop-blur-sm flex items-start gap-2">
                                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                                    <span>{warning}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center p-8 opacity-40"
                                        >
                                            <QrCode size={64} className="mx-auto mb-4 text-slate-400" />
                                            <p className="text-sm font-bold text-slate-400">Preview Area</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {generatedQR && (
                                <div className="w-full grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20">
                                        <Download size={16} /> Download
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/20 transition-all">
                                        <Share2 size={16} /> Share
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
