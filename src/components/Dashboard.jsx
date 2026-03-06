import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import ScoreCard from './ScoreCard';
import CreditUtilization from './CreditUtilization';
import AccountSummary from './AccountSummary';
import LoanTracker from './LoanTracker';
import PaymentHistory from './PaymentHistory';
import EnquiryTracker from './EnquiryTracker';
import HealthInsights from './HealthInsights';
import Suggestions from './Suggestions';
import HistoricTrends from './trends/HistoricTrends';
import ScoreRoadmap from './trends/ScoreRoadmap';
import AILoanOptimizer from './ai/AILoanOptimizer';
import AISpendAdvisor from './ai/AISpendAdvisor';
import AIHomeLoanAdvisor from './ai/AIHomeLoanAdvisor';
import ExportPDF from './ExportPDF';

export default function Dashboard({ data }) {
    const contentRef = useRef(null);

    const handleExport = async () => {
        const element = contentRef.current;
        if (!element) return;

        // Workaround for Recharts with html2canvas (fixes the hang/crash issue)
        // Freeze the pixel dimensions before cloning so ResponsiveContainer doesn't collapse
        const rechartsContainers = element.querySelectorAll('.recharts-responsive-container');
        const originalStyles = [];
        rechartsContainers.forEach(container => {
            const rect = container.getBoundingClientRect();
            originalStyles.push({
                width: container.style.width,
                height: container.style.height
            });
            container.style.width = `${rect.width}px`;
            container.style.height = `${rect.height}px`;
        });

        const opt = {
            margin: 10,
            filename: `credit-report-${data.user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } finally {
            // Restore responsive styles
            rechartsContainers.forEach((container, idx) => {
                container.style.width = originalStyles[idx].width;
                container.style.height = originalStyles[idx].height;
            });
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-8 border-b border-[var(--border-color)] pb-6">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Credit Dashboard</h2>
                    <p className="text-[var(--text-secondary)] mt-1">Hello, {data.user.name}</p>
                </div>
                <ExportPDF onExport={handleExport} />
            </div>

            <div id="pdf-content" ref={contentRef} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <ScoreCard score={data.user.creditScore} bureau={data.user.bureau} />
                    <div className="flex flex-col gap-6">
                        <PaymentHistory pct={data.paymentHistory.onTimePercentage} total={data.paymentHistory.totalPayments} />
                        <CreditUtilization accounts={data.accounts} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <HealthInsights data={data} />
                        <AccountSummary accounts={data.accounts} />
                        <LoanTracker accounts={data.accounts} />
                        <HistoricTrends history={data.scoreHistory} />

                        <div id="roadmap" className="scroll-mt-6">
                            <ScoreRoadmap currentScore={data.user.creditScore} />
                        </div>

                        <div id="ai-insights" className="scroll-mt-6 space-y-6">
                            <AILoanOptimizer activeAccounts={data.accounts} currentScore={data.user.creditScore} />
                            <AISpendAdvisor activeAccounts={data.accounts} />
                            <AIHomeLoanAdvisor activeAccounts={data.accounts} currentScore={data.user.creditScore} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <EnquiryTracker enquiries={data.enquiries} />
                        <Suggestions data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
