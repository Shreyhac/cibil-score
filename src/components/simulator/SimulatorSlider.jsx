import React from 'react';
import { formatINR } from '../../utils/homeLoanStrategies'; // Re-use formatINR or add to shared util

export default function SimulatorSlider({
    label,
    value,
    min = 0,
    max = 100000,
    step = 5000,
    onChange,
    formatValue = (v) => `₹${formatINR(v)}`
}) {
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-sm font-semibold text-[var(--color-apple-blue)]">{formatValue(value)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-[var(--color-apple-blue)] cursor-pointer h-2 bg-[var(--border-color)] rounded-lg appearance-none"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>{formatValue(min)}</span>
                <span>{formatValue(max)}</span>
            </div>
        </div>
    );
}

// Keep formatINR here too just in case it's missed
// function formatINR(amount) {
//     return new Intl.NumberFormat('en-IN').format(Math.round(amount));
// }
