import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { THRESHOLDS } from '../constants/thresholds';

export default function EnquiryTracker({ enquiries }) {
    if (!enquiries || enquiries.length === 0) {
        return (
            <div className="apple-card col-span-1">
                <h3 className="text-lg font-semibold tracking-tight mb-4">Recent Enquiries</h3>
                <p className="text-sm text-[var(--text-secondary)]">No recent credit enquiries found.</p>
            </div>
        );
    }

    const isWarning = enquiries.length > THRESHOLDS.ENQUIRIES_SAFE;

    return (
        <div className="apple-card relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold tracking-tight">Recent Enquiries</h3>
                <span className="bg-[var(--bg-color)] text-xs font-bold px-2.5 py-1 rounded-full border border-[var(--border-color)] shadow-sm">
                    {enquiries.length} Total
                </span>
            </div>

            {isWarning && (
                <div className="mb-4 bg-[var(--color-score-fair)]/10 text-[var(--color-score-fair)] rounded-xl p-3 flex items-start gap-3 border border-[var(--color-score-fair)]/20 animate-in slide-in-from-top-2">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <div className="text-xs font-medium leading-relaxed">
                        Multiple enquiries may impact your score. Limit hard enquiries to protect your credit health.
                    </div>
                </div>
            )}

            <ul className="space-y-3">
                {enquiries.map((enq, idx) => {
                    const date = new Date(enq.date);
                    const formattedDate = isNaN(date.getTime()) ? enq.date : date.toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    });

                    return (
                        <li key={idx} className="flex justify-between items-center text-sm p-3 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow group-hover:border-[var(--color-apple-blue)]/30">
                            <div className="font-semibold">{enq.bank}</div>
                            <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1.5 font-medium">
                                <Clock size={12} />
                                {formattedDate}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
