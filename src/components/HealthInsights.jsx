import React, { useMemo } from 'react';
import { calculateInsights } from '../utils/calculateInsights';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function HealthInsights({ data }) {
    const { insights } = useMemo(() => calculateInsights(data), [data]);

    if (!insights || insights.length === 0) return null;

    const getIcon = (status) => {
        switch (status) {
            case 'Healthy': return <CheckCircle2 className="text-[var(--color-score-excellent)] shrink-0" size={20} />;
            case 'Warning': return <AlertCircle className="text-[var(--color-score-fair)] shrink-0" size={20} />;
            case 'Critical': return <XCircle className="text-[var(--color-score-poor)] shrink-0" size={20} />;
            default: return null;
        }
    };

    return (
        <div className="apple-card">
            <h3 className="text-xl font-semibold tracking-tight mb-4">Credit Health Insights</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl shadow-sm border border-[var(--border-color)] transition-all hover:-translate-y-0.5"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        {getIcon(insight.status)}
                        <div>
                            <div className="font-medium text-sm leading-tight">{insight.text}</div>
                            <div className="text-[10px] font-bold uppercase mt-1 tracking-wider text-[var(--text-secondary)]">
                                {insight.status} Info
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
