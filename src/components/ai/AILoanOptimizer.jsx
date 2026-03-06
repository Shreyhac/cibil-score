import React, { useState, useEffect } from 'react';
import { callGemini } from '../shared/GeminiChat';
import { useGemini } from '../../context/GeminiContext';
import { Lightbulb, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/homeLoanStrategies';

export default function AILoanOptimizer({ activeAccounts, currentScore }) {
    const { apiKey } = useGemini();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState(null);

    const creditCards = activeAccounts.filter(a => a.type === 'credit_card');
    const hasBalances = creditCards.some(c => c.balance && c.balance > 0);
    const totalUtil = Math.round((creditCards.reduce((a, b) => a + (b.balance || 0), 0) / creditCards.reduce((a, b) => a + (b.limit || 0), 0)) * 100) || 0;

    const fetchRecommendations = async () => {
        if (!apiKey) {
            setError("API key required.");
            return;
        }

        setLoading(true);
        setError(null);

        const prompt = `You are a credit card optimization expert for the Indian market.
Here are the user's credit cards:
${JSON.stringify(creditCards, null, 2)}
Credit score: ${currentScore}
Overall utilization: ${totalUtil}%
Provide exactly 5 recommendations in this JSON format:
[
{
"title": "short title",
"description": "2-3 sentence advice",
"impact": "score impact or savings estimate",
"priority": "high" // or medium/low
}
]
Focus on paying off cards, balance redistribution, limit increases, active vs closed, and 0% reporting.
Respond with ONLY the JSON array, no markdown, no backticks, no preamble.`;

        try {
            const result = await callGemini(apiKey, prompt);
            setRecommendations(Array.isArray(result) ? result : result.recommendations || result);
        } catch (err) {
            setError(err.message || "Failed to load insights");
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch if key exists and hasn't fetched yet
    useEffect(() => {
        if (apiKey && !recommendations && !loading && !error && hasBalances) {
            fetchRecommendations();
        }
    }, [apiKey, recommendations, loading, error, hasBalances]);

    if (!hasBalances && creditCards.length === 0) return null;

    return (
        <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl p-6" id="ai-insights">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <CreditCard size={20} className="text-[var(--color-apple-blue)]" />
                        AI Card & Debt Optimizer
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Smarter ways to pay down your balances</p>
                </div>
                {!apiKey && (
                    <div className="text-xs bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 font-medium border border-amber-500/20">
                        <AlertCircle size={14} /> Add API key in topbar
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex gap-4">
                            <div className="w-10 h-10 bg-[var(--bg-color)] rounded-full"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-[var(--bg-color)] rounded w-3/4"></div>
                                <div className="h-3 bg-[var(--bg-color)] rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-start gap-3 w-full">
                    <AlertCircle className="mt-0.5 shrink-0" size={18} />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium break-words">{error}</p>
                        <button onClick={fetchRecommendations} className="text-xs underline mt-2 hover:opacity-80">Try Again</button>
                    </div>
                </div>
            ) : recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                    {recommendations.map((rec, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] flex gap-4">
                            <div className="mt-0.5">
                                <Lightbulb size={20} className={
                                    rec.priority?.toLowerCase() === 'high' ? "text-amber-500" :
                                        rec.priority?.toLowerCase() === 'medium' ? "text-blue-500" : "text-emerald-500"
                                } />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-sm">{rec.title}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rec.priority?.toLowerCase() === 'high' ? "bg-amber-500/10 text-amber-500" : "bg-[var(--card-color)] text-[var(--text-secondary)]"
                                        }`}>
                                        {rec.priority?.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mb-2">{rec.description}</p>
                                <span className="inline-block px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-semibold">
                                    Impact: {rec.impact}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : apiKey ? (
                <div className="text-center p-6 border border-dashed border-[var(--border-color)] rounded-xl">
                    <button onClick={fetchRecommendations} className="px-4 py-2 bg-[var(--color-apple-blue)] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                        Generate Optimization Strategy
                    </button>
                </div>
            ) : (
                <div className="text-center p-6 border border-dashed border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)]">
                    Activate the AI optimizer by adding your Gemini API key above.
                </div>
            )}
        </div>
    );
}
