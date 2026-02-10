'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { Camera, Check, Clipboard, RefreshCcw, Search, Share2, Upload, X, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';

const PROMPT_TEMPLATES = [
    'baby diapers', 'baby product packaging', 'baby swim diapers', 'baby product', 'baby',
    'iridescent bag', 'colorful handbag', 'bath crumble', 'fluffy rug', 'bedroom featuring fluffy',
    'energy drink', 'white wine bottle', 'black bose wireless headphone', 'black hand massage machine',
    'black leather bag', 'black metal bed frame', 'bed frame', 'black telescope', 'shoulder bag',
    'leopard print shoulder bag', 'bloom-flower', 'blue carbon perfume', 'binoculars',
    'bluetooth speaker', 'boyshort underwear', 'brown leather hand watch', 'brown leather handbag',
    'lavender candle', 'candle', 'white candle', 'decorative candle', 'scented candle', 'red SUV',
    'ceramic pot', 'charger', 'car charger', 'charger power bank', 'wood coffee table',
    'computer desktop', 'cute baby slippers', 'diamond ring', 'drone camera', 'elasticized bracelet',
    'electric razor', 'electric bike', 'electric skateboard', 'electric scooter', 'gaming headphones',
    'electric guitar', 'electric hair trimmer', 'electric kettle', 'electric grill', 'epris perfume',
    'family dining table', 'spray tank machine', 'running shoes', 'pink headband', 'fashion outfit',
    'white sneaker', 'fatum perfume bottle', 'flower-potted', 'armchair', 'outdoor dining set',
    'modern chair', 'wooden chair', 'yellow sofa', 'loveseat and armchair', 'eye massager',
    'futuristic eye massager', 'blue gadget', 'smartwatch and smartphone', 'wireless headphones',
    'stylish speaker', 'tablet gadget', 'smartphone', 'gaming remote controller', 'gaming chair',
    'gaming PC setup', 'gaming speaker box', 'gas stove', 'table lamp', 'fragrance bottle',
    'cosmetic bottle', 'navy blue dress', 'gray sofa seat', 'heineken beer', 'silver pendant chain',
    'homeware', 'insulated mug', 'potted plant', 'black curtains', 'green bottle', 'water bottle',
    'iron machine', 'silver hoop earrings', 'beaded bracelet', 'jinotega coffee', 'keyboard',
    'mechanical keyboard', 'gaming keyboard', 'kitchen knife', 'ladies bag', 'ladies blazer',
    'ladies high heels', 'laptop', 'gaming laptop', 'lipstick', 'red lipstick', 'luggage bag',
    'men\'s blazer', 'men\'s leather shoes', 'men\'s coat', 'men\'s sandals', 'electric shaving machine',
    'men\'s hoodie', 'luxury wrist watch', 'men\'s wallet', 'wedding sherwani', 'mini album book',
    'modern bed', 'pink face towel', 'modern living room', 'computer monitor', 'gaming monitor',
    'off-white cap', 'pink cap', 'pant-belt', 'pepsi bottle', 'perfume bottle', 'plussy-cat',
    'pressure cooker', 'rice cooker', 'measuring cup', 'sectional sofa', 'ceiling fan',
    'white sneakers', 'hiking shoes', 'soccer shoes', 'solar camera', 'silver gold hand watch',
    'simple sandals', 'single chair', 'rocking chair', 'coffee table', 'white table',
    'youth serum vitamin', 'skincare oil', 'body oil', 'vitamin c serum', 'bubble cleanser',
    'dark coffee machine', 'office chair', 'smart swing', 'green modular sofa', 'sports watch',
    'black sunglasses', 'teddy bear', 'three-tiered wooden shelf', 'tissue paper box', 'plush toy',
    'tree-shaped light fixture', 'hunting rifle', 'water bottle', 'white athletic shoes',
    'vr remote controller', 'washing machine', 'luxury watch', 'smartwatch', 'scoop neck blouse',
    'wireless mouse', 'modern bedroom', 'wireless ear headphones', 'light therapy mask',
    'wide leg pants', 'pink casual t-shirt', 'women\'s gym shorts', 'white knitwear dress',
    'electric hair care machine', 'vibrant handbag', 'pink luxury bag', 'women\'s leather jacket',
    'off-white canvas bag', 'women\'s blazer', 'women\'s shorts', 'women\'s sandals', 'women\'s dress'
];

