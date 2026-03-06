export async function fetchGeminiInsights(apiKey, reportData) {
    if (!apiKey) throw new Error('API Key is required');

    const summary = JSON.stringify({
        score: reportData.user.creditScore,
        accountsCount: reportData.accounts.length,
        paymentHistory: reportData.paymentHistory.onTimePercentage,
        enquiriesCount: reportData.enquiries.length
    });

    const prompt = `Analyze this credit report summary and provide 3-5 personalized financial improvement suggestions in plain text (bullet points): ${summary}`;

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error?.message || 'Failed to fetch from API');
    }
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Invalid response structure');

    return text;
}
