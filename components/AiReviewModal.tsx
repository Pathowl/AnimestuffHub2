import React from 'react';
import { X, Sparkles, Loader2, Key } from 'lucide-react';
import { AiReviewState } from '../types';
import Markdown from 'react-markdown';

interface AiReviewModalProps {
  state: AiReviewState;
  onClose: () => void;
}

const AiReviewModal: React.FC<AiReviewModalProps> = ({ state, onClose }) => {
  if (!state.isOpen) return null;

  const isKeyMissing = state.content === "KEY_MISSING";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-dark-card border border-neon-purple/30 rounded-2xl shadow-[0_0_50px_rgba(176,38,255,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-neon-purple/10 to-transparent p-4 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-purple" />
            <h3 className="font-display font-bold text-white tracking-widest uppercase text-sm">AI Curator Analysis</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Product details info */}
          {!state.loading && state.productName && (
            <div className="flex items-center gap-4 p-4 mb-6 bg-white/5 rounded-2xl border border-white/10 animate-in slide-in-from-top-4 duration-500">
              {/* photo */}
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0">
                <img 
                  src={state.productImage || ""} 
                  className="w-full h-full object-cover" 
                  alt="Product preview"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-neon-purple/20 text-neon-purple border border-neon-purple/30 uppercase tracking-tighter">
                    Target Subject
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <h2 className="text-sm md:text-base font-bold text-white line-clamp-2 leading-tight">
                  {state.productName}
                </h2>
              </div>
            </div>
          )}

          {/* AI Output Section */}
          <div className="relative">
            {state.loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white/5 rounded-2xl border border-white/5">
                <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
                <p className="text-neon-purple/70 animate-pulse text-xs font-mono uppercase tracking-[0.2em]">Synchronizing data...</p>
              </div>
            ) : isKeyMissing ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
                <Key className="w-8 h-8 text-red-500 mx-auto mb-4 opacity-50" />
                <h4 className="text-white font-bold mb-1">AI Link Offline</h4>
                <p className="text-gray-500 text-xs">Configuration required to access neural analysis.</p>
              </div>
            ) : (
              <div className="relative">
                {/* decorative line */}
                <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-purple via-neon-cyan to-transparent opacity-30" />
                
                <div className="pl-6 prose prose-invert prose-sm max-w-none">
                  <div className="text-gray-200 leading-relaxed font-sans text-sm md:text-base italic">
                    <Markdown>
                      {state.content}
                    </Markdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/40 border-t border-white/5 flex justify-between items-center px-6 shrink-0">
          <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">
            AI-Engine: Google Gemini
          </p>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-neon-purple/40" />
             <div className="w-1 h-1 rounded-full bg-neon-cyan/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiReviewModal;