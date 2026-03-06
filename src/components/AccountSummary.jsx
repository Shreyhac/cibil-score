import React from 'react';
import { CreditCard, Home, Briefcase, LayoutGrid } from 'lucide-react';

export default function AccountSummary({ accounts }) {
    if (!accounts || accounts.length === 0) return null;

    const totalLimit = accounts.reduce((sum, a) => sum + (a.limit || a.loanAmount || 0), 0);
    const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || a.outstanding || 0), 0);
    const activeCount = accounts.filter(a => a.status === 'active').length;

    const getIcon = (type) => {
        const t = type.toLowerCase();
        if (t.includes('card')) return <CreditCard size={16} className="text-blue-500" />;
        if (t.includes('home')) return <Home size={16} className="text-green-500" />;
        if (t.includes('personal') || t.includes('loan')) return <Briefcase size={16} className="text-purple-500" />;
        return <LayoutGrid size={16} className="text-gray-500" />;
    };

    const formatType = (type) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="apple-card overflow-hidden flex flex-col">
            <h3 className="text-xl font-semibold mb-4 tracking-tight">Account Summary</h3>

            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr className="text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)]">
                            <th className="pb-3 px-2 font-medium">Type</th>
                            <th className="pb-3 px-2 font-medium">Bank</th>
                            <th className="pb-3 px-2 font-medium text-right">Limit/Amount</th>
                            <th className="pb-3 px-2 font-medium text-right">Balance</th>
                            <th className="pb-3 px-2 font-medium text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {accounts.map((acc, idx) => (
                            <tr key={idx} className="hover:bg-[var(--border-color)]/20 transition-colors">
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded bg-[var(--bg-color)] shadow-sm">
                                            {getIcon(acc.type)}
                                        </div>
                                        <span className="text-sm font-medium">{formatType(acc.type)}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-sm">{acc.bank}</td>
                                <td className="py-3 px-2 text-sm text-right font-medium">₹{(acc.limit || acc.loanAmount || 0).toLocaleString('en-IN')}</td>
                                <td className="py-3 px-2 text-sm text-right font-medium">₹{(acc.balance || acc.outstanding || 0).toLocaleString('en-IN')}</td>
                                <td className="py-3 px-2 text-center">
                                    <div className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${acc.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} title={acc.status}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border-color)] grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs text-[var(--text-secondary)]">Total Credit/Loans</p>
                    <p className="font-semibold mt-1">₹{totalLimit.toLocaleString('en-IN')}</p>
                </div>
                <div className="border-l border-r border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-secondary)]">Total Owed</p>
                    <p className="font-semibold mt-1">₹{totalBalance.toLocaleString('en-IN')}</p>
                </div>
                <div>
                    <p className="text-xs text-[var(--text-secondary)]">Active Accounts</p>
                    <p className="font-semibold mt-1">{activeCount}</p>
                </div>
            </div>
        </div>
    );
}
