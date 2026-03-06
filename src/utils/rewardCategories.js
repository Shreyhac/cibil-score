export const cardRewards = {
    "HDFC": {
        "Regalia": { dining: 4, travel: 4, grocery: 2, online: 2, default: 1 },
        "Infinia": { travel: 5, dining: 5, grocery: 3, online: 3, default: 2 },
        "Millennia": { online: 5, grocery: 2, default: 1 },
        "default": { dining: 2, travel: 2, online: 2, grocery: 1, default: 1 }
    },
    "ICICI": {
        "Amazon Pay": { amazon: 5, bills: 2, online: 2, default: 1 },
        "Coral": { dining: 3, grocery: 3, default: 1 },
        "default": { dining: 2, online: 2, default: 1 }
    },
    "Axis": {
        "Flipkart": { flipkart: 5, online: 4, default: 1.5 },
        "Magnus": { travel: 5, dining: 5, default: 2 },
        "default": { online: 3, dining: 2, default: 1 }
    },
    "SBI": {
        "SimplyCLICK": { online: 10, default: 1 },
        "default": { fuel: 5, default: 1 }
    },
    "Kotak": {
        "default": { dining: 3, online: 2, default: 1 }
    },
    "Amex": {
        "default": { travel: 5, dining: 5, grocery: 3, default: 1 }
    }
};

export const spendCategories = [
    { id: "dining", label: "Dining & Restaurants", icon: "🍽️" },
    { id: "travel", label: "Travel & Hotels", icon: "✈️" },
    { id: "grocery", label: "Grocery & Supermarket", icon: "🛒" },
    { id: "online", label: "Online Shopping", icon: "🛍️" },
    { id: "fuel", label: "Fuel & Transport", icon: "⛽" },
    { id: "bills", label: "Utility Bills", icon: "📱" },
    { id: "amazon", label: "Amazon", icon: "📦" },
    { id: "flipkart", label: "Flipkart", icon: "🛒" },
    { id: "entertainment", label: "Entertainment & OTT", icon: "🎬" }
];
