import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { fetchGeminiInsights } from '../utils/geminiApi';
import { useGemini } from '../context/GeminiContext';

export default function AISuggestions({ data }) {
    const { apiKey } = useGemini();
    const [insights, setInsights] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!apiKey) {
            setError('Please enter a Gemini API Key in the top bar.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await fetchGeminiInsights(apiKey, data);
            setInsights(result);
        } catch (err) {
            setError(err.message || 'Failed to generate insights. Please check your API key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="apple-card relative overflow-hidden ring-1 ring-[#007AFF]/20 p-6 rounded-2xl bg-[var(--card-color)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-[#007AFF]"></div>

            <div className="flex justify-between items-center mb-6 mt-1">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-[#007AFF]" size={20} />
                    <h3 className="text-xl font-semibold tracking-tight">AI Analysis</h3>
                </div>
                {!apiKey && (
                    <div className="text-xs bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 font-medium border border-amber-500/20">
                        <AlertCircle size={14} /> Add API key above
                    </div>
                )}
            </div>

            {!insights && !loading && (
                <div className="space-y-4">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Connect Gemini to get deep, personalized financial insights based on your credit profile.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg flex items-start gap-2">
                            <AlertCircle className="mt-0.5 shrink-0" size={16} />
                            <p className="text-xs font-medium break-words space-y-1 w-full">{error}</p>
                        </div>
                    )}

                    {apiKey ? (
                        <div className="text-center p-4 border border-dashed border-[var(--border-color)] rounded-xl mt-4">
                            <button
                                onClick={handleGenerate}
                                className="px-4 py-2 bg-[#007AFF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex justify-center items-center gap-2 mx-auto"
                            >
                                <Sparkles size={16} /> Generate Insights
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-6 border border-dashed border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] mt-4">
                            🔑 Add API key for AI insights in the top bar.
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <div className="py-8 flex flex-col items-center justify-center text-[var(--text-secondary)]">
                    <Loader2 size={24} className="animate-spin mb-3 text-[#007AFF]" />
                    <p className="text-sm font-medium animate-pulse">Analyzing credit profile...</p>
                </div>
            )}

            {insights && !loading && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-[var(--text-primary)] whitespace-pre-line leading-relaxed">
                        {insights}
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="text-xs text-[#007AFF] font-medium hover:underline flex items-center gap-1 mt-4"
                    >
                        <Sparkles size={12} /> Regenerate Insights
                    </button>
                </div>
            )}
        </div>
    );
}
