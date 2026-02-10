import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AiReviewModal from './components/AiReviewModal';
import { MOCK_PRODUCTS } from './constants';
import { Category, Product, AiReviewState } from './types';
import { generateProductReview } from './services/geminiService';
import { Filter, Flame, XCircle, Mail } from 'lucide-react';
import { ProductModal } from './components/ProductModal';

const guessCategory = (title: string): Category => {
  const t = title.toLowerCase();

  // 1. Plushies
  if (t.includes('plush') || t.includes('doll') || t.includes('soft') || t.includes('stuffed')) {
    return Category.PLUSHIES;
  }
  
  // 2. Apparel (Streetwear)
  if (t.includes('hoodie') || t.includes('shirt') || t.includes('jacket') || t.includes('sweatshirt') || t.includes('tee')) {
    return Category.STREETWEAR;
  }

  if (
    t.includes('figure') || 
    t.includes('figurine') || 
    t.includes('statue') || 
    t.includes('model kit') || 
    t.includes('nendoroid') || 
    t.includes('figma') ||
    t.includes('pvc model')
  ) {
    return Category.FIGURES;
  }
  
  // 3. Tech & RGB
  if (t.includes('light') || t.includes('lamp') || t.includes('neon') || t.includes('led') || t.includes('night light')) {
    return Category.TECH_RGB;
  }
  
  // 4. Jewelry
  if (t.includes('ring') || t.includes('necklace') || t.includes('earring') || t.includes('bracelet') || t.includes('pendant')) {
    return Category.JEWELRY;
  }
  
  // 5. Cosplay & Props
  if (t.includes('cosplay') || t.includes('costume') || t.includes('wig') || t.includes('sword') || t.includes('katana') || t.includes('prop') || t.includes('mask')) {
    return Category.COSPLAY_PROPS;
  }

  // default category if no keywords matched
  return Category.OTHERS;
};

