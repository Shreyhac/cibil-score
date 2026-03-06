import React, { useMemo } from 'react';
import { calculateInsights } from '../utils/calculateInsights';

export default function Suggestions({ data }) {
    const { suggestions } = useMemo(() => calculateInsights(data), [data]);

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="apple-card">
                <h3 className="text-xl font-semibold tracking-tight mb-4">Recommendations</h3>
                <p className="text-sm text-[var(--text-secondary)]">Your credit profile looks great! Keep up the good work.</p>
            </div>
        );
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-[var(--color-score-poor)]/10 text-[var(--color-score-poor)] border-[var(--color-score-poor)]/20';
            case 'Medium': return 'bg-[var(--color-score-fair)]/10 text-[var(--color-score-fair)] border-[var(--color-score-fair)]/20';
            case 'Low': return 'bg-[var(--color-score-good)]/10 text-[var(--color-score-excellent)] border-[var(--color-score-excellent)]/20 text-green-700 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="apple-card bg-gradient-to-br from-[var(--card-color)] to-[var(--bg-color)]">
            <h3 className="text-xl font-semibold tracking-tight mb-4">Recommendations</h3>

            <div className="space-y-4">
                {suggestions.map((sug, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-color)] font-bold shadow-md text-sm">
                            {idx + 1}
                        </div>
                        <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-3 shadow-sm flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium leading-snug">{sug.text}</p>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mt-2 ${getPriorityColor(sug.priority)}`}>
                                {sug.priority} Priority
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