export default function ProductPhotographyPage() {
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [modelType, setModelType] = useState<'precise' | 'creative'>('precise');
    const [imageSize, setImageSize] = useState<'2K' | '4K'>('2K');
    const [numImages, setNumImages] = useState<1 | 2 | 4>(1);
    const [prompt, setPrompt] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [inputImages, setInputImages] = useState<{ file: File, preview: string }[]>([]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInputImages(prev => [...prev, { file, preview: reader.result as string }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setInputImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleEnhance = () => {
        const enhanced = `professional product photography, ${prompt}, studio lighting, 4K resolution, commercial quality, sharp focus, premium aesthetic`;
        setPrompt(enhanced);
    };

    const handleTemplateClick = (template: string) => {
        setPrompt(template);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedPrompt(null);

        const instruction = `Product Photography Studio request:
        - Mode: ${modelType} model
        - Target Size: ${imageSize}
        - Number of outputs: ${numImages}
        - User Prompt: ${prompt}
        - Input images: ${inputImages.length} provided
        
        Create a professional product photography AI generation prompt. Include lighting, camera settings, composition. Provide ONLY the prompt text.`;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: instruction,
                    subject: 'product-photography',
                }),
            });

            const data = await response.json();
            setGeneratedPrompt(data.text);
        } catch (err) {
            console.error("Failed to generate product prompt:", err);
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

    const filteredTemplates = PROMPT_TEMPLATES.filter(t =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#020005] overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden dark:block">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-cyan-500/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Header */}
            <header className="px-8 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-black/10 backdrop-blur-3xl z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Camera size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            {isBn ? 'প্রোডাক্ট ফটোগ্রাফি স্টুডিও' : 'Product Photography Studio'}
                        </h2>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 opacity-70">
                            {isBn ? 'কমার্শিয়াল প্রোডাক্ট জেনারেশন' : 'Commercial Product Generation'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setInputImages([]);
                        setPrompt('');
                        setGeneratedPrompt(null);
                    }}
                    className="p-2.5 text-slate-400 hover:text-blue-500 rounded-xl transition-all"
                >
                    <RefreshCcw size={18} />
                </button>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
                {/* Left Side: Inputs */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar border-r border-slate-100 dark:border-white/5">
                    <div className="max-w-xl mx-auto space-y-6">

                        {/* Upload Input Images */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Upload Input Image*</label>
                            <div
                                onClick={() => inputRef.current?.click()}
                                className="group cursor-pointer bg-white dark:bg-black/20 border-2 border-dashed border-slate-100 dark:border-white/5 hover:border-blue-500/40 rounded-2xl p-5 transition-all"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-10 h-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white mb-1">Choose Input Image</span>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">Click to browse, drag & drop, or paste (multiple)</p>
                                </div>
                                <input type="file" ref={inputRef} onChange={handleImageUpload} multiple className="hidden" accept="image/*" />
                            </div>

                            {inputImages.length > 0 && (
                                <div className="flex gap-2 flex-wrap pt-2">
                                    {inputImages.map((img, i) => (
                                        <div key={i} className="relative w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-black group">
                                            <img src={img.preview} className="w-full h-full object-cover" alt="input" />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <X size={14} className="text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Prompt */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prompt *</label>
                            <div className="relative">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe how you want to edit your image..."
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl p-4 pr-20 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[100px] resize-none"
                                />
                                <button
                                    onClick={handleEnhance}
                                    className="absolute top-3 right-3 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    Enhance
                                </button>
                            </div>
                        </div>

                        {/* Model Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Model Selection *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'precise', label: 'Precise Model', sub: 'High accuracy' },
                                    { id: 'creative', label: 'Creative Model', sub: 'Artistic output' }
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setModelType(m.id as any)}
                                        className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left
                                            ${modelType === m.id
                                                ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 shadow-xl scale-[1.02]'
                                                : 'bg-white dark:bg-white/3 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-blue-500/30'}`}
                                    >
                                        <span className="text-xs font-black mb-0.5">{m.label}</span>
                                        <span className={`text-[9px] font-medium opacity-60 ${modelType === m.id ? 'text-white' : ''}`}>{m.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Size */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Image Size *</label>
                            <div className="flex gap-3">
                                {(['2K', '4K'] as const).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setImageSize(size)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border
                                            ${imageSize === size
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                                                : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-white/5 hover:border-blue-500/30'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Number of Images */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Number of Images *</label>
                            <div className="flex gap-3">
                                {([1, 2, 4] as const).map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setNumImages(num)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border
                                            ${numImages === num
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                                                : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-white/5 hover:border-blue-500/30'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Prompt Templates */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prompt Templates</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search any templates..."
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>

                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-black/10 border border-slate-100 dark:border-white/5 rounded-2xl p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    {filteredTemplates.slice(0, 20).map((template, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleTemplateClick(template)}
                                            className="text-left px-3 py-2 text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-white/5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20"
                                        >
                                            {template}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || inputImages.length === 0 || !prompt}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95
                                ${isGenerating || inputImages.length === 0 || !prompt
                                    ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02]'}`}
                        >
                            {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <><Zap size={18} fill="currentColor" /> Generate Image</>}
                        </button>
                    </div>
                </div>

                {/* Right Side: Result */}
                <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-black/30 backdrop-blur-sm">
                    <div className="max-w-xl mx-auto h-full flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">Studio Outcome</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Your professional product assets will appear here.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center min-h-[400px]">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                        <Camera size={48} className="relative z-10 text-blue-500 animate-bounce" />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Crafting Product Vision...</h4>
                                    <p className="text-[11px] text-slate-400 font-medium max-w-[200px]">Our AI is processing your product for commercial-grade results.</p>
                                </motion.div>
                            ) : generatedPrompt ? (
                                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 blur-xl opacity-10 group-hover:opacity-30 transition-opacity rounded-[32px]" />
                                        <div className="relative bg-white dark:bg-black/40 backdrop-blur-3xl border border-slate-100 dark:border-white/10 rounded-[28px] p-6 shadow-2xl">
                                            <div className="prose dark:prose-invert max-w-none text-sm md:text-base font-medium leading-relaxed italic text-slate-700 dark:text-slate-200">
                                                "{generatedPrompt}"
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex flex-wrap gap-3">
                                                <button onClick={handleCopy} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all active:scale-95 ${copySuccess ? 'bg-emerald-500 text-white shadow-lg' : 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 shadow-md'}`}>
                                                    {copySuccess ? <Check size={16} strokeWidth={3} /> : <Clipboard size={16} strokeWidth={2.5} />}
                                                    {copySuccess ? 'Copied!' : 'Copy Prompt'}
                                                </button>
                                                <button className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-all"><Share2 size={20} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center min-h-[400px]">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-white/5"><Zap size={32} /></div>
                                    <h4 className="text-base font-black text-slate-400 dark:text-slate-600 tracking-tight">Studio Outcome Pending</h4>
                                    <p className="text-[11px] text-slate-300 dark:text-slate-700 font-medium mt-2 max-w-[220px]">Upload your product images and configure settings to generate pro assets.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
