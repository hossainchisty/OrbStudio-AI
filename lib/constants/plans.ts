export interface Plan {
    id: string;
    name: string;
    label: {
        bn: string;
        en: string;
    };
    price: {
        bn: string;
        en: string;
    };
    period?: {
        bn: string;
        en: string;
    };
    features: {
        bn: string[];
        en: string[];
    };
    popular?: boolean;
}

export const PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        label: {
            bn: 'ফ্রি',
            en: 'Free'
        },
        price: {
            bn: '৳০',
            en: '৳0'
        },
        features: {
            bn: [
                'প্রতিদিন ৫টি জেনারেশন ক্রেডিট',
                'বেসিক রেজোলিউশন আউটপুট',
                'ওয়াটারমার্ক সহ ইমেজ',
                'ব্যক্তিগত ব্যবহারের জন্য'
            ],
            en: [
                '5 Daily Generation Credits',
                'Standard Resolution Output',
                'Watermarked Assets',
                'Personal Use Only'
            ]
        }
    },
    {
        id: 'pro',
        name: 'Creator Pro',
        label: {
            bn: 'ক্রিয়েটর প্রো',
            en: 'Creator Pro'
        },
        price: {
            bn: '৳৪৯৯',
            en: '৳499'
        },
        period: {
            bn: '/মাস',
            en: '/mo'
        },
        popular: true,
        features: {
            bn: [
                '২০০ মাসিক + ১০টি বোনাস ডেইলি ক্রেডিট',
                'ওয়াটারমার্ক মুক্ত হাই-রেজোলিউশন',
                'ফুল কমার্শিয়াল লাইসেন্স',
                'প্রায়োরিটি এআই জেনারেশন',
                '২৪/৭ কাস্টমার সাপোর্ট'
            ],
            en: [
                '200 Monthly + 10 Daily Credits',
                'Watermark-Free HD Exports',
                'Full Commercial License',
                'Priority AI Computation',
                '24/7 Priority Support'
            ]
        }
    },
    {
        id: 'studio_business',
        name: 'Studio Business',
        label: {
            bn: 'স্টুডিও বিজনেস',
            en: 'Studio Business'
        },
        price: {
            bn: '৳১৪৯৯',
            en: '৳1499'
        },
        period: {
            bn: '/মাস',
            en: '/mo'
        },
        features: {
            bn: [
                '১৫০০ প্রিমিয়াম ক্রেডিট/মাস',
                'বাল্ক ইমেজ এবং ভিডিও ক্রিয়েশন',
                '৪কে (4K) জেনারেশন সাপোর্ট',
                'এক ক্লিকে মাল্টি-ফরম্যাট অ্যাড এক্সপোর্ট',
                'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার'
            ],
            en: [
                '1,500 Premium Credits /mo',
                'Bulk Image & Video Processing',
                'Ultra-HD 4K AI Generation',
                'One-Click Multi-Format Ads',
                'Dedicated Account Manager'
            ]
        }
    }
];
