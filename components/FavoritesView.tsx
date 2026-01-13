
import React, { useMemo } from 'react';
import { ChevronLeft, Heart, Star, Beer } from 'lucide-react';
import { BeerProfile, UserPreferences } from '../types';

interface Props {
  items: BeerProfile[];
  preferences: UserPreferences;
  onSelect: (p: BeerProfile) => void;
  onBack: () => void;
}

const FavoritesView: React.FC<Props> = ({ items, preferences, onSelect, onBack }) => {
  const calculateMatch = (item: BeerProfile) => {
    let score = 0;
    if (item.abv >= preferences.minAbv) score += 33.3;
    if (preferences.favFamilies.includes(item.styleFamily)) score += 33.3;
    const styleMatches = preferences.favStyles?.some(s => 
      item.style.toLowerCase().includes(s.toLowerCase()) || 
      item.substyle?.toLowerCase().includes(s.toLowerCase())
    );
    if (styleMatches) score += 33.4;
    return Math.round(score);
  };

  return (
    <div className="animate-in fade-in duration-300 pb-20">
       <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Your Vault</h2>
        <div className="w-10" />
      </header>

      <main className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-24 px-8">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Heart size={40} className="text-slate-600" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Vault is empty</h3>
            <p className="text-slate-500 text-sm">Snap a beer and tap the heart icon to start your collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => {
              const match = calculateMatch(item);
              return (
                <button 
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 active:scale-95 transition-all shadow-xl"
                >
                  {/* Snapshot Image */}
                  {item.thumbnailData ? (
                    <img 
                      src={item.thumbnailData} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                      alt={item.name} 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                       {/* Fixed: Use Beer icon component correctly */}
                       <Beer size={48} className="text-slate-700" />
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                      {match}% MATCH
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <Heart size={18} className="text-red-500 fill-red-500 drop-shadow-lg" />
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <h4 className="font-bold text-white text-sm line-clamp-1 leading-tight mb-0.5">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight opacity-80 truncate mb-1">
                      {item.brewery}
                    </p>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[9px] font-black px-1.5 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-white uppercase">
                         {item.style}
                       </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesView;
