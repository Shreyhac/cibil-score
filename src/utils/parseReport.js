/**
 * Parses any generic JSON structure and attempts to format it
 * cleanly to match our internal expected format.
 * Returns null if the JSON doesn't contain enough valid credit data.
 */
export function parseReport(data) {
    if (!data || typeof data !== 'object') return null;

    try {
        const user = data.user || data.userInfo || data.profile || {};
        const rawAccounts = data.accounts || data.credit_accounts || data.tradelines || [];
        const paymentHistory = data.payment_history || data.payment_records || {};
        const enquiries = data.credit_enquiries || data.inquiries || data.recent_enquiries || [];
        const scoreHistory = data.score_history || data.historical_scores || [];

        // Parse Score
        const creditScore = user.credit_score || user.score || data.score || data.creditScore || null;
        const bureau = user.bureau || data.bureau || 'Unknown Bureau';

        // Normalize Accounts
        const accounts = Array.isArray(rawAccounts) ? rawAccounts.map(acc => {
            return {
                type: acc.type || acc.account_type || 'other',
                bank: acc.bank || acc.institution_name || acc.financier || 'Unknown',
                limit: acc.limit || acc.credit_limit || acc.sanctioned_amount || acc.loan_amount || acc.principal || 0,
                balance: acc.balance || acc.current_balance || acc.outstanding || 0,
                loanAmount: acc.loan_amount || acc.sanctioned_amount || acc.principal || acc.limit || 0,
                emi: acc.emi || acc.installment_amount || 0,
                openDate: acc.open_date || acc.date_opened || null,
                status: (acc.status || acc.account_status || 'unknown').toLowerCase(),
            };
        }) : [];

        // Payment History parsing
        const onTimePercentage = paymentHistory.on_time_percentage || paymentHistory.percentage ||
            (paymentHistory.total_payments ?
                Math.round(((paymentHistory.total_payments - (paymentHistory.missed_payments || 0)) / paymentHistory.total_payments) * 100)
                : 100);

        return {
            user: {
                name: user.name || user.full_name || 'Anonymous User',
                creditScore: Number(creditScore),
                bureau: bureau
            },
            accounts,
            paymentHistory: {
                onTimePercentage: Number(onTimePercentage),
                missedPayments: paymentHistory.missed_payments || paymentHistory.missed || 0,
                totalPayments: paymentHistory.total_payments || paymentHistory.total || null,
            },
            enquiries: Array.isArray(enquiries) ? enquiries : [],
            scoreHistory: Array.isArray(scoreHistory) ? scoreHistory : []
        };
    } catch (error) {
        console.error("Error parsing report:", error);
        return null;
    }
}
