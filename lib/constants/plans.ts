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
            bn: ['প্রতিদিন ৫টি ক্রিয়েশন', 'বেসিক গাইডলাইন', 'সব টুল এক্সেস', 'মোবাইল সাপোর্ট'],
            en: ['5 creations per day', 'Basic guidance', 'Access to all tools', 'Mobile support']
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        label: {
            bn: 'প্রো',
            en: 'Pro'
        },
        price: {
            bn: '৳২৯৯',
            en: '৳299'
        },
        period: {
            bn: '/মাস',
            en: '/mo'
        },
        popular: true,
        features: {
            bn: ['প্রতিদিন ৫০টি ক্রিয়েশন', 'বিস্তারিত টেকনিক্যাল গাইড', 'ফটো অ্যানালাইসিস', '১০০% বিজ্ঞাপন মুক্ত', 'প্রায়োরিটি সাপোর্ট'],
            en: ['50 creations per day', 'Detailed technical guides', 'Photo analysis', '100% ad-free experience', 'Priority support']
        }
    },
    {
        id: 'orb_plus',
        name: 'Orb Plus',
        label: {
            bn: 'অর্ব প্লাস',
            en: 'Orb Plus'
        },
        price: {
            bn: '৳৭৯৯',
            en: '৳799'
        },
        period: {
            bn: '/বছর',
            en: '/yr'
        },
        features: {
            bn: ['আনলিমিটেড ক্রিয়েশন', 'এআই ভিডিও টিউটোরিয়াল', 'অফলাইন এক্সেস', 'প্রিমিয়াম রেডি-টু-ইউজ প্রম্পটস'],
            en: ['Unlimited creations', 'AI video tutorials', 'Offline access', 'Premium ready-to-use prompts']
        }
    }
];
