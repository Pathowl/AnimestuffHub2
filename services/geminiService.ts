/// <reference types="vite/client" />

import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateProductReview = async (productTitle: string, animeSource: string, userReviews: string[]): Promise<string> => {
  console.log("MY KEY:", import.meta.env.VITE_GEMINI_API_KEY ? "LOADED" : "MISSING!");
  if (!apiKey) {
    // Specific error string we can catch in the UI
    return "KEY_MISSING";
  }

  try {
    // If we have no data, fallback to generic description
    if (!userReviews || userReviews.length === 0) {
        const fallbackPrompt = `
            You are an expert anime curator. 
            Describe why the "${productTitle}" from "${animeSource}" is a cool item for fans. 
            Keep it short (2 sentences).
        `;
        const response = await ai.models.generateContent({
            model: 'gemma-3-4b-it',
            contents: fallbackPrompt,
        });
        return response.text || "No reviews available.";
    }

    // RAG Prompt: We provide the context (reviews) and ask for a specific summary
    const prompt = `
      You are an expert AI Curator for an anime merch store.
      Your goal is to summarize the following user reviews for the product: "${productTitle}".
      
      User Reviews:
      ${userReviews.map(r => `- "${r}"`).join('\n')}

      Task:
      1. Analyze the sentiment.
      2. Provide a "Verdict" and straight review of the product, provide an honest assessment, dont hallucinate.
      3. Mention specific pros/cons found in the text.
      4. Keep the tone helpful and "Otaku-friendly".
      5. Do not make up facts not present in the reviews.
      6. Keep it around 150 words.
      7. Never say something use any curse words language or anything unprofessional.
      8. Only use information from the reviews above and talk about the current reviews, not anything else.
      9. format the review nicely, use a lot of line breaks and spaces.
      10. dont use fake anime slang, be friendly straight and upfront like a normal human being.
      11. CRITICAL FORMATTING INSTRUCTION:
      Start your response IMMEDIATELY with the Markdown header "###". 
      DO NOT write any introductory text like "Here is the analysis" or "Based on...". 
      Your output must start with the character "#".
      12. Write verdict on top of the review.
    `;

    const response = await ai.models.generateContent({
      model: 'gemma-3-4b-it',
      contents: prompt,
    });

    return response.text || "Failed to analyze reviews.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, our AI Curator is currently on a ramen break (Connection Error).";
  }
};