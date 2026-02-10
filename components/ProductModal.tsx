import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, ExternalLink, ShoppingCart, Star, Globe } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [extraDetails, setExtraDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product-details?id=${product.id}`);
        const data = await res.json();
        
        if (data.details) {
          setExtraDetails(data.details);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [product.id]);

  // CALCULATE SAVINGS IF ORIGINAL PRICE IS AVAILABLE
  const originalPrice = extraDetails?.target_original_price ? Number(extraDetails.target_original_price) : 0;
  const salePrice = extraDetails?.target_app_sale_price ? Number(extraDetails.target_app_sale_price) : product.price;
  const savings = originalPrice - salePrice;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div 
        className="relative bg-dark-card w-full max-w-5xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row max-h-[90vh] h-full md:h-auto"
        onClick={e => e.stopPropagation()} 
      >
        
        {/* Closing button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
        >
            <X className="w-6 h-6" />
        </button>

        {/* Photo gallery */}
        <div className="w-full md:w-1/2 p-6 bg-gray-900/50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 shrink-0">
          <div className="w-full aspect-square max-h-[40vh] md:max-h-[50vh] rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-6 relative">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-contain p-2 transition-all duration-500"
            />
          </div>

          {/* small photos */}
          <div className="flex gap-3 overflow-x-auto w-full pb-2 scrollbar-hide px-2">
            {/* main photo */}
            <button 
              onClick={() => setActiveImage(product.image)}
              className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === product.image 
                  ? 'border-neon-cyan opacity-100 shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                  : 'border-white/10 opacity-40 hover:opacity-100'
              }`}
            >
              <img src={product.image} className="w-full h-full object-cover" alt="Main" />
            </button>

            {/* more photos from API */}
            {!loading && extraDetails?.product_small_image_urls?.string
              ?.filter((imgUrl: string) => imgUrl !== product.image)
              .map((img: string, i: number) => (
              <button 
                key={i}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === img 
                    ? 'border-neon-cyan opacity-100 shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                    : 'border-white/10 opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
              </button>
            ))}

            {/* Loading templates */}
            {loading && [1, 2, 3].map((n) => (
              <div key={n} className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        </div>

        {/* details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar bg-dark-card relative">
          
          <div className="mb-6 mt-8 md:mt-0">
            <div className="flex items-center gap-2 text-neon-cyan mb-2">
              <Globe className="w-3 h-3" />
              <span className="text-xs font-bold uppercase tracking-widest">{product.animeSource}</span>
            </div>
            <h2 className="text-lg md:text-3xl font-bold text-white leading-tight mb-2 pr-8 line-clamp-2 md:line-clamp-none">
              {product.title}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-neon-cyan to-transparent rounded-full"></div>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
                {/* current price */}
                <span className="text-3xl font-bold text-neon-cyan">
                  US ${product.price.toFixed(2)}
                </span>
                
                {/* old price (only if its higher than current) */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      US ${product.originalPrice.toFixed(2)}
                    </span>
                    
                    {/* discount badge */}
                    <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs font-bold rounded">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

          {/* statistics */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg shrink-0">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <div>
                <span className="text-white font-bold block text-lg">{product.rating}</span>
                <p className="text-gray-500 text-[10px] uppercase tracking-tighter font-medium truncate">
                  {loading ? "..." : `${extraDetails?.evaluate_rate || '95%'} positive`}
                </p>
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-neon-purple/10 rounded-lg shrink-0">
                <ShoppingCart className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <span className="text-white font-bold block">{product.reviewsCount}+</span>
                <p className="text-gray-500 text-[10px] uppercase tracking-tighter truncate">Sold Items</p>
              </div>
            </div>
          </div>
        
          {/* Technical Overview */}
          {!loading && extraDetails && (
            <div className="mb-4 animate-in fade-in duration-700">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(0,243,255,0.8)]"></div>
                Overview
              </h4>
              
              <div className="flex flex-col divide-y divide-white/5 border-y border-white/5">
                <div className="flex justify-between text-[11px] py-3">
                  <span className="text-gray-500 uppercase font-medium">Category</span>
                  <span className="text-white font-bold text-right ml-4 truncate max-w-[150px]">
                    {extraDetails?.second_level_category_name || extraDetails?.first_level_category_name || "Anime Merch"}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-[11px] py-3">
                    <span className="text-gray-500 uppercase font-medium">Total Savings</span>
                    <span className="text-green-400 font-bold">
                      ${savings.toFixed(2)} USD ({extraDetails?.discount})
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] py-3">
                  <span className="text-gray-500 uppercase font-medium">Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-200 font-bold uppercase text-[9px]">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-auto pt-4 pb-2"> 
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-neon-purple to-indigo-600 py-4 rounded-xl text-white font-black text-lg hover:shadow-[0_0_25px_rgba(176,38,255,0.4)] transition-all transform hover:scale-[1.02] shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>BUY ON ALIEXPRESS</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-center text-[10px] text-gray-600 mt-2">
               Secure checkout via AliExpress Official Site
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductModal;