'use client';

import { TOOLS } from '@/lib/constants';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { Message, ToolType } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import DOMPurify from 'dompurify';
import {
    Camera,
    Image as ImageIcon,
    Loader2,
    Send,
    Sparkles,
    Upload,
    User,
    X
} from 'lucide-react';
import { marked } from 'marked';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const IconMap: Record<string, React.FC<any>> = {
    Camera: Camera,
    Image: ImageIcon,
};

interface ChatInterfaceProps {
    toolId: ToolType;
}

export default function ChatInterface({ toolId }: ChatInterfaceProps) {
    const { user } = useUser();
    const { t } = useLanguage();
    const { theme: appTheme } = useTheme();

    const tool = TOOLS.find(t => t.id === toolId);
    const isBn = t.settings.languageName === 'বাংলা';

    const searchParams = useSearchParams();
    const router = useRouter();
    const conversation_id = searchParams.get('id');

    const [messages, setMessages] = useState<Message[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(conversation_id);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Image Upload State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (conversation_id) {
            fetchMessages(conversation_id);
        } else {
            setMessages([]);
            setActiveConversationId(null);
        }
    }, [conversation_id]);

    const fetchMessages = async (id: string) => {
        setIsLoadingMessages(true);
        try {
            const res = await fetch(`/api/chats/${id}/messages`);
            const data = await res.json();
            if (data.messages) {
                const formattedMessages: Message[] = data.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    text: m.content,
                    image: m.image,
                    timestamp: new Date(m.created_at).getTime(),
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() && !selectedImage) return;

        const textToSend = chatInput.trim();
        setChatInput('');
        setIsTyping(true);
        setError(null);

        // Optimistic Update
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSend,
            image: imagePreview || undefined,
            timestamp: Date.now(),
            subject: toolId
        };
        setMessages(prev => [...prev, userMsg]);

        try {
            // Create FormData for potential multi-part if needed, 
            // but current API expects JSON. For now, simulate sending text + context.
            // In a real app, you'd upload to Supabase and send the URL or base64.

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    subject: toolId,
                    conversation_id: activeConversationId,
                    image: imagePreview
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: data.text,
                timestamp: Date.now(),
                subject: toolId
            };
            setMessages(prev => [...prev, assistantMsg]);

            if (data.conversation_id && !activeConversationId) {
                setActiveConversationId(data.conversation_id);
                // Also update URL without reload to reflect new conversation
                router.replace(`/dashboard/${toolId}?id=${data.conversation_id}`);
            }

            // Clear image after successful send
            removeImage();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsTyping(false);
        }
    };

    const renderMarkdown = (text: string) => {
        const rawHtml = text ? (marked.parse(text) as string) : '';
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        return { __html: cleanHtml };
    };

    const toolColorClass = tool?.color === 'blue' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' :
        tool?.color === 'purple' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' :
            tool?.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
                'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20';

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#020005] relative overflow-hidden">
            {/* Ambient Glows for Chat */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden dark:block">
                <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] -right-[5%] w-[30%] h-[50%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>
            {/* Tool Header */}
            <header className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between relative z-10 bg-white/50 dark:bg-black/20 backdrop-blur-xl">
                <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-[24px] ${toolColorClass} border border-current opacity-90 shadow-inner`}>
                        <ImageIcon size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{tool?.name}</h2>
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1.5 opacity-80">AI-Powered Production Studio</p>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-10 custom-scrollbar relative z-10">
                {isLoadingMessages ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-brand animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            {isBn ? 'মেসেজ লোড হচ্ছে...' : 'Restoring conversation...'}
                        </p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <div className={`w-20 h-20 rounded-[32px] ${toolColorClass} flex items-center justify-center mb-8 animate-bounce`}>
                            <Sparkles size={40} className="fill-current" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                            {isBn ? `আসুন শুরু করি!` : `Let's start creating!`}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {isBn
                                ? `${tool?.name} টুলের মাধ্যমে আপনার আইডিয়া বর্ণনা করুন অথবা একটি ছবি আপলোড করুন বিশ্লেষণ করতে।`
                                : `Describe your vision for ${tool?.name} or upload an image to analyze and generate results.`}
                        </p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-brand text-white shadow-lg'}`}>
                                    {msg.role === 'user' ? <User size={20} /> : <ImageIcon size={20} />}
                                </div>
                                <div className={`p-5 md:p-6 rounded-[32px] ${msg.role === 'user' ? 'bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-tr-none border border-transparent dark:border-white/5' : 'bg-white dark:bg-white/5 backdrop-blur-md border border-slate-100 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm rounded-tl-none'}`}>
                                    {msg.image && (
                                        <div className="mb-4 overflow-hidden rounded-2xl border dark:border-white/10 shadow-xl">
                                            <img src={msg.image} alt="Uploaded" className="max-h-64 rounded-xl object-contain" />
                                        </div>
                                    )}
                                    {msg.text && <div className="prose dark:prose-invert max-w-none text-md font-medium leading-relaxed" dangerouslySetInnerHTML={renderMarkdown(msg.text)} />}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-lg">
                                <ImageIcon size={20} />
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] rounded-tl-none">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-10 bg-white dark:bg-black/40 backdrop-blur-3xl border-t border-slate-100 dark:border-white/5 relative z-10">
                <div className="max-w-5xl mx-auto space-y-6">
                    {imagePreview && (
                        <div className="relative inline-block animate-in zoom-in-95 duration-200">
                            <img src={imagePreview} className="h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl object-cover" alt="Preview" />
                            <button
                                onClick={removeImage}
                                className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 active:scale-90 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="relative group">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder={isBn ? 'আপনার আইডিয়া লিখুন...' : 'Type your vision here...'}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-[32px] py-6 pl-8 pr-32 min-h-[80px] text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none overflow-hidden"
                            rows={1}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-slate-400 hover:text-brand-hover dark:hover:text-brand hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
                            >
                                <Upload size={20} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!chatInput.trim() && !selectedImage || isTyping}
                                className={`p-4 rounded-2xl shadow-xl transition-all active:scale-95 ${chatInput.trim() || selectedImage ? 'bg-brand text-white hover:bg-brand-hover' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                            >
                                <Send size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60">
                        {isBn ? 'OrbStudio ভুল করতে পারে। সঠিক তথ্য যাচাই করে নিন।' : 'OrbStudio may produce inaccuracies. Always verify important information.'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold shadow-2xl border border-red-100 animate-in slide-in-from-bottom-2 duration-300">
                    {error}
                </div>
            )}
        </div>
    );
}
