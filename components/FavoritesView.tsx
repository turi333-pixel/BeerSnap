
import React from 'react';
import { ChevronLeft, Heart } from 'lucide-react';
import { BeerProfile } from '../types';

interface Props {
  items: BeerProfile[];
  onSelect: (p: BeerProfile) => void;
  onBack: () => void;
}

const FavoritesView: React.FC<Props> = ({ items, onSelect, onBack }) => {
  return (
    <div className="animate-in fade-in duration-300">
       <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Your Favorites</h2>
        <div className="w-10" />
      </header>

      <main className="p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-20 px-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-slate-600" />
            </div>
            <p className="text-slate-500">No favorites saved yet.</p>
            <p className="text-xs text-slate-600 mt-2">Snap a beer and tap the heart icon to save it here!</p>
          </div>
        ) : (
          items.map((item) => (
            <button 
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full flex gap-4 p-4 bg-slate-800 border border-slate-700 rounded-2xl text-left active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Heart size={40} className="text-red-500 fill-red-500" />
              </div>
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold shrink-0">
                {item.styleFamily[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{item.name}</h4>
                <p className="text-xs text-slate-400 font-medium truncate uppercase">{item.brewery}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded text-slate-300 font-bold">{item.style}</span>
                  <span className="text-[10px] text-slate-500">{item.abv}% ABV</span>
                </div>
              </div>
            </button>
          ))
        )}
      </main>
    </div>
  );
};

export default FavoritesView;
