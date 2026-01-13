
import { GoogleGenAI, Type } from "@google/genai";
import { BeerProfile, StyleFamily, StrengthCategory, Drinkability, HazeLevel, ConfidenceLevel } from "../types";

// Note: process.env.API_KEY is handled by the platform
// Always use the API key directly from process.env.API_KEY for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const beerProfileSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Best guess for beer name" },
    brewery: { type: Type.STRING, description: "Best guess for brewery name" },
    style: { type: Type.STRING, description: "General style like IPA, Stout, etc." },
    substyle: { type: Type.STRING, description: "Specific substyle" },
    styleFamily: { 
      type: Type.STRING, 
      enum: Object.values(StyleFamily),
      description: "One of the controlled style families"
    },
    abv: { type: Type.NUMBER, description: "ABV percentage" },
    strengthCategory: { 
      type: Type.STRING, 
      enum: Object.values(StrengthCategory) 
    },
    drinkability: { 
      type: Type.STRING, 
      enum: Object.values(Drinkability) 
    },
    haze: { 
      type: Type.STRING, 
      enum: Object.values(HazeLevel) 
    },
    taste: {
      type: Type.OBJECT,
      properties: {
        bitterness: { type: Type.NUMBER, description: "0-10" },
        sweetness: { type: Type.NUMBER, description: "0-10" },
        body: { type: Type.NUMBER, description: "0-10" },
        carbonation: { type: Type.NUMBER, description: "0-10" }
      },
      required: ["bitterness", "sweetness", "body", "carbonation"]
    },
    flavourNotes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-4 notes from: citrus, tropical, stone fruit, berry, bread, caramel, biscuit, toffee, coffee, chocolate, burnt, pine, resin, pepper, herbal, lemony, tart, farmhouse, funky"
    },
    verdict: { type: Type.STRING, description: "1 sentence opinionated summary" },
    youWillLikeIf: { type: Type.ARRAY, items: { type: Type.STRING }, description: "1-2 bullets" },
    avoidIf: { type: Type.ARRAY, items: { type: Type.STRING }, description: "1-2 bullets" },
    foodPairing: { type: Type.ARRAY, items: { type: Type.STRING } },
    confidence: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING, enum: Object.values(ConfidenceLevel) },
        why: { type: Type.STRING }
      },
      required: ["level", "why"]
    }
  },
  required: [
    "name", "brewery", "style", "styleFamily", "abv", "strengthCategory", 
    "drinkability", "haze", "taste", "flavourNotes", "verdict", 
    "youWillLikeIf", "avoidIf", "confidence"
  ]
};

export const analyzeBeerImage = async (base64Image: string): Promise<Partial<BeerProfile>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Analyze this beer label or menu. Extract all relevant beer details and provide a full profile based on the visual information and your knowledge of common beer styles." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: beerProfileSchema,
        temperature: 0.1,
      },
    });

    // Access the .text property directly (do not call as a method)
    const result = JSON.parse(response.text || '{}');
    return {
      ...result,
      id: crypto.randomUUID(),
      capturedAt: Date.now(),
      imageData: base64Image
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
