'use client';

import { useTheme } from "@/lib/ThemeContext";
import { CheckCircle2, Clock, Zap } from "lucide-react";

import { PLANS } from "@/lib/constants/plans";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
    const { user, isLoaded } = useUser();
    const { theme, toggleTheme } = useTheme();
    const { language, t } = useLanguage();
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

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Status Card */}
                <div className="bg-brand rounded-[32px] p-8 md:p-12 text-white mb-12 relative overflow-hidden shadow-2xl shadow-brand-shadow dark:shadow-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                {(() => {
                                    const currentPlan = PLANS.find(p => p.id === userPlanId) || PLANS[0];
                                    return (
                                        <>
                                            <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-3">{t.profile.currentStatus}</p>
                                            <h2 className="text-3xl md:text-5xl font-black mb-6">
                                                {currentPlan.label[language]} {language === 'bn' ? 'মেম্বারশিপ' : 'Membership'}
                                            </h2>
                                        </>
                                    );
                                })()}
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-bold">
                                        <Clock size={16} /> {t.profile.activeUntil2031}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/25 backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/20">
                                        <Zap size={16} /> {t.profile.oneLakhAnswers}
                                    </div>
                                </div>
                            </div>
                            <button className="bg-white text-brand px-10 py-5 rounded-[24px] font-black shadow-xl hover:scale-105 transition-all active:scale-95 whitespace-nowrap">
                                {t.profile.renewPlan}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {PLANS.map((p, i) => {
                        const isCurrent = p.id === userPlanId;

                        return (
                            <div key={p.id} className={`p-10 rounded-[44px] bg-white dark:bg-slate-900 border transition-all duration-500 hover:-translate-y-2 relative group flex flex-col ${p.popular
                                ? 'border-brand shadow-2xl shadow-brand-shadow dark:shadow-none ring-4 ring-brand-soft'
                                : 'border-slate-100 dark:border-slate-800 shadow-sm'
                                }`}>
                                {p.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-shadow">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-black mb-4 text-slate-800 dark:text-slate-100">{p.label[language]}</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-black text-slate-900 dark:text-white">{p.price[language]}</span>
                                    <span className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-tighter">{p.period?.[language] || ''}</span>
                                </div>
                                <div className="space-y-4 mb-12 flex-1">
                                    {p.features[language].map((f, fi) => (
                                        <div key={fi} className="flex gap-3 text-[14px] text-slate-600 dark:text-slate-400 font-bold leading-snug">
                                            <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    disabled={isCurrent}
                                    className={`w-full py-5 rounded-[24px] font-black transition-all ${isCurrent
                                        ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-default border border-slate-100 dark:border-slate-700'
                                        : p.popular
                                            ? 'bg-brand text-white hover:bg-brand-hover shadow-xl shadow-brand-shadow dark:shadow-none hover:scale-[1.02]'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
                                        }`}
                                >
                                    {isCurrent ? (language === 'bn' ? 'বর্তমান প্ল্যান' : 'Current Plan') : (language === 'bn' ? 'আপগ্রেড করুন' : 'Upgrade')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
