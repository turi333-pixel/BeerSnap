
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Check } from 'lucide-react';
import { StyleFamily } from '../types';

interface Props {
  onBack: () => void;
}

const COMMON_STYLES = ['IPA', 'NEIPA', 'Lager', 'Pilsner', 'Stout', 'Porter', 'Wheat', 'Sour', 'Saison', 'Pale Ale'];

const PreferenceView: React.FC<Props> = ({ onBack }) => {
  const [minAbv, setMinAbv] = useState(4);
  const [favFamilies, setFavFamilies] = useState<StyleFamily[]>([StyleFamily.HOPPY_BITTER]);
  const [favStyles, setFavStyles] = useState<string[]>(['IPA', 'NEIPA']);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const prefs = localStorage.getItem('beersnap_prefs');
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        setMinAbv(parsed.minAbv);
        if (parsed.favFamilies) setFavFamilies(parsed.favFamilies);
        if (parsed.favStyles) setFavStyles(parsed.favStyles);
      } catch (e) {
        console.error("Failed to load prefs", e);
      }
    }
  }, []);

  const save = () => {
    localStorage.setItem('beersnap_prefs', JSON.stringify({ minAbv, favFamilies, favStyles }));
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        onBack();
    }, 800);
  };

  const toggleFamily = (family: StyleFamily) => {
    if (favFamilies.includes(family)) {
      setFavFamilies(favFamilies.filter(f => f !== family));
    } else {
      setFavFamilies([...favFamilies, family]);
    }
  };

  const toggleStyle = (style: string) => {
    if (favStyles.includes(style)) {
      setFavStyles(favStyles.filter(s => s !== style));
    } else {
      setFavStyles([...favStyles, style]);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 min-h-screen bg-slate-900 flex flex-col">
       <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Taste Profile</h2>
        <div className="w-10" />
      </header>

      <main className="p-6 space-y-8 flex-1">
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Strength Preference</h3>
          
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-white">Minimum ABV Preference</p>
                <p className="text-amber-500 font-black text-lg">{minAbv}%</p>
              </div>
              <input 
                type="range" 
                min="0" 
                max="12" 
                step="0.5"
                value={minAbv}
                onChange={(e) => setMinAbv(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                <span>Session</span>
                <span>Regular</span>
                <span>Heavy</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Favorite Beer Styles</h3>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  favStyles.includes(style) 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-lg shadow-amber-500/5' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span className="font-bold text-xs">{style}</span>
                {favStyles.includes(style) && <Check size={14} />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Favorite Style Families</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(StyleFamily).map((family) => (
              <button
                key={family}
                onClick={() => toggleFamily(family)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  favFamilies.includes(family) 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span className="font-bold text-sm">{family}</span>
                {favFamilies.includes(family) && <Check size={18} />}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="p-6 sticky bottom-0 bg-slate-900 border-t border-slate-800 safe-bottom">
        <button 
          onClick={save}
          disabled={saved}
          className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
            saved ? 'bg-green-500 text-white' : 'bg-amber-500 text-slate-900'
          }`}
        >
          {saved ? <><Check size={20} /> Preferences Saved</> : <><Save size={20} /> Save My Profile</>}
        </button>
      </footer>
    </div>
  );
};

export default PreferenceView;
