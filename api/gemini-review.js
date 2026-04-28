export default async function handler(req, res) {
  // only post
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productTitle, animeSource, userReviews } = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'KEY_MISSING' });
  }

  const prompt = (!userReviews || userReviews.length === 0)
    ? `
        You are an expert anime curator. 
        Describe why the "${productTitle}" from "${animeSource}" is a cool item for fans. 
        Keep it short (2 sentences).
      `
    : `
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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'No response from Gemini' });
    }

    return res.status(200).json({ review: text });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}