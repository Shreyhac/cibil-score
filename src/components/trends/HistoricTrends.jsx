import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function HistoricTrends({ history }) {
    if (!history || history.length === 0) return null;

    // Calculate deltas
    const dataWithDeltas = history.map((item, index) => {
        if (index === 0) return { ...item, delta: 0 };
        return {
            ...item,
            delta: item.score - history[index - 1].score
        };
    });

    const minScore = Math.min(...history.map(d => d.score)) - 50;
    const maxScore = Math.max(...history.map(d => d.score)) + 50;

    // Overall trend
    const firstScore = history[0].score;
    const lastScore = history[history.length - 1].score;
    const isUp = lastScore >= firstScore;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[var(--card-color)] border border-[var(--border-color)] p-3 rounded-lg shadow-lg">
                    <p className="font-medium text-sm mb-1">{data.date}</p>
                    <p className="font-bold text-xl text-[var(--color-apple-blue)]">{data.score}</p>
                    {data.delta !== 0 && (
                        <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${data.delta > 0 ? "text-green-500" : "text-red-500"}`}>
                            {data.delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {data.delta > 0 ? '+' : ''}{data.delta} points
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl p-6" id="trends">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        {isUp ? <TrendingUp size={20} className="text-green-500" /> : <TrendingDown size={20} className="text-red-500" />}
                        Historic Trends
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Your score progression over time</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-[var(--text-secondary)]">Change</div>
                    <div className={`text-lg font-bold flex items-center gap-1 justify-end ${isUp ? "text-green-500" : "text-red-500"}`}>
                        {isUp ? '+' : ''}{lastScore - firstScore} pts
                    </div>
                </div>
            </div>

            <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%" className="recharts-responsive-container">
                    <AreaChart data={dataWithDeltas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-apple-blue)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-apple-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                            dy={10}
                        />
                        <YAxis
                            domain={[Math.max(300, minScore), Math.min(900, maxScore)]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="var(--color-apple-blue)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            activeDot={{ r: 6, fill: "var(--color-apple-blue)", stroke: "var(--bg-color)", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between mt-4 overflow-x-auto pb-2 gap-2 hide-scrollbar">
                {dataWithDeltas.map((item, idx) => (
                    <div key={idx} className="flex-shrink-0 text-center w-16">
                        <div className="text-[10px] text-[var(--text-secondary)] mb-1">{item.date}</div>
                        {item.delta !== 0 ? (
                            <div className={`text-xs font-bold rounded px-1 py-0.5 ${item.delta > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                {item.delta > 0 ? '+' : ''}{item.delta}
                            </div>
                        ) : (
                            <div className="text-xs font-medium text-[var(--text-secondary)] flex justify-center"><Minus size={14} /></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
