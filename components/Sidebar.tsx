'use client';

import { TOOLS } from '@/lib/constants';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import {
    Camera,
    Image as ImageIcon,
    LayoutDashboard,
    Maximize,
    Moon,
    Music,
    Play,
    QrCode,
    Shirt,
    Sparkles,
    Speech,
    Sticker,
    Sun,
    User,
    X,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const IconMap: Record<string, React.FC<any>> = {
    Camera: Camera,
    User: User,
    Image: ImageIcon,
    Play: Play,
    Sparkles: Sparkles,
    Maximize: Maximize,
    Sticker: Sticker,
    QrCode: QrCode,
    Speech: Speech,
    Music: Music,
    Shirt: Shirt,
    Zap: Zap,
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user } = useUser();
    const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    const navItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { id: 'creations', name: 'My Creations', icon: Sparkles, href: '/dashboard/creations' },
        ...TOOLS.map(tool => ({
            id: tool.id,
            name: tool.name,
            icon: IconMap[tool.icon] || Camera,
            href: `/dashboard/${tool.id}`,
            color: tool.color
        }))
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 w-72 bg-white/80 dark:bg-black/20 backdrop-blur-3xl border-r border-slate-100 dark:border-white/5 z-50 lg:static lg:translate-x-0 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white shadow-lg">
                            <Camera size={18} />
                        </div>
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Orb<span className="text-brand">Studio</span></span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-8 custom-scrollbar">
                    {/* Main Nav */}
                    <div>
                        <h3 className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.2em]">Navigation</h3>
                        <div className="space-y-0.5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => onClose()}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs transition-all group ${isActive
                                            ? 'bg-brand text-white shadow-lg shadow-brand-shadow dark:shadow-none'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={16} className={isActive ? 'text-white' : ''} />
                                            {item.name}
                                        </div>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-brand transition-all">
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                    <SignedIn>
                        <Link
                            href="/dashboard/profile"
                            onClick={() => onClose()}
                            className="block px-2 group cursor-pointer"
                        >
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-brand transition-colors">{user?.fullName}</p>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate group-hover:text-brand/70 transition-colors">{user?.primaryEmailAddress?.emailAddress}</p>
                        </Link>
                    </SignedIn>
                </div>
            </aside>
        </>
    );
}
