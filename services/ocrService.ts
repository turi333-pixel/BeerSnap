
import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * Pluggable OCR Service.
 * Currently uses Tesseract.js (Local).
 * Can be replaced with Google Cloud Vision or other APIs later.
 */
export const extractTextFromImage = async (
  base64Image: string, 
  onProgress?: (progress: number) => void
): Promise<OCRResult> => {
  try {
    const { data: { text, confidence } } = await Tesseract.recognize(
      base64Image,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing' && onProgress) {
            onProgress(m.progress);
          }
        }
      }
    );
    
    return { text, confidence };
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to extract text from image.");
  }
};
