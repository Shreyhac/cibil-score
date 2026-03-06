import { THRESHOLDS } from '../constants/thresholds';

export function getScoreCategory(score) {
    if (!score || typeof score !== 'number') return { label: 'Unknown', color: 'var(--text-secondary)' };

    if (score >= THRESHOLDS.SCORE_BANDS.EXCELLENT) {
        return { label: 'Excellent', color: 'var(--color-score-excellent)' };
    }
    if (score >= THRESHOLDS.SCORE_BANDS.VERY_GOOD) {
        return { label: 'Very Good', color: 'var(--color-score-verygood)' };
    }
    if (score >= THRESHOLDS.SCORE_BANDS.GOOD) {
        return { label: 'Good', color: 'var(--color-score-good)' };
    }
    if (score >= THRESHOLDS.SCORE_BANDS.FAIR) {
        return { label: 'Fair', color: 'var(--color-score-fair)' };
    }
    return { label: 'Poor', color: 'var(--color-score-poor)' };
}
