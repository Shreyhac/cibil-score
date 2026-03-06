import React from 'react';

export default function LoanTracker({ accounts }) {
    const loans = accounts.filter(a => a.type.toLowerCase().includes('loan'));

    if (!loans || loans.length === 0) return null;

    const totalOutstanding = loans.reduce((sum, l) => sum + (l.outstanding || 0), 0);
    const totalEMI = loans.reduce((sum, l) => sum + (l.emi || 0), 0);

    return (
        <div className="apple-card overflow-hidden">
            <h3 className="text-xl font-semibold tracking-tight mb-4">Loan & EMI Tracker</h3>

            <div className="space-y-4 mb-6">
                {loans.map((loan, idx) => {
                    const progress = loan.loanAmount ? (loan.outstanding / loan.loanAmount) * 100 : 0;
                    return (
                        <div key={idx} className="border border-[var(--border-color)] p-4 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-semibold text-sm">{loan.bank} {loan.type.replace(/_/g, ' ')}</h4>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${loan.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                        {loan.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-[var(--text-secondary)]">EMI</div>
                                    <div className="font-semibold">₹{(loan.emi || 0).toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-[var(--text-secondary)]">Outstanding: ₹{(loan.outstanding || 0).toLocaleString('en-IN')}</span>
                                    <span className="text-[var(--text-secondary)]">Total: ₹{(loan.loanAmount || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--border-color)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--color-apple-blue)] transition-all duration-1000"
                                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-[var(--bg-color)] p-4 rounded-xl flex justify-between items-center shadow-inner">
                <div>
                    <span className="text-xs text-[var(--text-secondary)] block">Total Outstanding Debt</span>
                    <span className="font-semibold text-lg tracking-tight">₹{totalOutstanding.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-[var(--text-secondary)] block">Total Monthly EMI</span>
                    <span className="font-semibold text-lg tracking-tight text-[var(--color-score-poor)]">₹{totalEMI.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    );
}
