import { CIBIL_WEIGHTS } from '../constants/cibilWeights';

// Simplified simulation model
export function simulateScore(currentScore, currentData, changes) {
    let delta = 0;

    // Utilization impact (25% weight)
    // Calculate current util from outstanding balances / limits
    let totalLimit = 0;
    let totalBalance = 0;

    currentData.accounts.forEach(acc => {
        if (acc.type === 'credit_card' && acc.status === 'active') {
            totalLimit += acc.limit || 0;
            totalBalance += acc.balance || 0;
        }
    });

    const currentUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

    let newBalance = totalBalance;
    let newLimit = totalLimit;

    if (changes.payCardDebt) {
        newBalance = Math.max(0, totalBalance - changes.payCardDebt);
    }
    if (changes.closedCardLimit) {
        newLimit = Math.max(0, totalLimit - changes.closedCardLimit);
        // balance might already be 0 for closed card, or it shifts
    }
    if (changes.newCardLimit) {
        newLimit += changes.newCardLimit;
    }
    if (changes.clearLoans) {
        // Impacts utilization if loan was considered, but CIBIL mostly uses CC for util.
        // We will add a flat bonus for clearing loans.
    }

    const newUtil = newLimit > 0 ? (newBalance / newLimit) * 100 : 0;

    const utilDelta = (currentUtil - newUtil) * 0.8; // ~0.8 points per 1% reduction
    delta += utilDelta * (CIBIL_WEIGHTS.UTILIZATION / 100) * 4; // weighted

    // Payment history impact (30% weight)
    if (changes.missedPayment) {
        const paymentDrop = currentData.paymentHistory.onTimePercentage > 95 ? -25 : -15;
        delta += paymentDrop;
    }

    // Credit age impact (25% weight)
    if (changes.closedOldestCard) {
        const ageDrop = -15; // based on age difference approx
        delta += ageDrop * (CIBIL_WEIGHTS.CREDIT_AGE / 100) * 4;
    }

    // Enquiry impact (10% weight)
    if (changes.newEnquiry) {
        delta -= 8; // per new enquiry
    }

    // Credit mix impact (10% weight)
    if (changes.newLoan) {
        delta -= 8; // Enquiry hit

        // Check if they had no loans before
        const hasLoan = currentData.accounts.some(a => ['personal_loan', 'home_loan'].includes(a.type) && a.status === 'active');
        if (!hasLoan) {
            delta += 10; // Improved mix
        }
    }

    if (changes.clearLoans) {
        delta += 45; // Major positive
        delta -= 5;  // Minor negative for reduced mix
    }

    return Math.round(Math.max(300, Math.min(900, currentScore + delta)));
}
