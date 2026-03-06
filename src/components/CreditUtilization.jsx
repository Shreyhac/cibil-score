import React, { useEffect, useState } from 'react';
import { THRESHOLDS } from '../constants/thresholds';

export default function CreditUtilization({ accounts }) {
    const [fillWidth, setFillWidth] = useState(0);

    const creditCards = accounts.filter(a => a.type.toLowerCase().includes('card'));
    const totalLimit = creditCards.reduce((sum, c) => sum + (c.limit || 0), 0);
    const totalBalance = creditCards.reduce((sum, c) => sum + (c.balance || 0), 0);

    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

    useEffect(() => {
        // Animate to value on mount
        const timer = setTimeout(() => {
            setFillWidth(utilization);
        }, 300);
        return () => clearTimeout(timer);
    }, [utilization]);

    let barColor = 'var(--color-score-excellent)';
    if (utilization > 30) barColor = 'var(--color-score-fair)';
    if (utilization > 50) barColor = 'var(--color-score-poor)';

    if (totalLimit === 0) {
        return (
            <div className="apple-card h-full flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-2">Credit Utilization</h3>
                <p className="text-[var(--text-secondary)] text-sm">No credit cards found to calculate utilization.</p>
            </div>
        );
    }

    return (
        <div className="apple-card h-full flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-semibold tracking-tight">Credit Utilization</h3>
                <span className="text-xl font-bold" style={{ color: barColor }}>{utilization.toFixed(1)}%</span>
            </div>

            <div className="relative h-4 bg-[var(--border-color)] rounded-full overflow-visible my-2">
                {/* Benchmark line */}
                <div
                    className="absolute top-[-8px] bottom-[-8px] w-0.5 bg-[var(--text-primary)]/50 z-10 hidden sm:block delay-500 animate-in fade-in"
                    style={{ left: `${THRESHOLDS.CREDIT_UTILIZATION_IDEAL}%` }}
                >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[var(--text-secondary)] whitespace-nowrap">Ideal 30%</span>
                </div>

                {/* Progress Fill */}
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, fillWidth)}%`, backgroundColor: barColor }}
                />
            </div>

            <div className="flex justify-between mt-4 text-sm font-medium">
                <div>
                    <span className="text-[var(--text-secondary)] text-xs block mb-1">Total Balance</span>
                    ₹{totalBalance.toLocaleString('en-IN')}
                </div>
                <div className="text-right">
                    <span className="text-[var(--text-secondary)] text-xs block mb-1">Total Limit</span>
                    ₹{totalLimit.toLocaleString('en-IN')}
                </div>
            </div>
        </div>
    );
}
