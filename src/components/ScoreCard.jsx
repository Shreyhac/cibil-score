import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getScoreCategory } from '../utils/scoreCategory';

export default function ScoreCard({ score, bureau }) {
    const { label, color } = getScoreCategory(score);

    // Gauge setup: max 900, min 300. We will scale it.
    const maxScore = 900;
    const minScore = 300;
    const displayScore = Number(score) || 0;

    // Scale for visual pie chart (0-100%). If score is 0, just show 0% progress.
    let fillPercentage = 0;
    if (displayScore > 0) {
        const normalizedScore = Math.max(minScore, Math.min(maxScore, displayScore));
        fillPercentage = (normalizedScore - minScore) / (maxScore - minScore);
    }

    const data = [
        { name: 'Score', value: fillPercentage * 100 },
        { name: 'Remaining', value: Math.max(0, 100 - (fillPercentage * 100)) }
    ];

    return (
        <div className="apple-card flex flex-col items-center justify-center relative min-h-[300px]">
            <div className="absolute top-6 left-6 text-sm text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                {bureau} Score
            </div>

            <div className="w-full h-48 mt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={75}
                            outerRadius={95}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            animationBegin={100}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            <Cell key="cell-0" fill={color} />
                            <Cell key="cell-1" fill="var(--border-color)" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-5xl font-bold tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                        {displayScore}
                    </span>
                    <div className="mt-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm" style={{ backgroundColor: `${color}20`, color: color }}>
                        {label}
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full mt-4 px-8 text-xs text-[var(--text-secondary)] font-medium">
                <span>300</span>
                <span>900</span>
            </div>
        </div>
    );
}
