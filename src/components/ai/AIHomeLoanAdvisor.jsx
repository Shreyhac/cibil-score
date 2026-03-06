import React, { useState } from 'react';
import { Home, IndianRupee, Clock, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { generateHomeLoanStrategies, formatINR } from '../../utils/homeLoanStrategies';
import { callGemini } from '../shared/GeminiChat';
import { useGemini } from '../../context/GeminiContext';

export default function AIHomeLoanAdvisor({ activeAccounts, currentScore }) {
    const { apiKey } = useGemini();
    const homeLoan = activeAccounts.find(a => ['home_loan', 'housing_loan'].includes(a.type));

    const [sliderValue, setSliderValue] = useState(0);
    const [showAi, setShowAi] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!homeLoan) return null;

    // Use default interest rate if missing
    const rate = homeLoan.interest_rate || 8.5;
    const rulesStrategies = generateHomeLoanStrategies(homeLoan, currentScore);

    const handleAIFetch = async () => {
        if (!apiKey || aiData) {
            setShowAi(true);
            return;
        }

        setLoading(true);
        setShowAi(true);

        const prompt = `You are a home loan advisor in India with expertise in interest optimization.
Home Loan Details:
Bank: ${homeLoan.bank}
Original Amount: ₹${homeLoan.loan_amount}
Outstanding: ₹${homeLoan.outstanding}
EMI: ₹${homeLoan.emi}
Estimated Interest Rate: ${rate}%
User's Credit Score: ${currentScore}

Provide a personalized home loan optimization plan in this JSON format:
{
  "current_analysis": {
    "total_interest_remaining": "₹X",
    "effective_cost": "summary",
    "risk_assessment": "low"
  },
  "top_strategies": [
    {
      "title": "strategy title",
      "description": "2-3 sentences of advice",
      "potential_savings": "₹X",
      "priority": "high"
    }
  ],
  "banks_to_compare": ["bank1", "bank2"],
  "tax_optimization": "1-2 sentence tax advice"
}
Respond with ONLY the JSON object, no markdown, no backticks, no preamble.`;

        try {
            const result = await callGemini(apiKey, prompt);
            setAiData(result);
        } catch (err) {
            setError(err.message || "Failed to load AI strategy");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl p-6" id="home-loan">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Home size={20} className="text-blue-500" />
                        Home Loan Savings Advisor
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Strategies to reduce your home loan interest</p>
                </div>
            </div>

            {/* Current Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-3 bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-secondary)] mb-1">Bank</div>
                    <div className="font-semibold">{homeLoan.bank}</div>
                </div>
                <div className="p-3 bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-secondary)] mb-1">Outstanding</div>
                    <div className="font-semibold text-red-500">₹{formatINR(homeLoan.outstanding)}</div>
                </div>
                <div className="p-3 bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-secondary)] mb-1">Current EMI</div>
                    <div className="font-semibold">₹{formatINR(homeLoan.emi)}</div>
                </div>
                <div className="p-3 bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-secondary)] mb-1">Est. Rate</div>
                    <div className="font-semibold text-amber-500">{rate}%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Prepayment Calculator */}
                <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 pt-4 pr-4 text-[var(--border-color)] opacity-20"><Home size={100} /></div>
                    <h4 className="font-semibold text-sm mb-4 relative z-10 flex items-center gap-2">
                        <IndianRupee size={16} className="text-green-500" /> Prepayment Simulator
                    </h4>

                    <div className="mb-6 relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-medium text-[var(--text-secondary)]">Extra Annual Prepayment</label>
                            <span className="text-sm font-bold text-green-500">₹{formatINR(sliderValue)}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={500000}
                            step={25000}
                            value={sliderValue}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                            className="w-full accent-green-500 cursor-pointer h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-[var(--card-color)] p-3 rounded-xl border border-[var(--border-color)] text-center">
                            <span className="block text-xs text-[var(--text-secondary)] mb-1">Interest Saved</span>
                            <span className="font-bold text-green-500">
                                {sliderValue > 0 ? `~₹${formatINR(sliderValue * 2.5)}` : "₹0"}
                            </span>
                        </div>
                        <div className="bg-[var(--card-color)] p-3 rounded-xl border border-[var(--border-color)] text-center">
                            <span className="block text-xs text-[var(--text-secondary)] mb-1">Tenure Reduced</span>
                            <span className="font-bold text-[var(--color-apple-blue)] flex items-center justify-center gap-1">
                                <Clock size={14} />
                                {sliderValue > 0 ? `~${Math.round((sliderValue / homeLoan.outstanding) * homeLoan.tenure_months * 2)} mo` : "0 mo"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Built-in strategies */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm mb-2 text-[var(--text-secondary)]">Quick Strategies</h4>
                    {rulesStrategies.slice(0, 3).map((strat, i) => (
                        <div key={i} className="flex gap-3 items-start bg-[var(--bg-color)] p-3 rounded-xl border border-[var(--border-color)] hover:border-blue-500/30 transition-colors cursor-default">
                            <span className="text-xl">{strat.icon}</span>
                            <div>
                                <h5 className="font-semibold text-sm">{strat.title}</h5>
                                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">{strat.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Deep Analysis */}
            <div className="mt-8 border-t border-[var(--border-color)] pt-6">
                <button
                    onClick={handleAIFetch}
                    className="w-full py-3 bg-[var(--bg-color)] hover:bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                >
                    <Zap size={18} className={apiKey ? "text-amber-500" : "text-gray-400"} />
                    {showAi ? 'Hide AI Deep Analysis' : 'Get Personalized AI Analysis'}
                    {showAi ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAi && (
                    <div className="mt-4 p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
                        {loading ? (
                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-amber-500" /></div>
                        ) : error ? (
                            <div className="text-red-500 text-sm p-4 bg-red-500/10 rounded-xl break-words">
                                <AlertCircle className="inline mr-2" size={16} /> {error}
                            </div>
                        ) : !apiKey ? (
                            <p className="text-sm text-center text-amber-600">Please enter your Gemini API key in the top bar to run deep analysis.</p>
                        ) : aiData ? (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[var(--card-color)] p-3 rounded-lg border border-[var(--border-color)]">
                                        <div className="text-xs text-[var(--text-secondary)]">Total Interest Remaining</div>
                                        <div className="font-bold text-red-500">{aiData.current_analysis?.total_interest_remaining}</div>
                                    </div>
                                    <div className="bg-[var(--card-color)] p-3 rounded-lg border border-[var(--border-color)]">
                                        <div className="text-xs text-[var(--text-secondary)]">Risk Assessment</div>
                                        <div className="font-bold text-amber-500 capitalize">{aiData.current_analysis?.risk_assessment}</div>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="font-semibold text-sm mb-3">Top AI Strategies</h5>
                                    <div className="space-y-3">
                                        {aiData.top_strategies?.map((strat, i) => (
                                            <div key={i} className="bg-[var(--card-color)] p-3 rounded-lg border border-[var(--border-color)]">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-sm">{strat.title}</span>
                                                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{strat.potential_savings}</span>
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)]">{strat.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[var(--card-color)] p-3 rounded-lg border border-[var(--border-color)] text-sm">
                                    <span className="font-semibold mr-2">Tax Tip:</span>
                                    <span className="text-[var(--text-secondary)]">{aiData.tax_optimization}</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
