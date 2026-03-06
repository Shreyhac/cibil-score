import React, { useState } from 'react';
import { Target, CheckCircle2, CircleDashed, ArrowRight } from 'lucide-react';

export default function ScoreRoadmap({ currentScore }) {
    const targets = [750, 800, 850, 900].filter(t => t > currentScore);
    const initialTarget = targets.length > 0 ? targets[0] : 900;
    const [targetScore, setTargetScore] = useState(initialTarget);

    const getRoadmapSteps = (current, target) => {
        const steps = [];
        const diff = target - current;

        if (diff <= 0) {
            steps.push({
                title: "You've reached your goal!",
                desc: "Maintain your excellent credit habits.",
                impact: "Ongoing"
            });
            return steps;
        }

        // Generate synthetic steps based on the gap
        if (current < 750) {
            steps.push({
                title: "Clear upcoming dues",
                desc: "Ensure 100% on-time payments for the next 3 months.",
                impact: "+15 to +25 points"
            });
            steps.push({
                title: "Reduce credit card utilization",
                desc: "Bring down utilization below 30% by paying off balances mid-cycle.",
                impact: "+10 to +20 points"
            });
        }

        if (target >= 800 && current < 800) {
            steps.push({
                title: "Increase Credit Limits",
                desc: "Request a limit increase on your oldest card to lower overall utilization.",
                impact: "+10 to +15 points"
            });
            steps.push({
                title: "Age your accounts",
                desc: "Avoid applying for new credit for the next 6-12 months.",
                impact: "+5 to +10 points (over time)"
            });
        }

        if (target >= 850) {
            steps.push({
                title: "Diversify Credit Mix",
                desc: "If you only have cards, a small secured loan can improve your mix (optional).",
                impact: "+10 points"
            });
            steps.push({
                title: "Patience and Consistency",
                desc: "Scores above 850 require years of spotless history.",
                impact: "Time-based"
            });
        }

        return steps.slice(0, 4); // Keep to max 4 steps for UI
    };

    const steps = getRoadmapSteps(currentScore, targetScore);

    return (
        <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl p-6 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-apple-blue)]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Target size={20} className="text-[var(--color-apple-blue)]" />
                        Score Building Roadmap
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Personalized steps to reach your target</p>
                </div>

                {targets.length > 0 && (
                    <div className="flex p-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg">
                        {targets.map(t => (
                            <button
                                key={t}
                                onClick={() => setTargetScore(t)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${targetScore === t
                                        ? 'bg-[var(--color-apple-blue)] text-white shadow-sm'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-[var(--border-color)]"></div>

                <div className="space-y-6">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4 group">
                            <div className="relative mt-1">
                                <div className="w-8 h-8 rounded-full bg-[var(--bg-color)] border-2 border-[var(--border-color)] group-hover:border-[var(--color-apple-blue)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--color-apple-blue)] transition-colors bg-[var(--card-color)] z-10 relative">
                                    {idx + 1}
                                </div>
                            </div>
                            <div className="flex-1 bg-[var(--bg-color)] p-4 rounded-xl border border-[var(--border-color)] group-hover:border-[var(--color-apple-blue)]/30 transition-colors">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <h4 className="font-semibold text-sm">{step.title}</h4>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 whitespace-nowrap">
                                        {step.impact}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-4">
                        <div className="relative mt-1">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center text-white shadow-md z-10 relative">
                                <Target size={14} />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <h4 className="font-bold text-lg text-[var(--color-apple-blue)]">Target {targetScore}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
