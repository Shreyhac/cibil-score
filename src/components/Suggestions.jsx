import React, { useState, useEffect } from 'react';
import { fetchGeminiInsights } from '../utils/geminiApi';
import { useGemini } from '../context/GeminiContext';
import { calculateInsights } from '../utils/calculateInsights';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function Suggestions({ data }) {
    const { apiKey } = useGemini();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fallback static insights
    const staticInsights = calculateInsights(data).suggestions;

    useEffect(() => {
        let isMounted = true;

        async function loadAIInsights() {
            if (!apiKey) {
                setSuggestions(staticInsights);
                return;
            }

            setLoading(true);
            try {
                const aiResult = await fetchGeminiInsights(apiKey, data);
                if (isMounted) setSuggestions(aiResult);
            } catch (err) {
                console.error("AI Insights Error:", err);
                if (isMounted) {
                    setError('Failed to load AI analysis. Falling back to standard suggestions.');
                    setSuggestions(staticInsights);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadAIInsights();
        return () => { isMounted = false; };
    }, [apiKey, data]);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-[var(--color-score-poor)]/10 text-[var(--color-score-poor)] border-[var(--color-score-poor)]/20';
            case 'medium': return 'bg-[var(--color-score-fair)]/10 text-[var(--color-score-fair)] border-[var(--color-score-fair)]/20';
            case 'low': return 'bg-[var(--color-score-good)]/10 text-[var(--color-score-excellent)] border-[var(--color-score-excellent)]/20 text-green-700 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (!suggestions || suggestions.length === 0 && !loading) return null;

    return (
        <div className="apple-card bg-gradient-to-br from-[var(--card-color)] to-[var(--bg-color)]">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold tracking-tight inline-flex items-center gap-2">
                    Recommendations {apiKey && !loading && !error && <Sparkles size={16} className="text-[#007AFF]" />}
                </h3>
            </div>

            {error && (
                <div className="mb-4 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-2 rounded-lg flex items-start gap-1">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-[var(--border-color)] flex-shrink-0"></div>
                            <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-3 flex-1 h-20"></div>
                        </div>
                    ))
                ) : (
                    suggestions.map((sug, idx) => (
                        <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-md text-sm ${apiKey && !error ? 'bg-[#007AFF] text-white' : 'bg-[var(--text-primary)] text-[var(--bg-color)]'}`}>
                                {idx + 1}
                            </div>
                            <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-3 shadow-sm flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-medium leading-snug">{sug.text}</p>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mt-2 ${getPriorityColor(sug.priority)}`}>
                                    {sug.priority || 'Medium'} Priority
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
