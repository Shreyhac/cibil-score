import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function ScoreTrend({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="apple-card col-span-1 md:col-span-2 flex items-center justify-center min-h-[300px]">
                <p className="text-[var(--text-secondary)]">Score trend will appear when historical data is available.</p>
            </div>
        );
    }

    return (
        <div className="apple-card col-span-1 md:col-span-2 overflow-hidden h-[300px] flex flex-col">
            <h3 className="text-xl font-semibold tracking-tight mb-4">Score Trend</h3>
            <div className="flex-1 w-full min-h-0 relative -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-apple-blue)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-apple-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                            dy={10}
                            tickFormatter={(val) => val.split('-').reverse().join('/')}
                        />
                        <YAxis
                            domain={['dataMin - 20', 'dataMax + 20']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card-color)',
                                borderColor: 'var(--border-color)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                            labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="var(--color-apple-blue)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
