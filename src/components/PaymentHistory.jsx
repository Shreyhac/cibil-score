import React, { useEffect, useState } from 'react';

export default function PaymentHistory({ pct, total }) {
    const [offset, setOffset] = useState(100);

    useEffect(() => {
        // 100% means stroke-dashoffset is 0. 0% means stroke-dashoffset is 100.
        const timer = setTimeout(() => {
            setOffset(100 - pct);
        }, 100);
        return () => clearTimeout(timer);
    }, [pct]);

    let barColor = 'var(--color-score-excellent)';
    if (pct < 95) barColor = 'var(--color-score-good)';
    if (pct < 85) barColor = 'var(--color-score-poor)';

    return (
        <div className="apple-card h-full flex flex-col items-center justify-center text-center relative px-6">
            <h3 className="text-lg font-semibold tracking-tight absolute top-6 left-6">Payment History</h3>

            <div className="relative w-32 h-32 flex items-center justify-center mt-8">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                    <circle
                        className="text-[var(--border-color)]"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="18"
                        cy="18"
                    />
                    <circle
                        style={{ color: barColor, transition: 'stroke-dashoffset 1.5s ease-out' }}
                        className="drop-shadow-sm"
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="18"
                        cy="18"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold tracking-tighter" style={{ color: barColor }}>{pct}%</span>
                </div>
            </div>

            <p className="mt-4 text-sm font-medium">On-Time Payments</p>
            {total && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">{total} Total Payments Tracked</p>
            )}
        </div>
    );
}
