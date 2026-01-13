
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Info, ThumbsUp, ThumbsDown, Star, AlertCircle, Heart, CheckCircle2, MapPin } from 'lucide-react';
import { BeerProfile, HazeLevel, ConfidenceLevel, UserPreferences } from '../types';

interface Props {
  profile: BeerProfile;
  preferences: UserPreferences;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

const ResultView: React.FC<Props> = ({ profile, preferences, isFavorite, onToggleFavorite, onClose }) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    if (showSavedMsg) {
      const timer = setTimeout(() => setShowSavedMsg(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSavedMsg]);

  const handleFavoriteClick = () => {
    onToggleFavorite();
    if (!isFavorite) {
      setShowSavedMsg(true);
    }
  };

  const matchStats = useMemo(() => {
    let score = 0;
    let reasons: string[] = [];
    
    // ABV Check
    if (profile.abv >= preferences.minAbv) {
      score += 33.3;
      reasons.push(`Strength is in your wheelhouse (${profile.abv}%)`);
    } else {
      reasons.push(`A bit lighter than your typical choice`);
    }

    // Family Check
    if (preferences.favFamilies.includes(profile.styleFamily)) {
      score += 33.3;
      reasons.push(`In one of your favorite style families: ${profile.styleFamily}`);
    } else {
      reasons.push(`Different from your usual ${preferences.favFamilies.join('/')} preference`);
    }

    // Specific Style Check
    const styleMatches = preferences.favStyles?.some(s => 
      profile.style.toLowerCase().includes(s.toLowerCase()) || 
      profile.substyle?.toLowerCase().includes(s.toLowerCase())
    );
    if (styleMatches) {
      score += 33.4;
      reasons.push(`Matches one of your go-to styles!`);
    }

    return { score: Math.round(score), reasons };
  }, [profile, preferences]);

  const Slider = ({ label, value, tooltip }: { label: string, value: number, tooltip: string }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">{label}</span>
          <div className="group relative">
            <Info size={14} className="text-slate-500 cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-700 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
              {tooltip}
            </div>
          </div>
        </div>
        <span className="text-sm font-bold text-amber-500">{value}/10</span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-500 transition-all duration-1000" 
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 relative">
      {showSavedMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-amber-500 text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-in zoom-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} />
          Saved to Favorites!
        </div>
      )}

      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Beer Analysis</h2>
        <button 
          onClick={handleFavoriteClick}
          className={`p-2 transition-all active:scale-125 ${isFavorite ? 'text-red-500' : 'text-slate-400'}`}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 2} />
        </button>
      </header>

      <main className="p-4 space-y-6">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-slate-900 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-black leading-tight mb-1">{profile.name}</h1>
              <div className="flex items-center gap-1.5 opacity-80">
                <p className="font-bold uppercase tracking-widest text-xs">{profile.brewery}</p>
                <span className="text-xs opacity-50">•</span>
                <div className="flex items-center gap-1">
                  <MapPin size={10} />
                  <p className="font-bold uppercase tracking-widest text-[10px]">{profile.country}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/10 p-2 rounded-full backdrop-blur-sm">
              <Star size={20} className="fill-slate-900/20" />
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md mb-4 border border-white/10">
            <p className="text-lg font-bold leading-snug">
              &ldquo;{profile.verdict}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 p-2 rounded-xl text-center">
              <span className="block text-[10px] uppercase opacity-60 font-bold">Style</span>
              <span className="text-sm font-black whitespace-nowrap overflow-hidden text-ellipsis">{profile.style}</span>
            </div>
            <div className="bg-white/20 p-2 rounded-xl text-center">
              <span className="block text-[10px] uppercase opacity-60 font-bold">ABV</span>
              <span className="text-sm font-black">{profile.abv}%</span>
            </div>
            <div className="bg-white/20 p-2 rounded-xl text-center">
              <span className="block text-[10px] uppercase opacity-60 font-bold">Haze</span>
              <span className="text-sm font-black">{profile.haze}</span>
            </div>
          </div>
        </div>

        {!isFavorite && (
          <button 
            onClick={handleFavoriteClick}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-amber-500 transition-all active:scale-95"
          >
            <Heart size={20} />
            Save to Favorites
          </button>
        )}

        <section className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Heart size={80} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-center gap-4 mb-4 relative">
             <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-700" />
                  <circle 
                    cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" 
                    className="text-amber-500 transition-all duration-1000"
                    strokeDasharray={175.92}
                    strokeDashoffset={175.92 - (175.92 * matchStats.score / 100)}
                  />
                </svg>
                <span className="absolute text-sm font-black text-white">{matchStats.score}%</span>
             </div>
             <div>
                <h3 className="text-lg font-bold text-white">Taste Match</h3>
                <p className="text-xs text-slate-400">Based on your preferences</p>
             </div>
          </div>
          <div className="space-y-2 relative">
             {matchStats.reasons.map((reason, i) => (
               <div key={i} className="flex gap-2 text-xs font-medium text-slate-300">
                 <span className={reason.includes("Matches") || reason.includes("Strength is") || reason.includes("In one of") || reason.includes("go-to styles") ? "text-amber-500" : "text-slate-500"}>•</span>
                 {reason}
               </div>
             ))}
          </div>
        </section>

        <div className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-2xl border border-slate-800">
           <div className={`p-2 rounded-full ${profile.confidence.level === ConfidenceLevel.HIGH ? 'bg-green-500/20 text-green-500' : profile.confidence.level === ConfidenceLevel.MEDIUM ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
              <AlertCircle size={18} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-400">Analysis Confidence: {profile.confidence.level}</p>
             <p className="text-[10px] text-slate-500">{profile.confidence.why}</p>
           </div>
        </div>

        <section className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <span className="w-1 h-6 bg-amber-500 rounded-full" />
            Flavor Breakdown
          </h3>
          <Slider label="Bitterness" value={profile.taste.bitterness} tooltip="Higher means more hop bite or roasted char." />
          <Slider label="Sweetness" value={profile.taste.sweetness} tooltip="Residual sugar from malts." />
          <Slider label="Body" value={profile.taste.body} tooltip="Mouthfeel. Thin like water (1) or thick like motor oil (10)." />
          <Slider label="Carbonation" value={profile.taste.carbonation} tooltip="How 'fizzy' it feels." />
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Dominant Notes</h3>
          <div className="flex flex-wrap gap-2">
            {profile.flavourNotes.map((note, i) => (
              <span key={i} className="px-4 py-2 bg-slate-800 rounded-full text-sm font-bold text-amber-400 border border-slate-700">
                {note}
              </span>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <div className="bg-green-500/10 rounded-2xl p-5 border border-green-500/20">
            <h4 className="flex items-center gap-2 text-green-500 font-bold mb-3 uppercase text-xs tracking-widest">
              <ThumbsUp size={16} /> Why you'll like it
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {profile.youWillLikeIf.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/10 rounded-2xl p-5 border border-red-500/20">
            <h4 className="flex items-center gap-2 text-red-500 font-bold mb-3 uppercase text-xs tracking-widest">
              <ThumbsDown size={16} /> Why you might not
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {profile.avoidIf.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="text-center pt-8 pb-8 border-t border-slate-800">
          <p className="text-slate-400 text-sm mb-4">Was this accurate?</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${feedback === 'yes' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-400'}`}
            >
              <ThumbsUp size={18} /> Yes
            </button>
            <button 
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${feedback === 'no' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-400'}`}
            >
              <ThumbsDown size={18} /> No
            </button>
          </div>
          {feedback && <p className="mt-4 text-xs text-amber-500 font-bold animate-bounce">Thanks for the feedback!</p>}
        </section>
      </main>
    </div>
  );
};

export default ResultView;
