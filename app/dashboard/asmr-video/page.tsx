'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import {
    Maximize2,
    Monitor,
    Play,
    Smartphone,
    Sparkles,
    Video,
    Volume2,
    VolumeX
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const TEMPLATES = [
    {
        id: 'crystal-pineapple',
        title: "Crystal Pineapple Cutting",
        category: "Public",
        isPublic: true,
        prompt: "Extreme macro shot of sharp steel knife slicing translucent golden crystal pineapple with emerald crystal leaves on dark surface. Camera: Side angle macro lens, shallow depth focusing on blade-crystal contact, capturing honeycomb pattern light refraction. Lighting: Dramatic side lighting creating golden amber glow through crystal body, bright green leaf reflections, blade gleaming, dark background contrast highlighting crystal transparency. Audio: Binaural recording of blade penetrating crystal surface with sharp crack, internal honeycomb chambers shattering sequentially, delicate crystal fragments chiming, blade scraping surface, resonant crystal vibrations. Motion: Controlled cutting stroke revealing glowing amber interior with geometric honeycomb structure, crystal fragments separating with prismatic light effects, leaves swaying. Visual style: Luxury crystal macro with tropical fruit aesthetics, emphasizing golden transparency and geometric internal patterns.",
        videoUrl: "/template_1751616404895.mp4"
    },
    {
        id: 'eating-glass',
        title: "Eating Glass Fruits",
        category: "Public",
        isPublic: true,
        prompt: "Static front-facing close-up shot: A young woman’s face is framed tightly from the nose down. Her lips are painted in a deep, glossy red, glistening under soft cinematic lighting. She slowly raises a translucent, glass-like emerald to her mouth. The crystal gem shimmers with inner green fire and sharp, faceted texture. As her teeth sink in, the glass emerald fractures with a clean break. ASMR: sharp crystalline crack, fine shards separating, slow crunching, followed by damp, delicate chewing and a faint breathy exhale. Her lips press and part with measured slowness, catching glimmers of reflected light as she chews. Visual tone: sharp, intimate, hyperreal.",
        videoUrl: "/Emerald%20Crunch-Hypnotic-ASMR.mp4"
    },
    {
        id: 'strawberry-glass',
        title: "Eating Glass Fruits (Strawberry)",
        category: "Public",
        isPublic: true,
        prompt: "Static front-facing close-up shot: A young woman’s face is framed tightly from the nose down. Her lips are painted in a deep, glossy red, shining softly under cinematic lighting. She slowly lifts a translucent, glass-like red strawberry to her mouth. The crystal fruit glimmers with inner light and sharp texture. As she gently bites into it, the glass strawberry cracks cleanly. ASMR: high-pitched crack, subtle shards separating, soft chewing sounds, and breathy exhale. Her lips press slowly as she chews, catching reflections. Background is softly blurred, silent except for the sounds of the fruit. Visual tone: sharp, intimate, hyperreal. No dialogue. No subtitles",
        videoUrl: "/Eating%20Glass%20Fruits.mp4"
    },
    {
        id: 'lime-cutting',
        title: "Lime Cutting ASMR",
        category: "Public",
        isPublic: true,
        prompt: "Extreme macro shot of black ceramic knife slicing fresh green lime on wooden cutting board. Camera: 45-degree overhead angle, shallow depth focusing on blade-lime contact. Lighting: Warm kitchen light from upper left, highlighting lime's textured peel and juice droplets on wood grain. Audio: Binaural recording of blade penetrating peel with subtle pop, juice squirting and dripping, pulp crackling, seeds rattling, blade scraping wood, citrus oil sizzling. Motion: Slow cutting strokes every 4-5 seconds, controlled downward pressure, lime segments opening revealing translucent pulp, juice pooling and dripping, oil mist spray. Visual style: Professional food macro with warm golden tones, emphasizing texture contrast between bumpy green peel and juicy interior, pristine kitchen aesthetic.",
        videoUrl: "/Lime%20Cutting.mp4"
    },
    {
        id: 'rainy-window',
        title: "Rainy Window ASMR",
        category: "Public",
        isPublic: true,
        prompt: "Ultra-high definition overhead shot of pristine raindrops cascading down a large residential window during a gentle afternoon shower. Camera: Static macro composition at 30cm distance, shallow depth of field isolating individual droplets against blurred interior. Lighting: Soft overcast daylight creating delicate refractions through each water bead, subtle window frame shadows dancing across glass. Audio: High-fidelity binaural recording capturing rhythmic raindrop percussion on glass, subtle echo resonance, distant thunder rumble, cozy interior ambiance. Motion: Natural gravity-driven droplet trails merging and separating in organic patterns. Visual style: Hyper-realistic macro cinematography emphasizing water physics, light refraction, and meditative repetition. Duration: 90-120 seconds of continuous gentle rainfall.",
        videoUrl: "/Rain.mp4"
    },
    {
        id: 'glass-watermelon',
        title: "Glass Watermelon Shattered",
        category: "Public",
        isPublic: true,
        prompt: "Extreme macro shot of a sharp chef's knife slicing through a crystalline glass watermelon wedge. The watermelon has a translucent green glass rind and a clear pink glass interior filled with high-viscosity red syrup and small black glass seeds. As the blade presses down, the glass 'gives way' with realistic micro-fractures, and the red liquid oozes out in slow motion. Professional studio lighting, 8k resolution, hyper-realistic glass textures, focusing on the satisfying friction between the metal blade and the glass surface. Watch in extreme slow motion as the glass shell develops micro-cracks before shattering like crystal. The thick orange liquid inside should have a honey-like viscosity, oozing out slowly and mixing with shimmering glass shards. High-end ray tracing, realistic light refraction through the glass and liquid, 8k resolution, cinematic studio lighting on a dark reflective surface. Visuals should imply high-fidelity ASMR sounds: the sharp 'tink' of metal on glass, the crisp 'crunch' of shattering crystal, and the thick, satisfying 'glug' and 'splat' of the viscous liquid hitting the surface. No background music, pure tactile sound focus.",
        videoUrl: "/Glass%20Watermelon%20Shattered%20in%20Extreme%20Slow%20Motion.mp4"
    },
    {
        id: 'rainbow-bottles',
        title: "Rainbow Bottles Cascade",
        category: "Public",
        isPublic: true,
        prompt: "Ultra-realistic ASMR video. Static low-angle shot from the bottom of a staircase, as if someone is waiting below and looking upward. The camera remains fixed, very close to the steps above. At the top edge of the frame, a single human foot briefly appears and slowly pushes glass bottles forward one by one. Six glass bottles, each filled with liquid in different vivid colors (red, blue, green, yellow, purple, orange), begin to slide, tip over, and fall down the stairs. As the bottles tumble downward, they collide with the steps and finally smash near the camera, bursting open. ASMR audio is extremely detailed: glass rolling, hollow impacts on wood or concrete steps, sharp glass cracking, liquid splashing, flowing, dripping, and spreading. The liquids mix and spread organically across the steps, creating splashes, droplets, reflections, and slow drips toward the camera. Lighting is natural and cinematic, highlighting glass shards, liquid motion, and reflections. No talking, no music — only footsteps, gravity, glass breaking, and liquid ASMR sounds. Highly realistic physics, macro detail, satisfying and immersive.",
        videoUrl: "/Rainbow%20Bottles%20Cascade%20ASMR%20Glass%20&%20Liquid%20Fall.mp4"
    },
    { id: 'planet-earth', title: "ASMR Cutting Planet Earth", category: "Micro", prompt: "Slicing through a miniature earth cake, geological layers revealed.", videoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format" },
    { id: 'glass-fruits', title: "Cutting Glass Fruits", category: "Satisfying", prompt: "Crystal clear glass apples shattering into musical shards.", videoUrl: "https://images.unsplash.com/photo-1576085898323-21811973cbd7?q=80&w=1200&auto=format" },
    { id: 'clouds', title: "Cutting Clouds", category: "Atmosphere", prompt: "A knife slicing through fluffy, glowing clouds, releasing mist.", videoUrl: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1200&auto=format" },
    { id: 'ice-cutting', title: "Ice Cutting ASMR", category: "Satisfying", prompt: "Sharp chisel carving into deep blue glacier ice, fine snow spray.", videoUrl: "https://images.unsplash.com/photo-1517210122415-b0c70b2a09bf?q=80&w=1200&auto=format" },
    { id: 'paper-garden', title: "Paper Garden Unfolds", category: "Paper", prompt: "Intricate origami garden blooming in fast motion on wood table.", videoUrl: "https://images.unsplash.com/photo-1520111007886-f2992v8a29ed?q=80&w=1200&auto=format" },
    { id: 'paper-ocean', title: "Paper Ocean", category: "Paper", prompt: "Layered paper waves rolling, paper boat bobbing.", videoUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1200&auto=format" },
    { id: 'underwater', title: "Underwater World", category: "Atmosphere", prompt: "Deep sea bio-luminescence, bubbles rising in slow motion.", videoUrl: "https://images.unsplash.com/photo-1544924734-7db3d931904e?q=80&w=1200&auto=format" },
    { id: 'milky-way-boat', title: "Paper boat in the Milky Way", category: "Atmosphere", prompt: "A small paper boat sailing through a galaxy of stars.", videoUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format" },
    { id: 'frost-brush', title: "The frost brush condenses the polar ecology on the canvas.", category: "Art", prompt: "Ice crystal brushstrokes blooming into polar landscapes.", videoUrl: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1200&auto=format" },
    { id: 'fluorescent-brushes', title: "Fluorescent brushes, illuminating fantastic lives in the night.", category: "Art", prompt: "Neon paint strokes coming to life on dark canvas.", videoUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format" },
    { id: 'lava-brush', title: "Lava Brush, create a microscopic volcanic world.", category: "Art", prompt: "Glowing magma brushstrokes forming tiny volcanoes.", videoUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format" },
    { id: 'glass-tapping', title: "Glass Tapping", category: "Tapping", prompt: "Long nails gently tapping on thin crystal flute.", videoUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=1200&auto=format" },
    { id: 'marshmallow-keyboard', title: "ASMR Marshmallow Keyboard", category: "Tech", prompt: "Keys made of soft pink marshmallows being pressed.", videoUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200&auto=format" },
    { id: 'wood-tapping', title: "Wood Tapping", category: "Tapping", prompt: "Fingertips drumming on ancient mahogany chest.", videoUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format" },
    { id: 'octopus-rise', title: "Drawing Awakens: The Octopus Rises", category: "Art", prompt: "Ink sketch of an octopus peeling off paper into 3D space.", videoUrl: "https://images.unsplash.com/photo-1545486332-9e0999c535b2?q=80&w=1200&auto=format" },
    { id: 'cave-drip', title: "Echoing Cave Drip ASMR", category: "Ambience", prompt: "Single drop hitting still pool in dark cavern.", videoUrl: "https://images.unsplash.com/photo-1502657877623-f66bf489d236?q=80&w=1200&auto=format" },
    { id: 'rain-umbrella', title: "Rain on Umbrella", category: "Ambience", prompt: "Heavy raindrops bouncing off a black silk umbrella.", videoUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200&auto=format" },
    { id: 'rain-window', title: "Rain on Window", category: "Ambience", prompt: "Water droplets racing down a foggy window at night.", videoUrl: "https://images.unsplash.com/photo-1428592953211-077101b2021b?q=80&w=1200&auto=format" },
    { id: 'forest-rain', title: "Forest Rain", category: "Ambience", prompt: "Rain filtering through dense jungle canopy.", videoUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format" },
    { id: 'nail-care', title: "Nail Care", category: "Sensory", prompt: "Soft filing and polishing of elegant nails.", videoUrl: "https://images.unsplash.com/photo-1604654894610-df490c01fe50?q=80&w=1200&auto=format" },
    { id: 'asmr-capybara', title: "ASMR Capybara", category: "Nature", prompt: "Capybara munching on crunchy vegetables in sun.", videoUrl: "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=80&w=1200&auto=format" },
    { id: 'white-noise', title: "White Noise", category: "Ambience", prompt: "Soft static grain and celestial humming.", videoUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format" },
];

export default function ASMRVideoPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [selectedId, setSelectedId] = useState(TEMPLATES[0].id);
    const [qualityMode, setQualityMode] = useState<'Fast' | 'High'>('Fast');
    const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('16:9');
    const [isGenerating, setIsGenerating] = useState(false);

    // Video States
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    const activeTemplate = TEMPLATES.find(e => e.id === selectedId) || TEMPLATES[0];

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => setIsPlaying(false));
        }
    }, [selectedId]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 5000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-[#020005]">
            <header className="px-5 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black/20 backdrop-blur-xl z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                        <Video size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            ASMR Video Creation
                        </h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Sensory Intelligence Studio
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6">

                    {/* Left Column: Preview Area */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/5 rounded-[24px] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-black/10">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-emerald-500" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Preview Area</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Effect Preview</span>
                                </div>
                            </div>

                            <div
                                className="relative aspect-video bg-black flex items-center justify-center overflow-hidden cursor-pointer group shadow-2xl"
                                onClick={togglePlay}
                            >
                                {activeTemplate.videoUrl.endsWith('.mp4') ? (
                                    <video
                                        ref={videoRef}
                                        key={activeTemplate.videoUrl}
                                        src={activeTemplate.videoUrl}
                                        autoPlay
                                        loop
                                        muted={isMuted}
                                        playsInline
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40 scale-[1.02] blur-[2px]'}`}
                                    />
                                ) : (
                                    <motion.img
                                        key={activeTemplate.videoUrl}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.7 }}
                                        src={activeTemplate.videoUrl}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: isPlaying ? 0.8 : 1,
                                            opacity: isPlaying ? 0 : 1,
                                            y: isPlaying ? 20 : 0
                                        }}
                                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                        className="mb-6"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                                            <Play fill="currentColor" size={40} className="ml-2" />
                                        </div>
                                    </motion.div>
                                    <div className={`transition-all duration-700 delay-100 ${isPlaying ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Sensory Preview</p>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl">{activeTemplate.title}</h3>
                                        <div className="flex items-center justify-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-widest">
                                            <div className="w-8 h-[1px] bg-white/10" />
                                            Click to Play ASMR
                                            <div className="w-8 h-[1px] bg-white/10" />
                                        </div>
                                    </div>
                                </div>

                                {/* Controls Overlay */}
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    <button
                                        onClick={toggleMute}
                                        className="p-2.5 rounded-xl bg-black/40 backdrop-blur-lg border border-white/10 text-white hover:bg-emerald-500 transition-all"
                                    >
                                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                    </button>
                                    <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-lg border border-white/10 text-white hover:bg-emerald-500 transition-all">
                                        <Maximize2 size={16} />
                                    </button>
                                </div>

                                {/* Status Overlays */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Instant Preview</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                                            <Video size={10} className="text-emerald-500" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">High Quality</span>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                        Ready to Generate
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 bg-slate-50 dark:bg-black/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Prompt Strategy</span>
                                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                        {activeTemplate.category}
                                    </span>
                                </div>
                                <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic font-medium">
                                        "{activeTemplate.prompt}"
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase">Real-time</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sync</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase">Visual/Audio</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivery</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase">One-click</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Status Message */}
                        <div className="p-6 rounded-[24px] border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center space-y-4 group hover:border-emerald-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                <Monitor size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Waiting for Generation</h4>
                                <p className="text-xs text-slate-500 max-w-sm font-medium">
                                    Configure your video parameters, click 'Start Generation' and the video creation process will be displayed here in real time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Generation Controls */}
                    <div className="space-y-5">
                        <div className="bg-white dark:bg-[#0a0a0c] rounded-[24px] border border-slate-200 dark:border-white/10 p-5 shadow-xl space-y-6">
                            {/* Quality & Aspect */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Mode</label>
                                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
                                        {['Fast', 'High'].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setQualityMode(mode as any)}
                                                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${qualityMode === mode ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
                                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
                                        {['16:9', '9:16'].map((ratio) => (
                                            <button
                                                key={ratio}
                                                onClick={() => setAspectRatio(ratio as any)}
                                                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${aspectRatio === ratio ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                                            >
                                                {ratio}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Image Uploads */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Images (Optional)</label>
                                    <span className="text-[9px] font-bold text-slate-500">First/Last Frame</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5 hover:border-emerald-500/50 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center p-4 cursor-pointer transition-all group overflow-hidden">
                                        <Smartphone size={16} className="text-slate-300 mb-2 group-hover:text-emerald-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">First Frame</span>
                                        <span className="text-[8px] text-slate-300 mt-1">Click to upload</span>
                                    </div>
                                    <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5 hover:border-emerald-500/50 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center p-4 cursor-pointer transition-all group">
                                        <Monitor size={16} className="text-slate-300 mb-2 group-hover:text-emerald-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Last Frame</span>
                                        <span className="text-[8px] text-slate-300 mt-1">Click to upload</span>
                                    </div>
                                </div>
                                <p className="text-[8px] text-slate-400 text-center leading-relaxed">
                                    Upload custom images for video start/end frames. Supports JPG, PNG (max 10MB each)
                                </p>
                            </div>

                            {/* Template Selection */}
                            <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ASMR Template</label>
                                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                                    {TEMPLATES.map((tpl) => (
                                        <button
                                            key={tpl.id}
                                            onClick={() => setSelectedId(tpl.id)}
                                            className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedId === tpl.id ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-200 dark:border-white/5 hover:border-emerald-500/30'}`}
                                        >
                                            {tpl.videoUrl.endsWith('.mp4') ? (
                                                <video
                                                    src={tpl.videoUrl}
                                                    muted
                                                    loop
                                                    autoPlay
                                                    playsInline
                                                    className={`w-full h-full object-cover transition-opacity ${selectedId === tpl.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}`}
                                                />
                                            ) : (
                                                <img
                                                    src={tpl.videoUrl}
                                                    className={`w-full h-full object-cover transition-opacity ${selectedId === tpl.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}`}
                                                    alt={tpl.title}
                                                />
                                            )}
                                            <div className={`absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent transition-transform ${selectedId === tpl.id ? 'translate-y-0' : 'translate-y-1 group-hover:translate-y-0'}`}>
                                                <p className="text-[8px] font-black text-white uppercase tracking-tighter truncate">{tpl.title}</p>
                                            </div>
                                            {tpl.isPublic && (
                                                <div className="absolute top-1.5 left-1.5 px-1 py-0.5 rounded-md bg-emerald-500/90 text-white text-[6px] uppercase font-black tracking-widest border border-white/20">
                                                    Public
                                                </div>
                                            )}
                                            {selectedId === tpl.id && (
                                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                                                    <Sparkles size={8} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Video Description */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Description</label>
                                    <button className="text-[9px] font-black text-emerald-500 underline uppercase tracking-widest">Clear</button>
                                </div>
                                <textarea
                                    value={activeTemplate.prompt}
                                    readOnly
                                    className="w-full h-32 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-[11px] text-slate-600 dark:text-slate-300 font-medium tracking-tight custom-scrollbar focus:ring-1 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
                                    placeholder="Enter your detailed visual/audio description here..."
                                />
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Public Video</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">977 / 20000</span>
                                </div>
                            </div>

                            {/* Final Action */}
                            <div className="pt-4 space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits required</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">80</span>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full relative group"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                    <div className="relative w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-500/20 flex flex-col items-center justify-center leading-none transition-all active:scale-[0.98]">
                                        <span>Create</span>
                                        <span className="text-[10px] opacity-70 mt-1 uppercase tracking-[0.2em] font-bold">50% OFF</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}


