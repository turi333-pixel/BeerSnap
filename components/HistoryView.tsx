
import React from 'react';
import { ChevronLeft, Clock, MapPin } from 'lucide-react';
import { BeerProfile } from '../types';

interface Props {
  items: BeerProfile[];
  onSelect: (p: BeerProfile) => void;
  onBack: () => void;
}

const HistoryView: React.FC<Props> = ({ items, onSelect, onBack }) => {
  return (
    <div className="animate-in fade-in duration-300 pb-20">
       <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Recent Snaps</h2>
        <div className="w-10" />
      </header>

      <main className="p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-24 px-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-slate-600" />
            </div>
            <p className="text-slate-500">No recent activity.</p>
          </div>
        ) : (
          items.map((item) => (
            <button 
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full flex gap-4 p-3 bg-slate-800 border border-slate-700 rounded-2xl text-left active:scale-[0.98] transition-all shadow-md group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-inner bg-slate-700">
                {item.thumbnailData || item.imageData ? (
                  <img 
                    src={item.thumbnailData || item.imageData} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    alt={item.name} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-500/40 font-black text-xl">
                    {item.styleFamily[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-bold text-white truncate leading-tight">{item.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-widest">{item.brewery}</p>
                  <span className="text-[10px] text-slate-600">•</span>
                  <p className="text-[10px] text-slate-500 font-bold truncate uppercase tracking-widest">{item.country}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[9px] px-2 py-0.5 bg-amber-500 text-slate-900 font-black rounded uppercase">{item.style}</span>
                  <span className="text-[9px] text-slate-500 font-bold">{new Date(item.capturedAt).toLocaleDateString()}</span>
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
