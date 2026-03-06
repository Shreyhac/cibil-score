import React, { useState } from 'react';
import { Key, X, Check } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useGemini } from '../../context/GeminiContext';

export default function TopBar({ onReset }) {
    const { apiKey } = useGemini();

    return (
        <header className="p-4 flex justify-between items-center w-full border-b border-[var(--border-color)] bg-[var(--bg-color)] z-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
                <div className="w-8 h-8 rounded-lg bg-[var(--color-apple-blue)] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    C
                </div>
                <h1 className="text-xl font-semibold tracking-tight hidden sm:block">Credit Intelligence</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Modal button completely removed because API key is hardcoded */}
                <ThemeToggle />
            </div>
        </header>
    );
}
