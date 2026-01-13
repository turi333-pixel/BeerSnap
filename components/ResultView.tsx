
import React, { useState } from 'react';
import { ChevronLeft, Info, ThumbsUp, ThumbsDown, Star, AlertCircle } from 'lucide-react';
import { BeerProfile, HazeLevel, ConfidenceLevel } from '../types';

interface Props {
  profile: BeerProfile;
  onClose: () => void;
}

const ResultView: React.FC<Props> = ({ profile, onClose }) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  const StatItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
      <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">{label}</span>
      <span className="text-lg font-bold text-amber-500">{value}</span>
    </div>
  );

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800">
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Analysis</h2>
        <div className="w-10" />
      </header>

      <main className="p-4 space-y-6">
        {/* Decision Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-slate-900 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-black leading-tight mb-1">{profile.name}</h1>
              <p className="text-slate-900/70 font-bold uppercase tracking-widest text-xs">{profile.brewery}</p>
            </div>
            <div className="bg-slate-900/10 p-2 rounded-full backdrop-blur-sm">
              <Star size={20} className="fill-slate-900/20" />
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md mb-4">
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

        {/* Confidence Check */}
        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
           <div className={`p-2 rounded-full ${profile.confidence.level === ConfidenceLevel.HIGH ? 'bg-green-500/20 text-green-500' : profile.confidence.level === ConfidenceLevel.MEDIUM ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
              <AlertCircle size={18} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-400">Analysis Confidence: {profile.confidence.level}</p>
             <p className="text-[10px] text-slate-500">{profile.confidence.why}</p>
           </div>
        </div>

        {/* Taste Profile */}
        <section className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-inner">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-amber-500 rounded-full" />
            Taste Profile
          </h3>
          <Slider label="Bitterness" value={profile.taste.bitterness} tooltip="Higher means more hop bite or roasted char. IPA usually 6-9, Lager 2-4." />
          <Slider label="Sweetness" value={profile.taste.sweetness} tooltip="Residual sugar from malts. Pastry stouts are high, Pilsners are low." />
          <Slider label="Body" value={profile.taste.body} tooltip="Mouthfeel. Thin like water (1) or thick like motor oil (10)." />
          <Slider label="Carbonation" value={profile.taste.carbonation} tooltip="How 'fizzy' it feels. Saisons are high, barrel-aged stouts are lower." />
        </section>

        {/* Flavor Tags */}
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

        {/* You'll like this if / Avoid if */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 rounded-2xl p-5 border border-green-500/20">
            <h4 className="flex items-center gap-2 text-green-500 font-bold mb-3">
              <ThumbsUp size={18} /> You'll like this if...
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
            <h4 className="flex items-center gap-2 text-red-500 font-bold mb-3">
              <ThumbsDown size={18} /> Avoid if...
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

        {/* Food Pairings */}
        {profile.foodPairing && profile.foodPairing.length > 0 && (
          <section className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
            <h4 className="text-slate-400 text-xs font-bold uppercase mb-3">Food Pairing Ideas</h4>
            <div className="flex flex-wrap gap-2">
              {profile.foodPairing.map((food, i) => (
                <span key={i} className="text-sm font-medium bg-slate-700/50 px-3 py-1 rounded-lg">🍽️ {food}</span>
              ))}
            </div>
          </section>
        )}

        {/* Feedback Section */}
        <section className="text-center pt-4 pb-8 border-t border-slate-800">
          <p className="text-slate-400 text-sm mb-4">Was this analysis accurate?</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${feedback === 'yes' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              <ThumbsUp size={18} /> Yes
            </button>
            <button 
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${feedback === 'no' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              <ThumbsDown size={18} /> No
            </button>
          </div>
          {feedback && <p className="mt-4 text-xs text-amber-500 font-medium">Thanks for the feedback! It helps improve the engine.</p>}
        </section>
      </main>
    </div>
  );
};

export default ResultView;
