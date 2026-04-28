export const generateProductReview = async (
  productTitle: string,
  animeSource: string,
  userReviews: string[]
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productTitle, animeSource, userReviews })
    });

    if (!response.ok) {
      const err = await response.json();
      if (err.error === 'KEY_MISSING') return 'KEY_MISSING';
      return 'Sorry, our AI Curator is currently on a ramen break (Connection Error).';
    }

    const data = await response.json();
    return data.review || 'Failed to analyze reviews.';

  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Sorry, our AI Curator is currently on a ramen break (Connection Error).';
  }
};