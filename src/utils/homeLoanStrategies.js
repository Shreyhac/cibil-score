// Utility to format INR
export const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount));
};

// Calculate total interest saved by prepayment
// Simplified approximation for demonstration
function calculatePrepaymentSavings(loan, annualPrepayment) {
    if (!loan || !annualPrepayment) return 0;

    // Approximation: Every 1 rupee prepaid early saves roughly 1-2 rupees in interest over a 20yr loan
    // Very coarse approximation
    const yearsRemaining = loan.tenure_months / 12;
    let savingsRatio = 1.0;
    if (yearsRemaining > 15) savingsRatio = 1.8;
    else if (yearsRemaining > 10) savingsRatio = 1.2;
    else if (yearsRemaining > 5) savingsRatio = 0.6;
    else savingsRatio = 0.2;

    return formatINR(annualPrepayment * savingsRatio * (yearsRemaining / 2));
}

function estimateTenureReduction(loan, annualPrepayment) {
    // Rough estimate
    const proportion = annualPrepayment / loan.outstanding;
    const monthsSaved = Math.round(loan.tenure_months * proportion * 1.5);
    return Math.min(monthsSaved, loan.tenure_months - 12);
}

function calculate25bpsSavings(loan) {
    // 0.25% savings on outstanding approximated over tenure
    const yearsRemaining = loan.tenure_months / 12;
    const savings = loan.outstanding * 0.0025 * (yearsRemaining * 0.6); // 0.6 is reducing balance factor
    return formatINR(savings);
}

function calculateHigherEMISavings(loan) {
    // 10% higher EMI savings approx
    const extraPerMonth = loan.emi * 0.1;
    const yearsRemaining = loan.tenure_months / 12;
    const savings = extraPerMonth * 12 * yearsRemaining * 0.8;
    return formatINR(savings);
}

export function generateHomeLoanStrategies(loan, score) {
    const strategies = [];

    // Strategy 1: Prepayment
    strategies.push({
        title: "Make Annual Prepayments",
        description: `Even ₹${formatINR(loan.emi * 2)} extra per year towards principal can save you approx ₹${calculatePrepaymentSavings(loan, loan.emi * 2)} in total interest and reduce tenure by roughly ${estimateTenureReduction(loan, loan.emi * 2)} months.`,
        savings: calculatePrepaymentSavings(loan, loan.emi * 2),
        difficulty: "Easy",
        icon: "💰"
    });

    // Strategy 2: Rate Negotiation
    if (score >= 750) {
        strategies.push({
            title: "Negotiate a Lower Interest Rate",
            description: `With a score of ${score}, you're in a strong position to negotiate. A 0.25% reduction on ₹${formatINR(loan.outstanding)} could save approx ₹${calculate25bpsSavings(loan)} over the remaining tenure.`,
            savings: calculate25bpsSavings(loan),
            difficulty: "Medium",
            icon: "📞"
        });
    }

    // Strategy 3: Balance Transfer
    strategies.push({
        title: "Explore Balance Transfer to Another Bank",
        description: "Compare current rate with offers from SBI, HDFC, ICICI, Kotak. Even a 0.3-0.5% lower rate on a large outstanding can save lakhs.",
        savings: "Varies",
        difficulty: "Medium",
        icon: "🏦"
    });

    // Strategy 4: Switch to Lower Tenure
    strategies.push({
        title: "Increase EMI to Reduce Tenure",
        description: `Increasing EMI by 10% (₹${formatINR(loan.emi * 0.1)}/month more) could reduce total interest by approximately ₹${calculateHigherEMISavings(loan)} and cut tenure significantly.`,
        savings: calculateHigherEMISavings(loan),
        difficulty: "Easy",
        icon: "⏱️"
    });

    // Strategy 5: Tax Benefits
    strategies.push({
        title: "Maximize Tax Benefits (80C + 24b)",
        description: "Claim up to ₹1.5L on principal (Section 80C) and ₹2L on interest (Section 24b). If co-owned, both owners can claim separately — doubling the benefit.",
        savings: "Up to ₹3.5L/year tax deduction",
        difficulty: "Easy",
        icon: "📋"
    });

    return strategies;
}
