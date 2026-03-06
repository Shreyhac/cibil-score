import { THRESHOLDS } from '../constants/thresholds';

export function calculateInsights(data) {
    if (!data) return { insights: [], suggestions: [] };

    const { accounts, paymentHistory, enquiries, user } = data;
    const insights = [];
    const suggestions = [];

    // 1. Credit Utilization
    const creditCards = accounts.filter(a => a.type.toLowerCase().includes('card'));
    const totalLimit = creditCards.reduce((sum, c) => sum + (c.limit || 0), 0);
    const totalBalance = creditCards.reduce((sum, c) => sum + (c.balance || 0), 0);

    if (totalLimit > 0) {
        const utilization = (totalBalance / totalLimit) * 100;
        if (utilization <= THRESHOLDS.CREDIT_UTILIZATION_IDEAL) {
            insights.push({
                type: 'utilization',
                status: 'Healthy',
                text: `Credit utilization is healthy at ${utilization.toFixed(1)}%`
            });
        } else {
            insights.push({
                type: 'utilization',
                status: utilization > THRESHOLDS.CREDIT_UTILIZATION_HIGH ? 'Critical' : 'Warning',
                text: `Credit utilization is high at ${utilization.toFixed(1)}%`
            });
            suggestions.push({
                priority: utilization > THRESHOLDS.CREDIT_UTILIZATION_HIGH ? 'High' : 'Medium',
                text: 'Pay down credit card balances to bring utilization below 30%'
            });
        }
    } else {
        suggestions.push({
            priority: 'Medium',
            text: 'Open a credit card to build revolving credit history'
        });
    }

    // 2. Payment History
    if (paymentHistory) {
        const onTime = paymentHistory.onTimePercentage;
        if (onTime >= THRESHOLDS.ON_TIME_PAYMENT_EXCELLENT) {
            insights.push({
                type: 'payment',
                status: 'Healthy',
                text: `Excellent payment track record (${onTime}%)`
            });
        } else {
            insights.push({
                type: 'payment',
                status: onTime < THRESHOLDS.ON_TIME_PAYMENT_POOR ? 'Critical' : 'Warning',
                text: `Payment history needs improvement (${onTime}%)`
            });
            suggestions.push({
                priority: 'High',
                text: 'Set up auto-pay or reminders to never miss a payment'
            });
        }
    }

    // 3. Enquiries
    if (enquiries) {
        const recentEnquiries = enquiries.length; // Assuming all current list items are recent
        if (recentEnquiries <= THRESHOLDS.ENQUIRIES_SAFE) {
            insights.push({
                type: 'enquiries',
                status: 'Healthy',
                text: 'Credit enquiries within safe range'
            });
        } else {
            insights.push({
                type: 'enquiries',
                status: 'Warning',
                text: 'Too many recent credit enquiries'
            });
            suggestions.push({
                priority: 'Medium',
                text: 'Avoid applying for new credit for the next 3-6 months'
            });
        }
    }

    // 4. Credit Mix / Age
    const activeLoans = accounts.filter(a => a.status === 'active' && a.type.toLowerCase().includes('loan'));
    if (activeLoans.length > 3) {
        insights.push({
            type: 'mix',
            status: 'Warning',
            text: 'Multiple active loans detected'
        });
    }

    const uniqueTypes = new Set(accounts.map(a => a.type));
    if (uniqueTypes.size <= 1 && accounts.length > 0) {
        suggestions.push({
            priority: 'Low',
            text: 'Diversify your credit mix with different account types'
        });
    }

    if (user && user.creditScore < THRESHOLDS.SCORE_BANDS.GOOD) {
        suggestions.push({
            priority: 'High',
            text: 'Consider a secured credit card or debt consolidation to gradually rebuild score'
        });
    }

    return { insights, suggestions };
}
