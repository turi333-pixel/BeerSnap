
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { StyleFamily } from '../types';

interface Props {
  onBack: () => void;
}

const PreferenceView: React.FC<Props> = ({ onBack }) => {
  const [likesHazy, setLikesHazy] = useState(true);
  const [minAbv, setMinAbv] = useState(4);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const prefs = localStorage.getItem('beersnap_prefs');
    if (prefs) {
      const parsed = JSON.parse(prefs);
      setLikesHazy(parsed.likesHazy);
      setMinAbv(parsed.minAbv);
    }
  }, []);

  const save = () => {
    localStorage.setItem('beersnap_prefs', JSON.stringify({ likesHazy, minAbv }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-300">
       <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Preferences</h2>
        <div className="w-10" />
      </header>

      <main className="p-6 space-y-8">
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Taste Profile</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <div>
                <p className="font-bold">Prefer Hazy Beers</p>
                <p className="text-xs text-slate-400">NEIPAs, Hefeweizens, etc.</p>
              </div>
              <button 
                onClick={() => setLikesHazy(!likesHazy)}
                className={`w-14 h-8 rounded-full transition-colors relative ${likesHazy ? 'bg-amber-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${likesHazy ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">Minimum ABV Focus</p>
                <p className="text-amber-500 font-black">{minAbv}%</p>
              </div>
              <input 
                type="range" 
                min="0" 
                max="12" 
                step="0.5"
                value={minAbv}
                onChange={(e) => setMinAbv(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-700 rounded-full appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold uppercase">
                <span>Any</span>
                <span>Session</span>
                <span>Heavy</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={save}
          className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {saved ? 'Saved!' : <><Save size={20} /> Save Preferences</>}
        </button>

        <div className="bg-slate-800/50 p-4 rounded-2xl text-xs text-slate-500 leading-relaxed">
          <p className="mb-2"><strong>How this works:</strong></p>
          <p>The "Decision Card" verdict will be weighted against these settings to give you a more personalized recommendation.</p>
        </div>
      </main>
    </div>
  );
};

export default PreferenceView;
