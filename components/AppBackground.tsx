'use client';

import { useTheme } from '@/lib/ThemeContext';

export default function AppBackground() {
    const { theme } = useTheme();

    return (
        <div
            className="fixed inset-0 z-[-1] transition-all duration-1000 pointer-events-none"
            style={{
                background: theme === 'dark'
                    ? "radial-gradient(125% 125% at 50% 10%, #020005 40%, #4c0519 100%)"
                    : "radial-gradient(125% 125% at 50% 0%, #ffffff 50%, #f1f5f9 100%)",
            }}
        />
    );
}
