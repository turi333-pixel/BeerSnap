
export enum StyleFamily {
  CRISP_CLEAN = 'Crisp & clean',
  HOPPY_BITTER = 'Hoppy & bitter',
  MALTY_SWEET = 'Malty & sweet',
  DARK_ROASTED = 'Dark & roasted',
  SOUR_FUNKY = 'Sour & funky'
}

export enum StrengthCategory {
  SESSION = 'Session (<4.5%)',
  REGULAR = 'Regular (4.5–6%)',
  STRONG = 'Strong (6–8%)',
  HEAVY_HITTER = 'Heavy hitter (>8%)'
}

export enum Drinkability {
  EASY = 'Easy-drinking',
  BALANCED = 'Balanced',
  SLOW = 'Sip-slowly'
}

export enum HazeLevel {
  CLEAR = 'Clear',
  SLIGHTLY_HAZY = 'Slightly hazy',
  HAZY = 'Hazy',
  OPAQUE = 'Opaque'
}

export enum ConfidenceLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface TasteProfile {
  bitterness: number; // 0-10
  sweetness: number; // 0-10
  body: number; // 0-10
  carbonation: number; // 0-10
}

export interface BeerProfile {
  id: string;
  name: string;
  brewery: string;
  country: string;
  style: string;
  substyle?: string;
  styleFamily: StyleFamily;
  abv: number;
  strengthCategory: StrengthCategory;
  drinkability: Drinkability;
  haze: HazeLevel;
  taste: TasteProfile;
  flavourNotes: string[];
  verdict: string;
  youWillLikeIf: string[];
  avoidIf: string[];
  foodPairing: string[];
  confidence: {
    level: ConfidenceLevel;
    why: string;
  };
  capturedAt: number;
  imageData?: string; // High-res base64 (memory only)
  thumbnailData?: string; // Low-res base64 (for storage)
}

export interface UserPreferences {
  minAbv: number;
  favFamilies: StyleFamily[];
  favStyles: string[];
}
