import { Category, Product } from './types';

export const POPULAR_SERIES = [
  'One Piece',
  'Naruto',
  'Demon Slayer',
  'Attack on Titan',
  'Genshin Impact',
  'Chainsaw Man',
  'Berserk',
  'Jujutsu Kaisen', // Added for future proofing
  'Dragon Ball Z',
  "Bleach",
  "Pokemon" // Added for future proofing
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Gear 5 Luffy Nika Statue 28cm PVC',
    price: 145.99,
    originalPrice: 220.00,
    image: 'https://picsum.photos/400/400?random=1',
    category: Category.FIGURES,
    rating: 4.9,
    reviewsCount: 1204,
    userReviews: [
      "The painting details are insane for this price point!",
      "Box arrived slightly damaged but the figure was intact.",
      "The lightning effects are a bit fragile, be careful when assembling.",
      "Best Gear 5 figure I've seen on AliExpress, looks exactly like the photos.",
      "Shipping took 3 weeks but worth the wait."
    ],
    affiliateLink: '#',
    animeSource: 'One Piece'
  },
  {
    id: '2',
    title: 'Zoro Enma Katana Metal Replica 104cm',
    price: 89.50,
    originalPrice: 110.00,
    image: 'https://picsum.photos/400/400?random=2',
    category: Category.COSPLAY_PROPS,
    rating: 4.7,
    reviewsCount: 856,
    userReviews: [
      "Heavy weight, feels real. Not sharp (good for cons).",
      "The purple hilt wrap is a bit loose.",
      "Perfect for my Wano arc cosplay.",
      "Metal blade is high quality carbon steel."
    ],
    affiliateLink: '#',
    animeSource: 'One Piece'
  },
  {
    id: '3',
    title: 'Naruto Akatsuki Cloud Oversized Hoodie',
    price: 35.00,
    image: 'https://picsum.photos/400/400?random=3',
    category: Category.STREETWEAR,
    rating: 4.5,
    reviewsCount: 3402,
    userReviews: [
      "Order one size up for that oversized look! Shrinks a bit.",
      "Embroidery is actually stitched, not printed. Huge plus.",
      "Fabric is kinda thin, good for spring but not winter.",
      "Zipper feels cheap but the aesthetic is 10/10."
    ],
    affiliateLink: '#',
    animeSource: 'Naruto'
  },
  {
    id: '4',
    title: 'Genshin Impact Vision Amulet Necklace',
    price: 4.99,
    image: 'https://picsum.photos/400/400?random=4',
    category: Category.JEWELRY,
    rating: 4.8,
    reviewsCount: 5000,
    userReviews: [
      "Glows in the dark if you charge it with UV light.",
      "Heavy metal frame, glass gem. Very high quality.",
      "Chain is a bit short, I replaced it with my own."
    ],
    affiliateLink: '#',
    animeSource: 'Genshin Impact'
  },
  {
    id: '5',
    title: 'Rengoku Kyojuro Flame Hashira Figure',
    price: 65.00,
    originalPrice: 80.00,
    image: 'https://picsum.photos/400/400?random=5',
    category: Category.FIGURES,
    rating: 4.9,
    reviewsCount: 430,
    userReviews: [
      "Set your heart ablaze! This figure is fire.",
      "Cape is detachable.",
      "Face sculpt is perfect, looks just like the movie."
    ],
    affiliateLink: '#',
    animeSource: 'Demon Slayer'
  },
  {
    id: '6',
    title: 'Attack on Titan Scout Regiment Cloak',
    price: 22.90,
    image: 'https://picsum.photos/400/400?random=6',
    category: Category.COSPLAY_PROPS,
    rating: 4.6,
    reviewsCount: 1120,
    userReviews: [
      "Button fell off immediately.",
      "Wings of Freedom logo is high quality print.",
      "A bit short for anyone over 6ft."
    ],
    affiliateLink: '#',
    animeSource: 'Attack on Titan'
  },
  {
    id: '7',
    title: 'Pochita Chainsaw Man Plushie 40cm',
    price: 18.99,
    image: 'https://picsum.photos/400/400?random=7',
    category: Category.PLUSHIES,
    rating: 5.0,
    reviewsCount: 2100,
    userReviews: [
      "So soft! My dog loves it too.",
      "Chainsaw part is soft felt, safe for kids.",
      "Smaller than expected, measure before buying."
    ],
    affiliateLink: '#',
    animeSource: 'Chainsaw Man'
  },
  {
    id: '8',
    title: 'Berserk Brand of Sacrifice Neon LED Sign',
    price: 45.00,
    image: 'https://picsum.photos/400/400?random=8',
    category: Category.TECH_RGB,
    rating: 4.8,
    reviewsCount: 150,
    userReviews: [
      "Red color is super vibrant, looks evil in the dark (in a good way).",
      "USB powered, cable is long enough.",
      "Perfect for my PC setup background.",
      "Dimmable switch included."
    ],
    affiliateLink: '#',
    animeSource: 'Berserk'
  },
];