const guessAnimeSource = (title: string): string => {
  const t = title.toLowerCase();

  if (t.includes('naruto') || t.includes('shippuden') || t.includes('boruto') || 
      t.includes('kakashi') || t.includes('sasuke') || t.includes('itachi') || t.includes('uchiha') || 
      t.includes('sakura') || t.includes('gaara') || t.includes('jiraiya') || t.includes('tsunade') || 
      t.includes('minato') || t.includes('obito') || t.includes('madara') || t.includes('akatsuki') || 
      t.includes('kurama') || t.includes('sharingan') || t.includes('uzumaki')) {
    return 'Naruto';
  }

  if (t.includes('one piece') || t.includes('luffy') || t.includes('zoro') || t.includes('roronoa') || 
      t.includes('nami') || t.includes('sanji') || t.includes('chopper') || t.includes('nico robin') || 
      t.includes('franky') || t.includes('brook') || t.includes('ace') || t.includes('sabo') || 
      t.includes('law') || t.includes('trafalgar') || t.includes('shanks') || t.includes('kaido') || 
      t.includes('yamato') || t.includes('gear 5') || t.includes('sunny') || t.includes('straw hat')) {
    return 'One Piece';
  }

  if (t.includes('demon slayer') || t.includes('kimetsu') || t.includes('yaiba') || 
      t.includes('tanjiro') || t.includes('nezuko') || t.includes('zenitsu') || t.includes('inosuke') || 
      t.includes('rengoku') || t.includes('giyu') || t.includes('shinobu') || t.includes('mitsuri') || 
      t.includes('tengen') || t.includes('muzan') || t.includes('akaza') || t.includes('hashira')) {
    return 'Demon Slayer';
  }

  if (t.includes('titan') || t.includes('shingeki') || t.includes('kyojin') || t.includes('eren') || 
      t.includes('yeager') || t.includes('mikasa') || t.includes('ackerman') || t.includes('levi') || 
      t.includes('armin') || t.includes('hange') || t.includes('erwin') || t.includes('survey corps') || 
      t.includes('scout regiment')) {
    return 'Attack on Titan';
  }

  if (t.includes('genshin') || t.includes('paimon') || t.includes('zhongli') || t.includes('raiden') || 
      t.includes('venti') || t.includes('nahida') || t.includes('furina') || t.includes('hutao') || 
      t.includes('xiao') || t.includes('ganyu') || t.includes('ayaka') || t.includes('kazuha') || 
      t.includes('scaramouche') || t.includes('tartaglia')) {
    return 'Genshin Impact';
  }
  if (t.includes('chainsaw') || t.includes('denji') || t.includes('pochita') || t.includes('makima') || 
      t.includes('power') || t.includes('aki') || t.includes('hayakawa') || t.includes('kobeni') || 
      t.includes('reze')) {
    return 'Chainsaw Man';
  }

  if (t.includes('berserk') || t.includes('guts') || t.includes('griffith') || t.includes('casca') || 
      t.includes('behelit') || t.includes('dragonslayer') || t.includes('brand of sacrifice')) {
    return 'Berserk';
  }

  if (t.includes('jujutsu') || t.includes('kaisen') || t.includes('gojo') || t.includes('satoru') || 
      t.includes('itadori') || t.includes('yuji') || t.includes('sukuna') || t.includes('megumi') || 
      t.includes('fushiguro') || t.includes('nobara') || t.includes('geto') || t.includes('suguru') || 
      t.includes('mahoraga') || t.includes('toji') || t.includes('nanami')) {
    return 'Jujutsu Kaisen';
  }

  if (t.includes('pokemon') || t.includes('pikachu') || t.includes('charizard') || t.includes('gengar') || 
      t.includes('eevee') || t.includes('mewtwo') || t.includes('snorlax') || t.includes('lucario') || 
      t.includes('bulbasaur') || t.includes('squirtle') || t.includes('charmander') || t.includes('jigglypuff')) {
    return 'Pokémon';
  }

  if (t.includes('dragon') && t.includes('ball') || t.includes('dbz') || t.includes('goku') || 
      t.includes('vegeta') || t.includes('gohan') || t.includes('trunks') || t.includes('piccolo') || 
      t.includes('frieza') || t.includes('cell') || t.includes('majin buu') || t.includes('broly') || 
      t.includes('beerus') || t.includes('saiyan') || t.includes('kamehameha') || t.includes('bulma')) {
    return 'Dragon Ball Z';
  }

  if (t.includes('death note') || t.includes('ryuk') || t.includes('yagami') || t.includes('light yagami') || 
      t.includes('l lawliet') || t.includes('misa amane') || t.includes('shinigami')) {
    return 'Death Note';
  }

  if (t.includes('bleach') || t.includes('ichigo') || t.includes('kurosaki') || t.includes('rukia') || 
      t.includes('aizen') || t.includes('kenpachi') || t.includes('byakuya') || t.includes('renji') || 
      t.includes('hitsugaya') || t.includes('toshiro') || t.includes('ulquiorra') || t.includes('grimmjow') || 
      t.includes('espada') || t.includes('bankai') || t.includes('soul reaper')) {
    return 'Bleach';
  }

  // Jak nie znajdzie żadnego z powyższych:
  return 'Other'; 
};

