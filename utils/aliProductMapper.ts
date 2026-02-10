import { Product, Category, AliRawProduct } from '../types'; // raw clean types

// guessing category function
const guessCategory = (title: string): Category => {
  const t = title.toLowerCase();
  if (t.includes('hoodie') || t.includes('shirt') || t.includes('jacket')) return Category.STREETWEAR;
  if (t.includes('plush') || t.includes('doll') || t.includes('toy')) return Category.PLUSHIES;
  if (t.includes('sword') || t.includes('katana') || t.includes('wig') || t.includes('costume')) return Category.COSPLAY_PROPS;
  if (t.includes('ring') || t.includes('necklace')) return Category.JEWELRY;
  if (t.includes('neon') || t.includes('lamp') || t.includes('led')) return Category.TECH_RGB;
  
  return Category.FIGURES; // default to figures if no keywords matched, since it's the most common type of merch.
};

// guessing anime source function
const guessAnimeSource = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('naruto')) return 'Naruto';
  if (t.includes('piece')) return 'One Piece';
  if (t.includes('demon slayer') || t.includes('yaiba')) return 'Demon Slayer';
  if (t.includes('titan')) return 'Attack on Titan';
  if (t.includes('genshin')) return 'Genshin Impact';
  if (t.includes('chainsaw')) return 'Chainsaw Man';
  if (t.includes('berserk')) return 'Berserk';
  return 'Anime'; // default
};

// MAIN MAPPER
export const mapAliToProduct = (aliItem: AliRawProduct): Product => {
  return {
    id: String(aliItem.product_id), // string id for consistency with other sources
    
    title: aliItem.product_title,
    
    // Parsing prices, handling potential missing original price
    price: parseFloat(aliItem.target_sale_price),
    originalPrice: aliItem.target_original_price ? parseFloat(aliItem.target_original_price) : undefined,
    
    image: aliItem.product_main_image_url,
    
    // smart guessing functions for category and anime source based on title keywords
    category: guessCategory(aliItem.product_title),
    animeSource: guessAnimeSource(aliItem.product_title),
    
    rating: parseFloat(aliItem.evaluate_rate) || 0,
    reviewsCount: parseInt(aliItem.last_volume) || 0,
    
    // blank user reviews since we don't have them from Ali, but we could potentially generate them later with AI if needed
    userReviews: [], 
    
    affiliateLink: aliItem.promotion_link
  };
};