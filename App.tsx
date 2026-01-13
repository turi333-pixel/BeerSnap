
import React, { useState, useEffect } from 'react';
import { Camera, Upload, Beer, History, Settings, Zap, Cpu, Heart } from 'lucide-react';
import { BeerProfile, UserPreferences, StyleFamily } from './types';
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import FavoritesView from './components/FavoritesView';
import PreferenceView from './components/PreferenceView';
import { analyzeBeerImage } from './services/geminiService';
import { extractTextFromImage } from './services/ocrService';
import { getProfileFromText } from './services/inferenceEngine';
import { createThumbnail } from './services/imageUtils';

type View = 'home' | 'camera' | 'result' | 'history' | 'favorites' | 'preferences' | 'loading';
type AnalysisMode = 'ai' | 'local';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentProfile, setCurrentProfile] = useState<BeerProfile | null>(null);
  const [history, setHistory] = useState<BeerProfile[]>([]);
  const [favorites, setFavorites] = useState<BeerProfile[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('ai');
  const [preferences, setPreferences] = useState<UserPreferences>({
    minAbv: 4,
    favFamilies: [StyleFamily.HOPPY_BITTER],
    favStyles: ['IPA', 'NEIPA']
  });
  
  useEffect(() => {
    const saved = localStorage.getItem('beersnap_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    
    const savedFavs = localStorage.getItem('beersnap_favorites');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }

    const savedMode = localStorage.getItem('beersnap_mode') as AnalysisMode;
    if (savedMode) setAnalysisMode(savedMode);

    const savedPrefs = localStorage.getItem('beersnap_prefs');
    if (savedPrefs) {
      try { setPreferences(JSON.parse(savedPrefs)); } catch (e) { console.error(e); }
    }
  }, []);

  const persistItems = (key: string, items: BeerProfile[]) => {
    try {
      // Stripping high-res but KEEPING thumbnailData
      const storageItems = items.map(item => ({ 
        ...item, 
        imageData: undefined 
      }));
      localStorage.setItem(key, JSON.stringify(storageItems));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage`, e);
      if (key === 'beersnap_history') {
        localStorage.removeItem('beersnap_history');
      }
    }
  };

  const saveToHistory = (profile: BeerProfile) => {
    const updated = [profile, ...history].slice(0, 20);
    setHistory(updated);
    persistItems('beersnap_history', updated);
  };

  const toggleFavorite = (profile: BeerProfile) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === profile.id);
      let updated;
      if (isFav) {
        updated = prev.filter(f => f.id !== profile.id);
      } else {
        updated = [profile, ...prev];
      }
      persistItems('beersnap_favorites', updated);
      return updated;
    });
  };

  const toggleMode = () => {
    const newMode = analysisMode === 'ai' ? 'local' : 'ai';
    setAnalysisMode(newMode);
    localStorage.setItem('beersnap_mode', newMode);
  };

  const handleImageCapture = async (base64: string) => {
    setCurrentView('loading');
    setLoadingProgress(0);

    try {
      // Create thumbnail immediately for storage
      const thumbnail = await createThumbnail(base64);

      let profileData: Partial<BeerProfile>;
      if (analysisMode === 'ai') {
        setLoadingMessage('Gemini AI is analyzing...');
        profileData = await analyzeBeerImage(base64);
      } else {
        setLoadingMessage('Extracting text (OCR)...');
        const { text } = await extractTextFromImage(base64, (p) => setLoadingProgress(p * 100));
        setLoadingMessage('Inferring beer profile...');
        profileData = getProfileFromText(text);
      }

      const fullProfile = { 
        ...profileData, 
        imageData: base64, 
        thumbnailData: thumbnail 
      } as BeerProfile;

      setCurrentProfile(fullProfile);
      saveToHistory(fullProfile);
      setCurrentView('result');
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Try a clearer photo.");
      setCurrentView('home');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleImageCapture(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePrefsUpdated = () => {
    const savedPrefs = localStorage.getItem('beersnap_prefs');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="mb-4 p-6 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20">
              <Beer size={48} className="text-slate-900" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-white">BeerSnap</h1>
            <p className="text-slate-400 mb-8 max-w-xs">Scan any beer to see if you'll like it.</p>
            
            <button 
              onClick={toggleMode}
              className="mb-8 flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-bold border border-slate-700 active:scale-95 transition-all"
            >
              {analysisMode === 'ai' ? (
                <><Zap size={14} className="text-amber-500" /> Deep AI Mode</>
              ) : (
                <><Cpu size={14} className="text-blue-400" /> Fast Local Mode</>
              )}
            </button>

            <div className="grid gap-4 w-full max-w-sm">
              <button 
                onClick={() => setCurrentView('camera')}
                className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-6 rounded-2xl transition-all active:scale-95"
              >
                <Camera size={24} />
                Snap a Beer
              </button>
              
              <label className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-2xl cursor-pointer transition-all active:scale-95">
                <Upload size={20} />
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        );

      case 'camera':
        return <CameraView onCapture={handleImageCapture} onCancel={() => setCurrentView('home')} />;

      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-8">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <Beer size={28} className="absolute inset-0 m-auto text-amber-500 animate-pulse" />
            </div>
            <p className="text-xl font-medium text-amber-500 mb-2">{loadingMessage}</p>
            {analysisMode === 'local' && loadingProgress > 0 && (
               <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all" style={{ width: `${loadingProgress}%` }} />
               </div>
            )}
          </div>
        );

      case 'result':
        return currentProfile ? (
          <ResultView 
            profile={currentProfile} 
            preferences={preferences}
            isFavorite={favorites.some(f => f.id === currentProfile.id)}
            onToggleFavorite={() => toggleFavorite(currentProfile)}
            onClose={() => setCurrentView('home')} 
          />
        ) : null;

      case 'history':
        return <HistoryView items={history} onSelect={(p) => { setCurrentProfile(p); setCurrentView('result'); }} onBack={() => setCurrentView('home')} />;

      case 'favorites':
        return <FavoritesView items={favorites} preferences={preferences} onSelect={(p) => { setCurrentProfile(p); setCurrentView('result'); }} onBack={() => setCurrentView('home')} />;

      case 'preferences':
        return <PreferenceView onBack={() => { handlePrefsUpdated(); setCurrentView('home'); }} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-20 bg-slate-900">
      {renderView()}
      {['home', 'history', 'favorites', 'preferences'].includes(currentView) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-800/80 backdrop-blur-lg border-t border-slate-700 px-8 py-4 flex justify-between items-center z-50 safe-bottom">
          <button onClick={() => setCurrentView('home')} className={`p-2 transition-colors ${currentView === 'home' ? 'text-amber-500' : 'text-slate-400'}`}>
            <Beer size={24} />
          </button>
          <button onClick={() => setCurrentView('favorites')} className={`p-2 transition-colors ${currentView === 'favorites' ? 'text-amber-500' : 'text-slate-400'}`}>
            <Heart size={24} />
          </button>
          <button onClick={() => setCurrentView('history')} className={`p-2 transition-colors ${currentView === 'history' ? 'text-amber-500' : 'text-slate-400'}`}>
            <History size={24} />
          </button>
          <button onClick={() => setCurrentView('preferences')} className={`p-2 transition-colors ${currentView === 'preferences' ? 'text-amber-500' : 'text-slate-400'}`}>
            <Settings size={24} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
