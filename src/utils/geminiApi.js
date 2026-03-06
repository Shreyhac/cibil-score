export async function fetchGeminiInsights(apiKey, reportData) {
    if (!apiKey) throw new Error('API Key is required');

    const summary = JSON.stringify({
        score: reportData.user.creditScore,
        accountsCount: reportData.accounts.length,
        paymentHistory: reportData.paymentHistory.onTimePercentage,
        enquiriesCount: reportData.enquiries.length
    });

    const prompt = `You are an expert credit analyst. Analyze this credit report summary:
${summary}

Provide exactly 3-4 personalized financial improvement suggestions based on this specific data.
Output strictly as a JSON array of objects, with each object matching this schema:
{
  "priority": "High" | "Medium" | "Low",
  "text": "The actionable advice in 1-2 sentences"
}
ONLY return the raw JSON array. Do not include markdown formatting or backticks.`;

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

    try {
        let cleanText = text.trim();
        // Remove markdown formatting if the model still adds it
        if (cleanText.startsWith('\`\`\`json')) cleanText = cleanText.slice(7);
        if (cleanText.startsWith('\`\`\`')) cleanText = cleanText.slice(3);
        if (cleanText.endsWith('\`\`\`')) cleanText = cleanText.slice(0, -3);

        return JSON.parse(cleanText.trim());
    } catch (e) {
        throw new Error('Failed to parse AI response into instructions');
    }
}
