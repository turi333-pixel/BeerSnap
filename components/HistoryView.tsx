
import React from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { BeerProfile } from '../types';

interface Props {
  items: BeerProfile[];
  onSelect: (p: BeerProfile) => void;
  onBack: () => void;
}

const HistoryView: React.FC<Props> = ({ items, onSelect, onBack }) => {
  return (
    <div className="animate-in fade-in duration-300">
       <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">History</h2>
        <div className="w-10" />
      </header>

      <main className="p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No beers snapped yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <button 
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full flex gap-4 p-4 bg-slate-800 border border-slate-700 rounded-2xl text-left active:scale-[0.98] transition-all"
            >
              {item.imageData ? (
                <img src={item.imageData} className="w-16 h-16 rounded-xl object-cover bg-slate-700" alt={item.name} />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                  {item.styleFamily[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{item.name}</h4>
                <p className="text-xs text-slate-400 font-medium truncate uppercase">{item.brewery}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded text-slate-300 font-bold">{item.style}</span>
                  <span className="text-[10px] text-slate-500">{new Date(item.capturedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </main>
    </div>
  );
};

export default HistoryView;
