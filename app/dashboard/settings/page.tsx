'use client';

import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { Bell, ChevronLeft, Eye, Globe, Moon, Shield, Sun } from "lucide-react";

interface SettingItem {
    id: string;
    name: string;
    icon: any;
    description: string;
    active?: boolean;
    value?: string;
    onClick?: () => void;
}

interface SettingGroup {
    title: string;
    items: SettingItem[];
}

export default function SettingsPage() {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const SETTINGS_GROUPS: SettingGroup[] = [
        {
            title: t.settings.preferences,
            items: [
                {
                    id: 'darkMode',
                    name: t.settings.darkMode,
                    icon: theme === 'dark' ? Sun : Moon,
                    description: theme === 'dark' ? t.profile.lightThemeDesc : t.profile.darkThemeDesc,
                    active: theme === 'dark',
                    onClick: toggleTheme
                },
                {
                    id: 'language',
                    name: t.settings.language,
                    icon: Globe,
                    description: t.profile.languageSettingDesc,
                    value: t.settings.languageName,
                    onClick: () => setLanguage(language === 'bn' ? 'en' : 'bn')
                },
            ]
        },
        {
            title: t.settings.security,
            items: [
                { id: 'notifications', name: t.settings.notifications, icon: Bell, description: t.profile.notificationsDesc, active: true },
                { id: 'privacy', name: t.settings.privacy, icon: Eye, description: t.profile.privacyDesc },
                { id: 'security', name: t.settings.security, icon: Shield, description: t.profile.securityDesc },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">

            <div className="max-w-4xl mx-auto px-6">
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {SETTINGS_GROUPS.map((group, gIdx) => (
                        <div key={gIdx}>
                            <h3 className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">{group.title}</h3>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
                                {group.items.map((item, iIdx) => (
                                    <div
                                        key={item.id}
                                        onClick={() => item.onClick?.()}
                                        className={`p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${iIdx !== group.items.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white shadow-lg">
                                                <item.icon size={22} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">{item.name}</h4>
                                                <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">{item.description}</p>
                                            </div>
                                        </div>

                                        {/* Input UI Elements */}
                                        <div className="flex items-center">
                                            {item.active !== undefined ? (
                                                <div className={`w-11 h-6 rounded-full transition-all relative ${item.active ? 'bg-brand' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'left-6' : 'left-1'}`}></div>
                                                </div>
                                            ) : null}

                                            {item.value ? (
                                                <span className="text-sm font-bold text-brand bg-brand-soft px-3 py-1 rounded-lg">{item.value}</span>
                                            ) : null}

                                            {item.active === undefined && !item.value ? (
                                                <ChevronLeft size={16} className="text-slate-300 dark:text-slate-600 rotate-180" />
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
