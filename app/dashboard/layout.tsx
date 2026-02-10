'use client';

import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import React, { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-transparent overflow-hidden transition-colors duration-500">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 lg:hidden flex items-center px-6 border-b border-slate-100 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-3xl">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 text-lg font-black text-slate-900 dark:text-white">Orb<span className="text-brand">Studio</span></span>
                </header>

                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
