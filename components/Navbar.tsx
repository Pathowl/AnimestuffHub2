import React, { useState } from 'react';
import { Menu, ShoppingBag, Search, X, Zap, LayoutGrid, Check, CheckSquare, Square, Circle, CircleDot } from 'lucide-react';
import { Category } from '../types';
import { POPULAR_SERIES } from '../constants';

interface NavbarProps {
  onSearch: (query: string) => void;
  selectedCategories: Category[];
  selectedSeries: string[];
  onToggleCategory: (category: Category) => void;
  onToggleSeries: (series: string) => void;
  onResetCategories: () => void;
  onResetSeries: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  selectedCategories,
  selectedSeries,
  onToggleCategory,
  onToggleSeries,
  onResetCategories,
  onResetSeries,
  onClearFilters,
  onApplyFilters 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Allow pressing Enter in the search bar to apply filters immediately, which is a common UX expectation for search inputs.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onApplyFilters();
      // Close the menu if it's open, since the user is likely done with their search/filtering at this point.
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            
            {/* Left: Burger & Logo */}
            <div className="flex items-center gap-4 z-20 relative bg-dark-bg/0">
              <button 
                onClick={toggleMenu}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 bg-gradient-to-tr from-neon-purple to-neon-cyan rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all">
                  <ShoppingBag className="text-white w-5 h-5" />
                </div>
                <span className="hidden sm:block text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-neon-cyan group-hover:to-neon-purple transition-all duration-300">
                  AnimeStuffHub
                </span>
              </div>
            </div>

            {/* Middle: Search Bar (Desktop - Absolute Center) */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md xl:max-w-lg z-10 px-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search figures, cosplay... (Press Enter)"
                  onChange={(e) => onSearch(e.target.value)}
                  onKeyDown={handleKeyDown} // ENTER TRIGGER
                  className="w-full bg-dark-card border border-gray-700 text-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-neon-purple focus:border-opacity-50 focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-500 shadow-lg shadow-black/20"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>
            </div>

            {/* Middle: Search Bar (Mobile/Tablet - Flex) */}
            <div className="flex-1 mx-4 lg:hidden relative z-10">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => onSearch(e.target.value)}
                  onKeyDown={handleKeyDown} // ENTER TRIGGER
                  className="w-full bg-dark-card border border-gray-700 text-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-neon-purple focus:border-opacity-50"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>
            </div>

            {/* Right: Newsletter (Desktop) */}
            <div className="hidden md:block z-20 relative">
              <button className="px-4 py-2 text-sm font-medium text-neon-cyan border border-neon-cyan/50 rounded-lg hover:bg-neon-cyan/10 transition-colors shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={toggleMenu}
          />
          
          {/* Drawer */}
          <div className="relative w-80 max-w-[85vw] bg-dark-bg border-r border-white/10 h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark-surface/50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-display font-bold text-white">Filters</span>
                {(selectedCategories.length > 0 || selectedSeries.length > 0) && (
                  <span className="px-2 py-0.5 bg-neon-purple text-white text-[10px] font-bold rounded-full animate-pulse">
                    {selectedCategories.length + selectedSeries.length} Active
                  </span>
                )}
              </div>
              <button onClick={toggleMenu} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content: Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
               {/* Filters Container */}
               <div className="space-y-8">
                 {/* Section 1: Browse by Category */}
                 <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                      <div className="flex items-center gap-2 text-neon-purple">
                          <LayoutGrid className="w-4 h-4" />
                          <h3 className="text-xs font-bold uppercase tracking-wider">Categories</h3>
                      </div>
                    </div>
                   <div className="space-y-1">
                    {/* "All" Button - radio button */}
                    <button
                      onClick={onResetCategories}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap group ${
                        selectedCategories.length === 0
                          ? 'bg-neon-purple/10 text-white' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className={`font-medium text-sm ${selectedCategories.length === 0 ? 'text-neon-purple' : ''}`}>
                        All Categories
                      </span>
                      {/* if chosen blank list show dot, otherwise empty circle */}
                      {selectedCategories.length === 0 ? (
                          <CircleDot className="w-4 h-4 text-neon-purple" />
                      ) : (
                          <Circle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                      )}
                    </button>

                    {/* category list */}
                    {Object.values(Category).filter(category => category !== Category.OTHERS).map((category) => {
                      const isSelected = selectedCategories.includes(category);
                      return (
                        <button
                          key={category}
                          onClick={() => onToggleCategory(category)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap group ${
                            isSelected
                              ? 'bg-neon-purple/10 text-white' 
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className={`font-medium text-sm ${isSelected ? 'text-neon-purple' : ''}`}>
                            {category}
                          </span>
                          {isSelected ? (
                              // circle dot if selected
                              <CircleDot className="w-4 h-4 text-neon-purple" />
                          ) : (
                              // circle if not selected
                              <Circle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                 </div>

                 {/* Section 2: Shop by Series */}
                 <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                       <div className="flex items-center gap-2 text-neon-cyan">
                          <Zap className="w-4 h-4" />
                          <h3 className="text-xs font-bold uppercase tracking-wider">Top Series</h3>
                       </div>
                    </div>
                    <div className="space-y-1">
                      {/* "All" Button for Series */}
                      <button
                        onClick={onResetSeries}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors group ${
                          selectedSeries.length === 0
                            ? 'bg-neon-cyan/10 text-white' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className={`font-medium text-sm ${selectedSeries.length === 0 ? 'text-neon-cyan' : ''}`}>
                          All Series
                        </span>
                         {/* if no category, show dot */}
                         {selectedSeries.length === 0 ? (
                            <CircleDot className="w-4 h-4 text-neon-cyan" />
                         ) : (
                            <Circle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                         )}
                      </button>

                      {POPULAR_SERIES.map((anime) => {
                        const isSelected = selectedSeries.includes(anime);
                        return (
                          <button
                            key={anime}
                            onClick={() => onToggleSeries(anime)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors group ${
                              isSelected
                                ? 'bg-neon-cyan/10 text-white' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className={`font-medium text-sm ${isSelected ? 'text-neon-cyan' : ''}`}>
                              {anime}
                            </span>
                             {/* if chosen this series, show dot */}
                             {isSelected ? (
                                <CircleDot className="w-4 h-4 text-neon-cyan" />
                            ) : (
                                <Circle className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                 </div>
                 
                 {/* Padding at bottom so content doesn't get hidden behind footer */}
                 <div className="h-20"></div>
               </div>
            </div>

            {/* Footer: Sticky Apply Button */}
            <div className="p-4 border-t border-white/10 bg-dark-bg/95 backdrop-blur shrink-0">
              <button 
                  onClick={() => {
                    console.log("BUTTON CLICKED: Apply Filters");
                    onApplyFilters(); // fetch new products based on selected filters
                    toggleMenu();     // close the menu after applying filters, since user is likely done with filtering at this point
                  }}
                  className="w-full py-3.5 bg-white text-black font-display font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
              >
                  <Check className="w-5 h-5" />
                  <span>Apply Filters</span>
              </button>
               
               {/* Clear button optional */}
               {(selectedCategories.length > 0 || selectedSeries.length > 0) && (
                 <button 
                   onClick={onClearFilters}
                   className="w-full mt-2 text-xs text-gray-500 hover:text-white transition-colors text-center py-2"
                 >
                   Clear all selections
                 </button>
               )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;