import React, { useState } from 'react';
import { callGemini } from '../shared/GeminiChat';
import { useGemini } from '../../context/GeminiContext';
import { Sparkles, AlertCircle } from 'lucide-react';
import { cardRewards, spendCategories } from '../../utils/rewardCategories';

export default function AISpendAdvisor({ activeAccounts }) {
    const { apiKey } = useGemini();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aiData, setAiData] = useState(null);

    const creditCards = activeAccounts.filter(a => a.type === 'credit_card');

    // Rule-based Matrix calculation
    const categoriesWithBestCards = spendCategories.map(cat => {
        let bestCard = null;
        let bestRate = 0;
        let bestBank = '';

        creditCards.forEach(card => {
            const bankRewards = cardRewards[card.bank] || cardRewards["default"];
            const specificCardRewards = bankRewards[card.card_name] || bankRewards["default"];

            // Check specific card first, then bank default
            let rate = 1;
            if (specificCardRewards && specificCardRewards[cat.id]) {
                rate = specificCardRewards[cat.id];
            } else if (specificCardRewards && specificCardRewards.default) {
                rate = specificCardRewards.default;
            }

            if (rate > bestRate) {
                bestRate = rate;
                bestCard = card.card_name || card.bank;
                bestBank = card.bank;
            }
        });

        // Relative strength visual (0 to 10 scale approx)
        const strength = Math.min(10, bestRate * 2);

        return { ...cat, bestCard, bestBank, bestRate, strength };
    });

    const fetchAiInsights = async () => {
        if (!apiKey) return;
        setLoading(true);
        setError(null);

        const cardList = creditCards.map(c => `${c.bank} ${c.card_name || ''}`).join(', ');

        const prompt = `You are a credit card rewards expert for India.
The user has these credit cards: ${cardList}
For each of these spend categories: dining, travel, grocery, online shopping, fuel, bills, entertainment, Amazon, Flipkart
Provide a spend optimization strategy in this JSON format:
{
  "monthly_strategy": [
    {
      "category": "category name",
      "recommended_card": "bank name",
      "reason": "1 sentence why",
      "estimated_monthly_rewards": "approximate value in ₹"
    }
  ],
  "pro_tips": ["tip 1 about maximizing rewards", "tip 2", "tip 3"],
  "estimated_annual_savings": "₹X,XXX"
}
Respond with ONLY the JSON object, no markdown, no backticks, no preamble.`;

        try {
            const result = await callGemini(apiKey, prompt);
            setAiData(result);
        } catch (err) {
            setError(err.message || "Failed to load AI strategy");
        } finally {
            setLoading(false);
        }
    };

    if (creditCards.length === 0) return null;

    return (
        <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Sparkles size={20} className="text-purple-500" />
                        Smart Spend Advisor
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Maximize rewards from your existing cards</p>
                </div>
            </div>

            {/* Rule-based Matrix */}
            <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[var(--bg-color)] text-[var(--text-secondary)] font-medium">
                        <tr>
                            <th className="px-4 py-2 rounded-tl-lg">Category</th>
                            <th className="px-4 py-2">Best Card to Use</th>
                            <th className="px-4 py-2 rounded-tr-lg">Reward Strength</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {categoriesWithBestCards.map(cat => (
                            <tr key={cat.id} className="hover:bg-[var(--bg-color)]/50 transition-colors">
                                <td className="px-4 py-3 font-medium flex items-center gap-2">
                                    <span>{cat.icon}</span> {cat.label}
                                </td>
                                <td className="px-4 py-3 text-[var(--color-apple-blue)] font-medium">
                                    {cat.bestBank} {cat.bestCard} ({cat.bestRate}x)
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-[var(--bg-color)] rounded-full overflow-hidden w-24">
                                            <div
                                                className={`h-full rounded-full ${cat.strength >= 8 ? "bg-green-500" : cat.strength >= 5 ? "bg-amber-500" : "bg-gray-400"}`}
                                                style={{ width: `${cat.strength * 10}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-[var(--text-secondary)] w-10 text-right">
                                            {cat.strength >= 8 ? "High" : cat.strength >= 5 ? "Med" : "Low"}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* AI Deep Dive Section */}
            {
                !aiData && !loading ? (
                    <div className="flex justify-center border-t border-[var(--border-color)] pt-6">
                        <button
                            onClick={fetchAiInsights}
                            disabled={!apiKey}
                            className={`px-6 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-all ${apiKey
                                ? "bg-gradient-to-r from-purple-500 to-[var(--color-apple-blue)] text-white hover:opacity-90 shadow-lg shadow-purple-500/20"
                                : "bg-[var(--bg-color)] text-[var(--text-secondary)] cursor-not-allowed"
                                }`}
                        >
                            <Sparkles size={16} />
                            Get AI Personalized Strategy
                        </button>
                        {!apiKey && <span className="text-xs text-[var(--text-secondary)] ml-3 self-center">(Requires API Key)</span>}
                    </div>
                ) : loading ? (
                    <div className="border-t border-[var(--border-color)] pt-6 flex justify-center py-8 text-[var(--color-apple-blue)]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                    </div>
                ) : error ? (
                    <div className="border-t border-[var(--border-color)] pt-6 text-red-500 text-sm p-4 bg-red-500/10 rounded-xl break-words">
                        <AlertCircle className="inline mr-2" size={16} /> {error}
                    </div>
                ) : (
                    <div className="border-t border-[var(--border-color)] pt-6 mt-4">
                        <div className="bg-gradient-to-br from-purple-500/10 to-[var(--color-apple-blue)]/5 p-5 rounded-xl border border-purple-500/20 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-purple-600 dark:text-purple-400">Estimated Annual Savings</h4>
                                <span className="text-2xl font-bold text-green-500">{aiData.estimated_annual_savings}</span>
                            </div>
                        </div>

                        <h4 className="font-semibold text-sm mb-3 text-[var(--text-secondary)]">Pro Tips</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {aiData.pro_tips?.map((tip, i) => (
                                <div key={i} className="bg-[var(--bg-color)] p-3 rounded-lg border border-[var(--border-color)] text-sm">
                                    <span className="text-purple-500 font-bold mr-2">Tip {i + 1}:</span> {tip}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
