// Reusable OpenAI API caller
export async function callGemini(apiKey, prompt) {
    if (!apiKey) throw new Error("No API key provided");

    const response = await fetch(
        `https://api.groq.com/openai/v1/chat/completions`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 2048
            })
        }
    );

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    // Clean and parse JSON response
    let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Try to find the JSON string if there is any extra text
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');

    let startIndex = -1;
    let isArray = false;

    if (firstBrace !== -1 && firstBracket !== -1) {
        if (firstBrace < firstBracket) {
            startIndex = firstBrace;
        } else {
            startIndex = firstBracket;
            isArray = true;
        }
    } else if (firstBrace !== -1) {
        startIndex = firstBrace;
    } else if (firstBracket !== -1) {
        startIndex = firstBracket;
        isArray = true;
    }

    if (startIndex !== -1) {
        const lastBrace = cleaned.lastIndexOf('}');
        const lastBracket = cleaned.lastIndexOf(']');
        let endIndex = isArray ? lastBracket : lastBrace;
        if (endIndex !== -1) {
            cleaned = cleaned.substring(startIndex, endIndex + 1);
        }
    }

    return JSON.parse(cleaned);
}
