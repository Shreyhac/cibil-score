import React, { createContext, useState, useContext } from 'react';

const AIContext = createContext();

export function GeminiProvider({ children }) {
    // Read the API key from the local environment variable
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_GROQ_API_KEY || '');

    return (
        <AIContext.Provider value={{ apiKey, setApiKey }}>
            {children}
        </AIContext.Provider>
    );
}

export function useGemini() {
    return useContext(AIContext);
}
