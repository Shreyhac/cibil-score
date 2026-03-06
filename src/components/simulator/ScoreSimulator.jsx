import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import SimulatorSlider from './SimulatorSlider';
import { simulateScore } from '../../utils/scoreSimulation';
import { formatINR } from '../../utils/homeLoanStrategies';

export default function ScoreSimulator({ data }) {
    const currentScore = data.user.creditScore;

    // Total CC debt for slider max
    const totalCCDebt = data.accounts
        .filter(a => a.type === 'credit_card' && a.status === 'active')
        .reduce((sum, a) => sum + (a.balance || 0), 0);

    const activeCards = data.accounts.filter(a => a.type === 'credit_card' && a.status === 'active');

    const [changes, setChanges] = useState({
        payCardDebt: 0,
        closedCardLimit: 0,
        missedPayment: false,
        clearLoans: false,
        newLoan: false,
        newCardLimit: 0,
    });

    // UI selections that map to changes
    const [selectedCardToClose, setSelectedCardToClose] = useState('');
    const [newLoanAmount, setNewLoanAmount] = useState(0);
    const [newCardLimitSel, setNewCardLimitSel] = useState(0);

    const [simulatedScore, setSimulatedScore] = useState(currentScore);
    const [displayScore, setDisplayScore] = useState(currentScore);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const newScore = simulateScore(currentScore, data, changes);
        setSimulatedScore(newScore);

        // Simple animation
        setIsAnimating(true);
        let start = displayScore;
        const diff = newScore - start;
        const steps = 15;
        let step = 0;

        if (diff === 0) {
            setIsAnimating(false);
            return;
        }

        const interval = setInterval(() => {
            step++;
            setDisplayScore(Math.round(start + (diff * (step / steps))));
            if (step >= steps) {
                setDisplayScore(newScore);
                setIsAnimating(false);
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [changes, currentScore, data]);

    const handleReset = () => {
        setChanges({
            payCardDebt: 0,
            closedCardLimit: 0,
            missedPayment: false,
            clearLoans: false,
            newLoan: false,
            newCardLimit: 0,
        });
        setSelectedCardToClose('');
        setNewLoanAmount(0);
        setNewCardLimitSel(0);
    };

    const delta = simulatedScore - currentScore;

    return (
        <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full max-h-[800px]">
            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-color)]">
                <div className="flex items-center gap-2 mb-1">
                    <SlidersHorizontal size={20} className="text-[var(--color-apple-blue)]" />
                    <h3 className="font-semibold text-lg">Score Simulator</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">See how actions affect your score</p>

                <div className="mt-4 flex items-center justify-between bg-[var(--card-color)] p-3 rounded-xl border border-[var(--border-color)]">
                    <span className="text-sm font-medium">Current Score</span>
                    <span className="font-semibold">{currentScore}</span>
                </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-5">
                {/* 1. Pay Off Debt */}
                {totalCCDebt > 0 && (
                    <div className="pb-4 border-b border-[var(--border-color)]">
                        <SimulatorSlider
                            label="Pay towards cards"
                            value={changes.payCardDebt}
                            max={totalCCDebt}
                            step={1000}
                            onChange={(val) => setChanges(c => ({ ...c, payCardDebt: val }))}
                        />
                    </div>
                )}

                {/* 2. Close a Card */}
                {activeCards.length > 0 && (
                    <div className="pb-4 border-b border-[var(--border-color)]">
                        <label className="text-sm font-medium block mb-2">Close a Credit Card</label>
                        <select
                            className="w-full p-2 text-sm rounded bg-[var(--bg-color)] border border-[var(--border-color)] outline-none"
                            value={selectedCardToClose}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedCardToClose(val);
                                if (!val) {
                                    setChanges(c => ({ ...c, closedCardLimit: 0, closedOldestCard: false }));
                                } else {
                                    const card = activeCards.find(c => c.card_name === val);
                                    // simplistic checking for oldest card (naive)
                                    const isOldest = activeCards.every(c => c.open_date >= card.open_date);
                                    setChanges(c => ({ ...c, closedCardLimit: card.limit, closedOldestCard: isOldest }));
                                }
                            }}
                        >
                            <option value="">None</option>
                            {activeCards.map(c => (
                                <option key={c.card_name} value={c.card_name}>{c.bank} {c.card_name} (Limit: ₹{formatINR(c.limit)})</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 3. Take New Loan */}
                <div className="pb-4 border-b border-[var(--border-color)]">
                    <label className="flex items-center justify-between text-sm font-medium mb-2 cursor-pointer">
                        <span>Take a New Loan</span>
                        <input
                            type="checkbox"
                            checked={changes.newLoan}
                            onChange={(e) => setChanges(c => ({ ...c, newLoan: e.target.checked }))}
                            className="accent-[var(--color-apple-blue)] w-4 h-4"
                        />
                    </label>
                    {changes.newLoan && (
                        <select
                            className="w-full p-2 text-sm rounded bg-[var(--bg-color)] border border-[var(--border-color)] outline-none animate-in fade-in"
                            value={newLoanAmount}
                            onChange={(e) => setNewLoanAmount(Number(e.target.value))}
                        >
                            <option value="100000">₹1 Lakh</option>
                            <option value="300000">₹3 Lakhs</option>
                            <option value="500000">₹5 Lakhs</option>
                            <option value="1000000">₹10 Lakhs</option>
                        </select>
                    )}
                </div>

                {/* 4. Miss a Payment */}
                <div className="pb-4 border-b border-[var(--border-color)]">
                    <label className="flex items-center justify-between text-sm font-medium cursor-pointer text-red-500">
                        <span>Miss a Payment (30+ days)</span>
                        <input
                            type="checkbox"
                            checked={changes.missedPayment}
                            onChange={(e) => setChanges(c => ({ ...c, missedPayment: e.target.checked }))}
                            className="accent-red-500 w-4 h-4"
                        />
                    </label>
                </div>

                {/* 5. Clear All Loans */}
                <div className="pb-4 border-b border-[var(--border-color)]">
                    <label className="flex items-center justify-between text-sm font-medium cursor-pointer">
                        <span>Clear All Outstanding Loans</span>
                        <input
                            type="checkbox"
                            checked={changes.clearLoans}
                            onChange={(e) => setChanges(c => ({ ...c, clearLoans: e.target.checked }))}
                            className="accent-[var(--color-apple-blue)] w-4 h-4"
                        />
                    </label>
                </div>

                {/* 6. Add New Credit Card */}
                <div>
                    <label className="text-sm font-medium block mb-2">Add a New Credit Card</label>
                    <select
                        className="w-full p-2 text-sm rounded bg-[var(--bg-color)] border border-[var(--border-color)] outline-none"
                        value={newCardLimitSel}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setNewCardLimitSel(val);
                            setChanges(c => ({ ...c, newCardLimit: val, newEnquiry: val > 0 }));
                        }}
                    >
                        <option value="0">None</option>
                        <option value="50000">Limit: ₹50K</option>
                        <option value="100000">Limit: ₹1L</option>
                        <option value="200000">Limit: ₹2L</option>
                        <option value="500000">Limit: ₹5L</option>
                    </select>
                </div>
            </div>

            <div className="p-4 bg-[var(--bg-color)] border-t border-[var(--border-color)]">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Simulated Score</span>
                    <div className="flex items-center gap-2">
                        {delta !== 0 && (
                            <span className={`text-sm font-bold animate-in zoom-in ${delta > 0 ? "text-green-500" : "text-red-500"}`}>
                                {delta > 0 ? '+' : ''}{delta}
                            </span>
                        )}
                        <span className={`text-3xl font-bold ${isAnimating ? "animate-pulse" : ""} ${delta > 0 ? "text-green-500" : delta < 0 ? "text-red-500" : ""}`}>
                            {displayScore}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleReset}
                    className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-color)] rounded-lg transition-colors border border-transparent hover:border-[var(--border-color)]"
                >
                    <RotateCcw size={16} /> Reset All
                </button>
                <p className="text-[10px] text-[var(--text-secondary)] mt-3 text-center opacity-70">
                    Simulated scores are estimates for educational purposes. Actual CIBIL scores may vary.
                </p>
            </div>
        </div>
    );
}
