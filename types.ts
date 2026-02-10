export enum Category {
  FIGURES = 'Figures',
  COSPLAY_PROPS = 'Cosplay & Props',
  STREETWEAR = 'Streetwear',
  TECH_RGB = 'Tech & RGB',
  PLUSHIES = 'Plushies',
  JEWELRY = 'Jewelry',
  OTHERS = 'Others'
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  rating: number;
  reviewsCount: number;
  userReviews: string[];
  affiliateLink: string;
  animeSource: string;
}

export interface AiReviewState {
  isOpen: boolean;
  loading: boolean;
  content: string | null;
  productName: string | null;
  productImage: string;
  sourceReviews?: string[]; // Added to store the raw input data
}

// Raw product data structure we get from Ali API, before mapping it to our internal Product type
export interface AliRawProduct {
  product_id: number;
  product_title: string;
  target_sale_price: string;
  target_original_price: string;
  product_main_image_url: string;
  promotion_link: string;
  evaluate_rate: string;
  last_volume: string;
  // Ali's response can have many more fields, but these are the ones we're interested in for our product display. We can always add more fields here if we want to use them later.
  second_level_category_name?: string;
  discount?: string;
}