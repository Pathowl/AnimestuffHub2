import React from 'react';
import { Product } from '../types';
import { Star, ExternalLink, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAiReview: (product: Product) => void;
  onClick: (product: Product) => void; // clicking card
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAiReview, onClick }) => {
  return (
    <div 
      className="group relative bg-dark-card rounded-xl overflow-hidden border border-white/5 transition-all duration-300 flex flex-col h-full hover:border-neon-purple/30 shadow-lg hover:shadow-neon-purple/10"
    >
      {/* Discount Badge - only if there is a discount */}
      {product.originalPrice && product.originalPrice > product.price && (
        <div className="absolute top-2 right-2 bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-20 pointer-events-none">
          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
        </div>
      )}

      {/* Image Container - clickable */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-900 z-0 cursor-pointer"
        onClick={() => onClick(product)} // <--- 2. clicking the image also opens the modal
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow relative z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neon-cyan uppercase tracking-wider">{product.animeSource}</span>
          <div className="flex items-center text-yellow-500 text-xs">
            <Star className="w-3 h-3 fill-current mr-1" />
            <span>{product.rating}</span>
            <span className="text-gray-500 ml-1">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title - clickable */}
        <h3 
          className="text-gray-100 font-medium text-lg leading-tight mb-2 line-clamp-2 flex-grow group-hover:text-neon-purple transition-colors cursor-pointer"
          onClick={() => onClick(product)}
        >
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
            {/* current price */}
            <span className="text-xl font-bold text-white">
              US ${product.price.toFixed(2)}
            </span>
            
            {/* old price - only if it's higher */}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                US ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
           <button
            onClick={(e) => {
              e.stopPropagation(); // prevent opening modal when clicking AI Review
              onAiReview(product);
            }}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-dark-surface border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-medium transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Review</span>
            <span className="sm:hidden">AI</span>
          </button>
          
          <a
            href={product.affiliateLink}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // prevent opening modal when clicking Buy Now
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-neon-purple to-indigo-600 hover:from-neon-purple/90 hover:to-indigo-600/90 text-white text-sm font-bold shadow-lg transition-all hover:shadow-[0_0_15px_rgba(176,38,255,0.4)]"
          >
            <span>Buy Now</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;