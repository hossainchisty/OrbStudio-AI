'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useUser } from '@clerk/nextjs';
import { ChevronDown, Download, Loader2, Pause, Play, RefreshCw, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const MODELS = [
    { id: 'speech-2.8-hd', name: 'speech-2.8-hd', tag: 'NEW', quality: 'High Quality' },
    { id: 'speech-2.5', name: 'speech-2.5', quality: 'Standard' },
];

const VOICES = [
    { id: 'calm-woman', name: 'Calm Woman', language: 'Ukrainian', avatar: '🇺🇦', gender: 'Female', category: 'Library', tags: ['Sophisticated', 'Calm'] },
    { id: 'energetic-man', name: 'Energetic Man', language: 'English (US)', avatar: '🇺🇸', gender: 'Male', category: 'Library', tags: ['American', 'Energetic'], recommended: true },
    { id: 'pro-woman', name: 'Pro Woman', language: 'English (UK)', avatar: '🇬🇧', gender: 'Female', category: 'Library', tags: ['British', 'Professional'] },
    { id: 'friendly-man', name: 'Friendly Man', language: 'English (AU)', avatar: '🇦🇺', gender: 'Male', category: 'Library', tags: ['Australian', 'Friendly'], recommended: true },
    { id: 'warm-woman', name: 'Warm Woman', language: 'English (IN)', avatar: '🇮🇳', gender: 'Female', category: 'My Voices', tags: ['Indian', 'Warm'] },
    { id: 'charity-girl', name: 'Charity Girl', language: 'French', avatar: '🇫🇷', gender: 'Female', category: 'Collected', tags: ['European', 'Cute'] },
];

const EMOTIONS = [
    { id: 'neutral', name: 'Neutral', icon: '😐' },
    { id: 'happy', name: 'Happy', icon: '😊' },
    { id: 'sad', name: 'Sad', icon: '😢' },
    { id: 'excited', name: 'Excited', icon: '🤩' },
    { id: 'calm', name: 'Calm', icon: '😌' },
];

const PAUSE_TAGS = [
    { id: 'pause-short', name: '0.5s', tag: '<pause:0.5s>' },
    { id: 'pause-medium', name: '1.0s', tag: '<pause:1s>' },
    { id: 'pause-long', name: '2.0s', tag: '<pause:2s>' },
    { id: 'pause-extra', name: '5.0s', tag: '<pause:5s>' },
];

const SOUND_TAGS = [
    { id: 'emphasis', name: 'Emphasis', tag: '<emphasis>' },
    { id: 'whisper', name: 'Whisper', tag: '<whisper>' },
    { id: 'laughter', name: 'Laughter', tag: '[laughter]' },
    { id: 'sigh', name: 'Sigh', tag: '[sigh]' },
    { id: 'breathing', name: 'Breathing', tag: '[breathing]' },
];

export default function SpeechSynthesisPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const isBn = t.settings.languageName === 'বাংলা';

    const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');
    const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
    const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
    const [selectedEmotion, setSelectedEmotion] = useState('neutral');
    const [text, setText] = useState('');
    const [speed, setSpeed] = useState(1);
    const [pitch, setPitch] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isLongText, setIsLongText] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isPauseDropdownOpen, setIsPauseDropdownOpen] = useState(false);
    const [isSoundTagDropdownOpen, setIsSoundTagDropdownOpen] = useState(false);
    const [isEmotionDropdownOpen, setIsEmotionDropdownOpen] = useState(false);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState<'Library' | 'My Voices' | 'Collected'>('Library');
    const [searchQuery, setSearchQuery] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);

    const characterCount = text.length;
    const maxCharacters = 5000;
    const selectedModelData = MODELS.find(m => m.id === selectedModel);
    const selectedVoiceData = VOICES.find(v => v.id === selectedVoice);

    const handleGenerate = async () => {
        if (!text.trim()) return;

        setIsGenerating(true);
        try {
            const response = await fetch('/api/speech-synthesis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    model: selectedModel,
                    voice: selectedVoice,
                    emotion: selectedEmotion,
                    speed,
                    pitch,
                    volume,
                    isLongText,
                }),
            });

            if (!response.ok) throw new Error('Failed to generate speech');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (error) {
            console.error('Error generating speech:', error);
            alert('Failed to generate speech. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleDownload = () => {
        if (!audioUrl) return;

        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `speech-${Date.now()}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const insertTag = (tag: string) => {
        const textarea = document.querySelector('textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = text.substring(0, start) + tag + text.substring(end);
        setText(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, start + tag.length);
        }, 0);
    };

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-8">
            <div className="max-w-[1250px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Speech Synthesis
                        </h1>

                        <div className="relative">
                            <button
                                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                className="flex items-center gap-3 px-5 py-2.5 bg-slate-900/50 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 cursor-pointer hover:bg-slate-900/70 dark:hover:bg-black/60 transition-all group"
                            >
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-300">Model</span>
                                <div className="h-4 w-px bg-white/10" />
                                <span className="text-sm font-bold text-white">{selectedModel}</span>
                                {selectedModelData?.tag && (
                                    <span className="px-2 py-0.5 bg-white text-black text-[10px] font-black rounded-md">
                                        {selectedModelData.tag}
                                    </span>
                                )}
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isModelDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-2 w-64 bg-slate-900 dark:bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                    >
                                        {MODELS.map((model) => (
                                            <button
                                                key={model.id}
                                                onClick={() => {
                                                    setSelectedModel(model.id);
                                                    setIsModelDropdownOpen(false);
                                                }}
                                                className={`w-full flex flex-col items-start p-3 rounded-xl transition-all ${selectedModel === model.id
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm">{model.name}</span>
                                                    {model.tag && (
                                                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-md ${selectedModel === model.id ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                                                            {model.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] opacity-60 mt-0.5">{model.quality}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Settings</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">History</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-[1fr_360px] gap-6">
                    {/* Left Column - Text Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Text Input Area */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 flex flex-col min-h-[300px]">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Start typing here..."
                                className="flex-1 w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 resize-none outline-none font-medium text-sm leading-relaxed mb-4"
                            />

                            {/* Writing Assistant Controls - Subtle Triggers */}
                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                {/* Emotion Triggers */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setIsEmotionDropdownOpen(!isEmotionDropdownOpen);
                                            setIsPauseDropdownOpen(false);
                                            setIsSoundTagDropdownOpen(false);
                                        }}
                                        className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <span className="text-purple-500">+</span> Emotion
                                        <ChevronDown className={`w-3 h-3 transition-transform ${isEmotionDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isEmotionDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute bottom-full left-0 mb-2 w-44 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                            >
                                                {EMOTIONS.map((emotion) => (
                                                    <button
                                                        key={emotion.id}
                                                        onClick={() => {
                                                            setSelectedEmotion(emotion.id);
                                                            setIsEmotionDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-[10px] font-bold rounded-xl transition-all flex items-center gap-2 ${selectedEmotion === emotion.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                                    >
                                                        <span>{emotion.icon}</span>
                                                        {emotion.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Pause Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setIsPauseDropdownOpen(!isPauseDropdownOpen);
                                            setIsEmotionDropdownOpen(false);
                                            setIsSoundTagDropdownOpen(false);
                                        }}
                                        className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <span className="text-indigo-500">#</span> Pause
                                        <ChevronDown className={`w-3 h-3 transition-transform ${isPauseDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isPauseDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute bottom-full left-0 mb-2 w-32 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                            >
                                                {PAUSE_TAGS.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => {
                                                            insertTag(tag.tag);
                                                            setIsPauseDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                                                    >
                                                        {tag.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Sound Tag Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setIsSoundTagDropdownOpen(!isSoundTagDropdownOpen);
                                            setIsEmotionDropdownOpen(false);
                                            setIsPauseDropdownOpen(false);
                                        }}
                                        className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <span className="text-emerald-500">@</span> Sound Tag
                                        <ChevronDown className={`w-3 h-3 transition-transform ${isSoundTagDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isSoundTagDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute bottom-full left-0 mb-2 w-44 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                            >
                                                {SOUND_TAGS.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => {
                                                            insertTag(tag.tag);
                                                            setIsSoundTagDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                                                    >
                                                        {tag.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Controls Row */}
                        <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 flex items-center gap-2 hover:bg-white/10 transition-all uppercase tracking-widest">
                                    <Volume2 className="w-3.5 h-3.5" />
                                    Detected Language
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/10 transition-all">
                                    <Download className="w-3.5 h-3.5 rotate-180" />
                                </button>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Long Text</span>
                                    <button
                                        onClick={() => setIsLongText(!isLongText)}
                                        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isLongText ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isLongText ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    {characterCount} / {maxCharacters} character
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!text.trim() || isGenerating}
                                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white rounded-xl font-black text-xs shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>✨ Generate</span>}
                                </button>
                            </div>
                        </div>



                        {/* Audio Player */}
                        {audioUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handlePlayPause}
                                        className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                                    >
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                    </button>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Generated Speech</div>
                                        <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 w-0" id="progress-bar" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    onEnded={() => setIsPlaying(false)}
                                    onTimeUpdate={(e) => {
                                        const audio = e.currentTarget;
                                        const progress = (audio.currentTime / audio.duration) * 100;
                                        const progressBar = document.getElementById('progress-bar');
                                        if (progressBar) {
                                            progressBar.style.width = `${progress}%`;
                                        }
                                    }}
                                />
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 space-y-8"
                    >
                        <div className="flex items-center gap-8 border-b border-white/5 pb-0 mb-6">
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Settings
                                {activeTab === 'settings' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                History
                                {activeTab === 'history' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                                )}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'settings' ? (
                                <motion.div
                                    key="settings-tab"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    {/* Voice Selection Card */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Voice</label>
                                            <button className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-white transition-colors">
                                                <RefreshCw className="w-3 h-3" /> Reset Value
                                            </button>
                                        </div>
                                        <div
                                            onClick={() => setIsVoiceModalOpen(true)}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/10 transition-all cursor-pointer active:scale-[0.98]"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
                                                {selectedVoiceData?.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-black text-white">{selectedVoiceData?.name}</div>
                                                <div className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    {selectedVoiceData?.language}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Voice Modifier */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Voice Modifier</label>
                                            <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">👑 Free trials: 6/6</span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-slate-500 -rotate-90" />
                                        </div>
                                        <div className="h-0.5 bg-white/5 rounded-full" />
                                    </div>

                                    {/* Sliders */}
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Speed', value: speed, min: 0.5, max: 2, step: 0.1, setter: setSpeed, defaultValue: 1 },
                                            { label: 'Pitch', value: pitch, min: -10, max: 10, step: 1, setter: setPitch, defaultValue: 0 },
                                            { label: 'Volume', value: volume, min: 0, max: 2, step: 0.1, setter: setVolume, defaultValue: 1 }
                                        ].map((slider) => (
                                            <div key={slider.label}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">{slider.label}</label>
                                                    <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-black text-white">{slider.value}</div>
                                                </div>
                                                <div className="relative h-6 flex items-center">
                                                    <div className="absolute w-full h-1 bg-white/10 rounded-full" />
                                                    <div
                                                        className="absolute h-1 bg-white rounded-full"
                                                        style={{ width: `${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%` }}
                                                    />
                                                    <input
                                                        type="range"
                                                        min={slider.min}
                                                        max={slider.max}
                                                        step={slider.step}
                                                        value={slider.value}
                                                        onChange={(e) => slider.setter(parseFloat(e.target.value))}
                                                        className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="history-tab"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="py-10 text-center bg-white/5 rounded-2xl border border-white/5"
                                >
                                    <div className="text-slate-600 font-bold mb-1 text-xs">No History</div>
                                    <p className="text-[10px] text-slate-500">Your generated audio files will appear here.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Voice Selection Modal */}
                <AnimatePresence>
                    {isVoiceModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsVoiceModalOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-4xl max-h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="p-8 pb-0">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Voice Selection</h2>
                                        <button
                                            onClick={() => setIsVoiceModalOpen(false)}
                                            className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"
                                        >
                                            <ChevronDown className="w-6 h-6 rotate-180" />
                                        </button>
                                    </div>

                                    {/* Modal Tabs */}
                                    <div className="flex items-center gap-8 mb-6 border-b border-white/5">
                                        {['Library', 'My Voices', 'Collected'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setModalTab(tab as any)}
                                                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${modalTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {tab}
                                                {modalTab === tab && (
                                                    <motion.div layoutId="modal-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Search voice name..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-white/20 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                Gender <ChevronDown className="w-3 h-3" />
                                            </button>
                                            <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                Sort By <ChevronDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Library Filter Headers */}
                                    {modalTab === 'Library' && (
                                        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none">
                                            {['All', 'Recommended', 'Narrative', 'Conversational', 'Professional', 'Character'].map((cat) => (
                                                <button
                                                    key={cat}
                                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${cat === 'All' ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Modal Content - Scroll area */}
                                <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {VOICES.filter(v =>
                                            (modalTab === 'Library' ? true : v.category === modalTab) &&
                                            v.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).map((v) => (
                                            <div
                                                key={v.id}
                                                onClick={() => {
                                                    setSelectedVoice(v.id);
                                                    setIsVoiceModalOpen(false);
                                                }}
                                                className={`group p-4 rounded-3xl border transition-all cursor-pointer flex flex-col gap-4 ${selectedVoice === v.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg ring-1 ring-white/20">
                                                        {v.avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{v.name}</div>
                                                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">{v.language}</div>
                                                    </div>
                                                    <button className="p-2.5 bg-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-xl">
                                                        <Play className="w-4 h-4 fill-current" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {v.tags?.map(t => (
                                                        <span key={t} className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-white/10 transition-colors">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