const App: React.FC = () => {
  // Multi-select state
  // real data states
  const [products, setProducts] = useState<Product[]>([]); // ali data
  const [loading, setLoading] = useState(true);            // are we still loading data?
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // to modal
  
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // circle on the bottom
  
  const [aiReviewState, setAiReviewState] = useState<AiReviewState>({
    isOpen: false,
    loading: false,
    content: null,
    productName: null,
    productImage: '',
    sourceReviews: [],
  });
const fetchFilteredProducts = async () => {
    console.log("STARTING FILTERING PROCESS...");
    try {
      setLoading(true);

      // guarding dictionary
      // incoming series -> list of keywords to check in title (more robust than just the name)
      const seriesKeywords: Record<string, string[]> = {
        "Attack on Titan": ["titan", "shingeki", "kyojin", "eren", "levi", "mikasa", "ackerman"],
        "Naruto": ["naruto", "sasuke", "kakashi", "itachi", "sakura", "akatsuki", "uzumaki", "uchiha"],
        "One Piece": ["one piece", "luffy", "zoro", "nami", "sanji", "chopper", "law", "ace", "onepiece"],
        "Demon Slayer": ["demon slayer", "kimetsu", "yaiba", "tanjiro", "nezuko", "zenitsu", "inosuke", "rengoku"],
        "Dragon Ball Z": ["dragon ball", "dragonball", "goku", "vegeta", "gohan", "saiyan", "trunks", "bulma", "piccolo"],
        "Jujutsu Kaisen": ["jujutsu", "kaisen", "gojo", "itadori", "sukuna", "megumi", "nobara"],
        "Chainsaw Man": ["chainsaw", "denji", "power", "makima", "pochita", "aki", "chainsawman"],
        "Berserk": ["berserk", "guts", "griffith", "casca"],
        "Bleach": ["bleach", "ichigo", "rukia", "aizen", "kenpachi", "byakuya", "renji", "toshiro", "espada", "bankai"],
        "Genshin Impact": ["genshin", "impact", "paimon", "diluc", "zhongli", "raiden", "venti", "hutao"],
      };

      // optimizing dictionary 
      // changing long to short series names to improve SEO (e.g. "Attack on Titan" -> "Shingeki")
      const querySeriesMap: Record<string, string> = {
        "Attack on Titan": "Shingeki",      
        "Demon Slayer": "Kimetsu",         
        "Dragon Ball Z": "Dragonball",      
        "One Piece": "Onepiece",            
        "Chainsaw Man": "Chainsawman",     
        "My Hero Academia": "Boku no Hero", 
      };

      // category dictionary
      const queryCategoryMap: Record<string, string> = {
        [Category.FIGURES]: "Figure", 
        [Category.PLUSHIES]: "Plush",
        [Category.STREETWEAR]: "Clothes", 
        [Category.TECH_RGB]: "RGB",     
        [Category.JEWELRY]: "Jewelry",
        [Category.COSPLAY_PROPS]: "Cosplay", 
        [Category.OTHERS]: "Gift",
      };

      // buuilding query with SEO in mind (using optimized series names and category keywords)
      let queryParts = [""];
      
      if (selectedSeries.length > 0) {
        const optimizedSeries = selectedSeries.map(s => {
            // check if we have an optimized name for this series, if yes use it, if not use the original name
            return querySeriesMap[s] || s;
        });
        queryParts.push(optimizedSeries.join(" "));
      }
      
      const validCategories = selectedCategories.filter(c => c !== Category.OTHERS);
      if (validCategories.length > 0) {
        const keywords = validCategories.map(cat => queryCategoryMap[cat] || "").join(" ");
        queryParts.push(keywords);
      } else if (selectedSeries.length === 0) {
        queryParts.push("Figures"); // default
      }

      const finalQuery = queryParts.join(" ");
      console.log("API Query (Optimalized):", finalQuery);

      const response = await fetch(`/api/products?q=${encodeURIComponent(finalQuery)}`);
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        const rawProducts: Product[] = data.products.map((item: any) => ({
          id: String(item.product_id),
          title: item.product_title,
          price: parseFloat(item.target_sale_price),
          originalPrice: item.target_original_price ? parseFloat(item.target_original_price) : undefined,
          image: item.product_main_image_url,
          aliCategory: item.second_level_category_name || item.first_level_category_name || "Unknown",
          category: guessCategory(item.product_title),
          animeSource: guessAnimeSource(item.product_title),
          rating: item.evaluate_rate ? parseFloat((parseFloat(item.evaluate_rate) / 20).toFixed(1)) : 4.5,
          reviewsCount: parseInt(item.lastest_volume) || 50,
          affiliateLink: item.promotion_link,
          userReviews: []
        }));

        console.log(`📥 POBRANO: ${rawProducts.length} produktów.`);

        // filtering results
        let filteredProducts = rawProducts.filter(product => {
          const t = product.title.toLowerCase();

          // checking series
          if (selectedSeries.length > 0) {
             const matchesSeries = selectedSeries.some(series => {
                const keywords = seriesKeywords[series] || [series.toLowerCase()];
                // also check for optimized series name in title to catch more results (e.g. "Shingeki" for "Attack on Titan")
                const optimized = querySeriesMap[series]?.toLowerCase();
                
                return keywords.some(k => t.includes(k.toLowerCase())) || (optimized && t.includes(optimized));
             });
             if (!matchesSeries) return false;
          }

          // checking categories - only if we have valid categories (OTHERS is not a real category, just a "catch all" for uncategorized items, so we ignore it in filtering)
          if (validCategories.length > 0) {
             if (selectedCategories.includes(Category.JEWELRY)) {
                if (t.includes('figure') || t.includes('statue') || t.includes('plush') || t.includes('shirt')) return false;
             }
             
             if (selectedCategories.includes(Category.COSPLAY_PROPS)) {
               if (t.includes('figure') || t.includes('statue') || t.includes('pvc')) return false;
               if (t.includes('model') && !t.includes('costume') && !t.includes('wig') && !t.includes('outfit')) return false; 
               if (t.includes('keychain')) return false; 
               if (t.includes('magnet')) return false; 
             }

             if (selectedCategories.includes(Category.TECH_RGB)) {
                if (t.includes('figure') || t.includes('statue') || t.includes('plush')) return false;
             }

             if (selectedCategories.includes(Category.STREETWEAR)) {
                // word black list
                if (t.includes('figure') || t.includes('statue') || t.includes('toy')) return false;
                if (t.includes('keychain') || t.includes('stand')) return false;
             
                // 2. word white list
                const allowedAliCategories = [
                    "Hoodies & Sweatshirts",
                    "T-Shirts", 
                    "Tops & Tees",
                    "Jackets & Coats",
                    "Pants",
                    "Shorts",
                    "Casual Shorts",
                    "Sweaters",
                    "Socks",
                    "Hats & Caps"
                ];

                if (product.aliCategory && product.aliCategory !== "Unknown") {
                    // Sprawdzamy tylko jeśli jesteśmy w Streetwear!
                    if (!allowedAliCategories.some(allowed => product.aliCategory?.includes(allowed))) {
                         console.log(`🗑️ DENIED (Bad ali category): ${product.title} [${product.aliCategory}]`);
                         return false; 
                    }
                }
             }     
             if (selectedCategories.includes(Category.FIGURES)) {
                if (t.includes('shirt') || t.includes('hoodie') || t.includes('costume')) return false;
                if (t.includes('keychain')) return false;
                if (t.includes('stand') && t.includes('acrylic')) return false;
                if (t.includes('backpack')) return false;
                if (t.includes('r-ings')) return false;
                if (t.includes('rings')) return false;
                console.log("✅ FIGURKA ZAAKCEPTOWANA:", product.title);  
             }
          }

          return true;
        });

        console.log(`ACCEPTED: ${filteredProducts.length}`);

        // Safety Net
        if (filteredProducts.length === 0 && rawProducts.length > 0) {
            console.warn("SAFETY NET: raw data.");
            setProducts(rawProducts);
        } else {
            setProducts(filteredProducts);
        }

      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiReview = async (product: Product) => {
    setAiReviewState({
      isOpen: true,
      loading: true,
      content: null,
      productName: product.title,
      productImage: product.image,
      sourceReviews: product.userReviews,
    });

    const review = await generateProductReview(
        product.title, 
        product.animeSource, 
        product.userReviews
    );

    setAiReviewState(prev => ({
      ...prev,
      loading: false,
      content: review,
    }));
  };

  const closeAiReview = () => {
    setAiReviewState(prev => ({ ...prev, isOpen: false }));
  };

  // Single choice change
  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => {
      // if category is already selected -> deselect it (empty list)
      if (prev.includes(category)) {
        return [];
      }
      // otherwise -> set IT as the only selected one
      return [category];
    });
  };

  // Single choice change
  const toggleSeries = (series: string) => {
    setSelectedSeries(prev => {
      // if series is already selected -> deselect it (empty list)
      if (prev.includes(series)) {
        return [];
      }
      // otherwise -> set IT as the only selected one
      return [series];
    });
  };

  const resetCategories = () => setSelectedCategories([]);
  const resetSeries = () => setSelectedSeries([]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSeries([]);
    setSearchQuery('');
  };


    useEffect(() => {
      fetchFilteredProducts(); 
    }, []);

  const handleHomeClick = async () => {
    console.log("🏠 HOME CLICKED - RESETTING TO DEFAULT ---");
    
    // cleaning filters
    setSelectedCategories([]);
    setSelectedSeries([]);
    setCurrentPage(1);
    
    // fetching default products (Anime Figures, page 1, sorted by orders) 
    try {
      setLoading(true);
      const response = await fetch(`/api/products?q=Anime Figures&page=1&sort=orders`);
      const data = await response.json();

      if (data.products) {
        // Mapper
        const products = data.products.map((item: any) => ({
             id: String(item.product_id),
             title: item.product_title,
             price: parseFloat(item.target_sale_price),
             originalPrice: item.target_original_price ? parseFloat(item.target_original_price) : undefined,
             image: item.product_main_image_url,
             category: guessCategory(item.product_title),
             animeSource: guessAnimeSource(item.product_title),
             rating: item.evaluate_rate ? parseFloat((parseFloat(item.evaluate_rate) / 20).toFixed(1)) : 4.5,
             reviewsCount: parseInt(item.lastest_volume) || 50,
             affiliateLink: item.promotion_link,
             userReviews: []
        }));
        
        setProducts(products);
      }
    } catch (e) {
      console.error("Error resetting:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-dark-bg text-white pb-20 relative overflow-x-hidden selection:bg-neon-purple/30"
    >
      <Navbar 
        onSearch={setSearchQuery} 
        selectedCategories={selectedCategories}
        selectedSeries={selectedSeries}
        onToggleCategory={toggleCategory}
        onToggleSeries={toggleSeries}
        onResetCategories={resetCategories}
        onResetSeries={resetSeries}
        onClearFilters={clearFilters}
        onApplyFilters={fetchFilteredProducts}
        onHomeClick={handleHomeClick}
      />

      {/* --- SIDE DECORATIONS (Cyberpunk HUD Style) --- */}
      
      {/* Left Side Decoration - Bleach Quote */}
      <div className="absolute top-0 left-0 h-[800px] w-auto z-[5] hidden 2xl:flex flex-col pt-40 pl-12 min-[1800px]:pl-32 select-none pointer-events-none transition-all duration-500">
         <div className="relative flex flex-col gap-24 items-center">
            <div className="w-1 h-32 bg-neon-purple/30 shadow-[0_0_15px_rgba(176,38,255,0.3)] rounded-full" />
            
            <div className="flex flex-col gap-2">
               <span 
                 className="[writing-mode:vertical-lr] text-4xl font-bold font-mono tracking-[0.5em] text-neon-purple opacity-60 drop-shadow-[0_0_10px_rgba(176,38,255,0.5)]"
                 title="Katen Kyōkotsu: Karamatsu Shinjū"
               >
                 花天狂骨枯松心中
               </span>
            </div>

            <div className="w-1 h-32 bg-neon-purple/30 shadow-[0_0_15px_rgba(176,38,255,0.3)] rounded-full" />
         </div>
      </div>

      {/* Right Side Decoration - One Piece Quote */}
      <div className="absolute top-0 right-0 h-[800px] w-auto z-[5] hidden 2xl:flex flex-col items-end pt-40 pr-12 min-[1800px]:pr-32 select-none pointer-events-none transition-all duration-500">
         <div className="relative flex flex-col gap-24 items-center">
            <div className="w-1 h-32 bg-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.3)] rounded-full" />
            
            <div className="flex flex-col gap-2 items-end">
               <span 
                 className="[writing-mode:vertical-rl] text-4xl font-bold font-mono tracking-[0.2em] text-neon-cyan opacity-60 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                 title="Scars on the back are a swordsman's shame."
               >
                 背中の傷は剣士の恥だ
               </span>
            </div>

            <div className="w-1 h-32 bg-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.3)] rounded-full" />
         </div>
      </div>

      {/* GLOBAL BACKGROUND PULSE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none animate-pulse z-0"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <header className="relative pt-32 pb-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6">
              Your Portal to The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">
                Anime World
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We curate the best merch from AliExpress.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full mx-auto px-2 sm:px-6 lg:px-8 2xl:px-40 min-[1800px]:px-64">      
          {selectedSeries.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 items-center justify-center animate-in fade-in slide-in-from-top-4">
              {selectedSeries.map(series => (
                <div key={series} className="bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan px-4 py-1.5 rounded-full flex items-center gap-2 text-sm">
                  <span className="font-bold">{series}</span>
                  <button 
                    onClick={() => toggleSeries(series)} 
                    className="hover:text-white transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => setSelectedSeries([])} className="text-xs text-gray-500 hover:text-white underline ml-2">Clear Series</button>
            </div>
          )}
          
          {/* Category Chips (Horizontal Scroll) */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max pb-2">
                  <button
                      onClick={() => setSelectedCategories([])}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                      selectedCategories.length === 0
                          ? 'bg-white/10 text-white border-white/50'
                          : 'bg-dark-card text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                  >
                      All
                  </button>
                  {Object.values(Category).filter(category => category !== Category.OTHERS).map((category) => (
                  <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                      selectedCategories.includes(category)
                          ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.4)]'
                          : 'bg-dark-card text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                  >
                      {category}
                  </button>
                  ))}
              </div>
              <div className="hidden md:flex items-center text-gray-500 text-sm gap-2 ml-4">
                  <Filter className="w-4 h-4" />
                  <span>Sort By</span>
              </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            
            {/* Is it loading? */}
            {loading ? (
               <div className="col-span-full py-32 flex flex-col items-center justify-center text-center animate-pulse">
                  {/* Loading circle CSS */}
                  <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-neon-cyan text-xl font-display tracking-widest">LOADING Anime Stuff...</p>
               </div>
            ) : (
               // Doesnt load but no products?
               products.length > 0 ? (
                products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAiReview={handleAiReview}
                    onClick={(clickedProduct) => setSelectedProduct(clickedProduct)}
                  />
                ))
               ) : (
                 // No products after loading
                 <div className="col-span-full py-20 text-center">
                   <p className="text-gray-500 text-lg">No products found for these criteria.</p>
                   <button 
                     onClick={clearFilters}
                     className="mt-4 text-neon-cyan hover:underline"
                   >
                     Clear Filters
                   </button>
                 </div>
               )
            )}
          </div>
        </main>
        
        <footer className="mt-20 border-t border-white/10 bg-dark-card/50 relative z-20">
            <div className="max-w-[1400px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Col 1: About Us */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-display font-bold text-white mb-4">About Us</h3>
                        <p className="text-gray-400 text-xs leading-relaxed mb-6 text-justify max-w-sm">
                             AnimeStuffHub is your premier curated discovery platform for anime merchandise. 
                             We are <strong>not</strong> a dropshipping store. We act as a filter for the chaos of global marketplaces, 
                             using AI to analyze reviews and manually verifying products so you find quality gear without the risk.
                        </p>
                    </div>

                    {/* Col 2: Platform (Centered) */}
                    <div className="flex flex-col items-center">
                        <div className="text-left">
                            <h4 className="text-white font-bold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-neon-cyan transition-colors">How it Works</a></li>
                                <li><a href="#" className="hover:text-neon-cyan transition-colors">Affiliate Disclosure</a></li>
                                <li><a href="#" className="hover:text-neon-cyan transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-neon-cyan transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Col 3: Contact */}
                    <div className="flex flex-col md:items-start lg:pl-12">
                        <h4 className="text-white font-bold mb-4">Contact</h4>
                        <a href="mailto:animestuffhub@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors mb-2">
                            <Mail className="w-4 h-4" />
                            <span>animestuffhub@gmail.com</span>
                        </a>
                        <p className="text-gray-500 text-xs mt-4">
                            Have a product suggestion? Drop us a line.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar: Disclaimer & Copyright */}
                <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                    <p className="text-gray-500 text-xs text-center md:text-left leading-relaxed opacity-75">
                        <strong>Affiliate Disclosure:</strong> AnimeStuffHub is a participant in the AliExpress Affiliate Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to AliExpress.com. Prices and availability are accurate as of the date/time indicated and are subject to change.
                    </p>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                         <p>&copy; {new Date().getFullYear()} AnimeStuffHub. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
      </div>

      {/* AI Modal */}
      <AiReviewModal state={aiReviewState} onClose={closeAiReview} />
      {/* Item description modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default App;