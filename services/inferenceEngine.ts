
import { BeerProfile, StyleFamily, StrengthCategory, Drinkability, HazeLevel, ConfidenceLevel } from "../types";

/**
 * Analyzes raw text to infer beer characteristics.
 * This is a deterministic engine that works offline/locally.
 */
export const getProfileFromText = (text: string): BeerProfile => {
  const t = text.toLowerCase();
  
  // 1. Identification
  let name = "Unknown Beer";
  let brewery = "Unknown Brewery";
  let country = "Unknown Country";
  
  // Very basic extraction: looking for common beer brand markers
  const lines = text.split('\n').filter(l => l.trim().length > 3);
  if (lines.length > 0) {
    name = lines[0].trim();
    if (lines.length > 1) brewery = lines[1].trim();
  }

  // 2. ABV Extraction
  let abv = 5.0;
  const abvMatch = t.match(/(\d+(\.\d+)?)%/);
  if (abvMatch) abv = parseFloat(abvMatch[1]);

  // 3. Style Inference
  let style = "Lager";
  let family = StyleFamily.CRISP_CLEAN;
  let haze = HazeLevel.CLEAR;
  let notes = ['malty', 'refreshing'];
  let bit = 3; let swe = 3; let body = 4; let carb = 6;

  const styles = [
    { key: 'ipa', style: 'IPA', fam: StyleFamily.HOPPY_BITTER, bit: 7, notes: ['citrus', 'pine'], haze: HazeLevel.CLEAR },
    { key: 'hazy', style: 'Hazy IPA', fam: StyleFamily.HOPPY_BITTER, bit: 5, notes: ['tropical', 'stone fruit'], haze: HazeLevel.HAZY },
    { key: 'neipa', style: 'NEIPA', fam: StyleFamily.HOPPY_BITTER, bit: 4, notes: ['tropical', 'juicy'], haze: HazeLevel.HAZY },
    { key: 'stout', style: 'Stout', fam: StyleFamily.DARK_ROASTED, bit: 4, swe: 5, body: 8, carb: 3, notes: ['coffee', 'chocolate'], haze: HazeLevel.OPAQUE },
    { key: 'porter', style: 'Porter', fam: StyleFamily.DARK_ROASTED, bit: 4, swe: 4, body: 7, carb: 4, notes: ['roasted', 'caramel'], haze: HazeLevel.OPAQUE },
    { key: 'sour', style: 'Sour', fam: StyleFamily.SOUR_FUNKY, bit: 1, swe: 2, body: 3, notes: ['lemony', 'tart'], haze: HazeLevel.SLIGHTLY_HAZY },
    { key: 'pilsner', style: 'Pilsner', fam: StyleFamily.CRISP_CLEAN, bit: 4, notes: ['crisp', 'herbal'], haze: HazeLevel.CLEAR },
    { key: 'wheat', style: 'Wheat Beer', fam: StyleFamily.CRISP_CLEAN, bit: 2, swe: 3, body: 5, notes: ['clove', 'banana'], haze: HazeLevel.HAZY },
  ];

  for (const s of styles) {
    if (t.includes(s.key)) {
      style = s.style;
      family = s.fam;
      bit = s.bit ?? bit;
      swe = s.swe ?? swe;
      body = s.body ?? body;
      carb = s.carb ?? carb;
      notes = s.notes;
      haze = s.haze;
      break;
    }
  }

  // 4. Strength Category
  let strength = StrengthCategory.REGULAR;
  if (abv < 4.5) strength = StrengthCategory.SESSION;
  else if (abv > 8) strength = StrengthCategory.HEAVY_HITTER;
  else if (abv > 6) strength = StrengthCategory.STRONG;

  // 5. Verdict
  const verdict = `A ${strength.toLowerCase()} ${style} with ${notes.join(' and ')} notes.`;

  return {
    id: crypto.randomUUID(),
    name,
    brewery,
    country,
    style,
    styleFamily: family,
    abv,
    strengthCategory: strength,
    drinkability: abv > 7 ? Drinkability.SLOW : Drinkability.BALANCED,
    haze,
    taste: { bitterness: bit, sweetness: swe, body, carbonation: carb },
    flavourNotes: notes,
    verdict,
    youWillLikeIf: [`You enjoy ${style} styles`, `You prefer ${family.toLowerCase()} flavors`],
    avoidIf: [abv > 7 ? "You want something light and easy" : "You want a complex heavy hitter"],
    foodPairing: ["Bar snacks", "Grilled meats"],
    confidence: { level: ConfidenceLevel.LOW, why: "Inferred from keywords in OCR text." },
    capturedAt: Date.now()
  };
};
