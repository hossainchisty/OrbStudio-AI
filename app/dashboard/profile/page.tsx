'use client';
import { PLANS } from "@/lib/constants/plans";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/lib/ThemeContext";
import { useClerk, useUser } from "@clerk/nextjs";
import { Bell, Camera, ChevronLeft, Eye, Globe, Lock, Mail, Moon, Settings, Shield, ShieldCheck, Sun, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');
    const [userPlanId, setUserPlanId] = useState<string>('free');

    useEffect(() => {
        const fetchUserPlan = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('subscription_tier')
                    .eq('clerk_id', user.id)
                    .single();

                if (data && data.subscription_tier) {
                    // Normalize to lowercase to match our PLANS id
                    setUserPlanId(data.subscription_tier.toLowerCase());
                }
            } catch (e) {
                console.error("Error fetching user plan:", e);
            }
        };

        if (isLoaded && user) {
            fetchUserPlan();
        }
    }, [user, isLoaded]);

    if (!isLoaded) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/80 dark:bg-black/20 backdrop-blur-3xl border border-slate-100 dark:border-white/5 rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group transition-colors duration-500">
                            <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                                {/* Avatar Section */}
                                <div className="relative group/avatar shrink-0">
                                    <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-4 ring-slate-50 dark:ring-black/40 shadow-2xl transition-transform group-hover/avatar:scale-[1.02]">
                                        <img
                                            src={user?.imageUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-brand text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all ring-4 ring-white dark:ring-slate-900">
                                        <Camera size={18} />
                                    </button>
                                </div>

                                {/* Form Section */}
                                <div className="flex-1 w-full space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.profile.personalInfo}</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">{t.profile.personalInfoDesc}</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2 text-left">
                                            <div className="flex items-center h-6 px-1">
                                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.profile.fullName}</label>
                                            </div>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                                                <input
                                                    type="text"
                                                    defaultValue={user?.fullName || ''}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <div className="flex items-center justify-between h-6 px-1">
                                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.profile.emailAddress}</label>
                                                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">{t.common.verified}</div>
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                                                <input
                                                    type="email"
                                                    defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <button className="bg-brand text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-shadow dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            {t.common.update}
                                        </button>
                                        <button className="px-8 py-4 rounded-2xl font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                            {t.common.cancel}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Status Card */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/80 dark:bg-black/20 backdrop-blur-3xl border border-slate-100 dark:border-white/5 rounded-[32px] p-6 md:p-8 flex items-center gap-4 md:gap-6 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-0.5 tracking-tight uppercase text-xs">{t.profile.securityStatus}</h4>
                                    <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">{t.profile.accountSafe}</p>
                                </div>
                            </div>
                            <div className="bg-white/80 dark:bg-black/20 backdrop-blur-3xl border border-slate-100 dark:border-white/5 rounded-[32px] p-6 md:p-8 flex items-center gap-4 md:gap-6 shadow-sm">
                                <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-lg shadow-brand-shadow dark:shadow-none">
                                    <Camera size={18} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-0.5 tracking-tight uppercase text-xs">{t.profile.planDetails}</h4>
                                    <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">
                                        {userPlanId === 'free' ? (language === 'bn' ? 'ফ্রি প্ল্যান' : 'Free Plan') :
                                            userPlanId === 'pro' ? (language === 'bn' ? 'প্রো মেম্বার' : 'Pro Member') :
                                                (language === 'bn' ? 'অর্ব প্লাস' : 'Orb Plus')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="bg-white/80 dark:bg-black/20 backdrop-blur-3xl border border-slate-100 dark:border-white/5 rounded-[32px] p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.profile.securitySettings}</h2>
                            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">{t.profile.securitySettingsDesc}</p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-brand"><Lock size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{t.profile.changePassword}</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.profile.lastChanged}: {t.profile.lastChanged2Months}</p>
                                    </div>
                                </div>
                                <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">{t.common.update}</button>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><ShieldCheck size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{t.profile.twoFactor}</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.profile.twoFactorDesc}</p>
                                    </div>
                                </div>
                                <div className="w-12 h-6 bg-brand rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="bg-white/80 dark:bg-black/20 backdrop-blur-3xl border border-slate-100 dark:border-white/5 rounded-[32px] p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.profile.notificationSettings}</h2>
                            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">{t.profile.notificationSettingsDesc}</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: t.profile.emailNotifications, desc: t.profile.emailNotificationsDesc, active: true },
                                { title: t.profile.pushNotifications, desc: t.profile.pushNotificationsDesc, active: true },
                                { title: t.profile.weeklyReport, desc: t.profile.weeklyReportDesc, active: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${item.active ? 'bg-brand' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'subscription':
                const currentPlan = PLANS.find(p => p.id === userPlanId) || PLANS[0];

                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Card */}
                        <div className="bg-brand rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-brand-shadow dark:shadow-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <p className="text-rose-100 font-bold uppercase tracking-widest text-[10px] mb-2">{t.profile.currentStatus}</p>
                                        <h2 className="text-3xl font-black mb-4">
                                            {currentPlan.label[language]} {language === 'bn' ? 'মেম্বারশিপ' : 'Membership'}
                                        </h2>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                                                <ShieldCheck size={14} /> {t.profile.activeUntil2031}
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                                                <Zap size={14} /> {t.profile.oneLakhAnswers}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-white text-brand px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-sm">
                                        {t.profile.renewPlan}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {PLANS.map((p) => {
                                const isCurrent = p.id === userPlanId;

                                return (
                                    <div key={p.id} className={`p-8 rounded-[38px] bg-white/80 dark:bg-black/20 backdrop-blur-3xl border transition-all duration-500 hover:-translate-y-1 relative flex flex-col ${p.popular
                                        ? 'border-brand shadow-xl shadow-brand-shadow dark:shadow-none ring-2 ring-brand-soft'
                                        : 'border-slate-100 dark:border-slate-800 shadow-sm'
                                        }`}>
                                        <h3 className="text-base font-black mb-3 text-slate-800 dark:text-slate-100">{p.label[language]}</h3>
                                        <div className="flex items-baseline gap-1 mb-6">
                                            <span className="text-3xl font-black text-slate-900 dark:text-white">{p.price[language]}</span>
                                            <span className="text-slate-400 dark:text-slate-500 font-bold text-xs">{p.period?.[language] || ''}</span>
                                        </div>
                                        <div className="space-y-3 mb-8 flex-1">
                                            {p.features[language].map((f, fi) => (
                                                <div key={fi} className="flex gap-2 text-[12px] text-slate-600 dark:text-slate-400 font-bold leading-tight">
                                                    <ShieldCheck size={14} className="text-brand shrink-0 mt-0.5" />
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            disabled={isCurrent}
                                            className={`w-full py-4 rounded-2xl text-xs font-black transition-all ${isCurrent
                                                ? 'bg-slate-50 dark:bg-black/20 text-slate-400 dark:text-slate-600 cursor-default border border-slate-100 dark:border-white/5'
                                                : p.popular
                                                    ? 'bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand-shadow dark:shadow-none'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {isCurrent ? (language === 'bn' ? 'বর্তমান প্ল্যান' : 'Current Plan') : (language === 'bn' ? 'আপগ্রেড করুন' : 'Upgrade')}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'preferences':
                interface SettingItem {
                    id: string;
                    name: any;
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
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {SETTINGS_GROUPS.map((group, gIdx) => (
                            <div key={gIdx}>
                                <h3 className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">{group.title}</h3>
                                <div className="bg-white/80 dark:bg-black/20 backdrop-blur-3xl border border-slate-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm">
                                    {group.items.map((item, iIdx) => (
                                        <div
                                            key={item.id}
                                            onClick={() => item.onClick?.()}
                                            className={`p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${iIdx !== group.items.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-brand-soft group-hover:text-brand transition-all">
                                                    <item.icon size={22} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">{item.name}</h4>
                                                    <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">{item.description}</p>
                                                </div>
                                            </div>

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
                );
            default:
                return null;
        }
    };


    return (
        <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                {/* Custom Sidebar Navigation */}
                <aside className="space-y-2">
                    {[
                        { id: 'profile', label: t.profile.profileInfo, icon: User },
                        { id: 'subscription', label: t.common.subscription, icon: Zap },
                        { id: 'security', label: t.settings.security, icon: Lock },
                        { id: 'notifications', label: t.settings.notifications, icon: Bell },
                        { id: 'preferences', label: t.settings.preferences, icon: Settings },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id
                                ? 'bg-brand text-white shadow-xl shadow-brand-shadow dark:shadow-none'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-black/20 hover:text-brand hover:shadow-sm'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Tab Content Area */}
                <div className="min-h-[600px]">
                    {renderTabContent()}
                </div>
            </div>
        </main >
    );
}
