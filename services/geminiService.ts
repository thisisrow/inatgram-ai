import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("Gemini API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to convert an image URL to base64 (needed because Canvas/DOM might be tainted otherwise)
// Note: This often requires a proxy if the image server doesn't support CORS. 
// For this demo, we assume the user might upload or we rely on Instagram hosting allowing it (which is hit or miss).
// A robust solution fetches the image buffer via a backend proxy.
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { mode: 'cors' }); // Try standard CORS
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data url prefix (e.g., "data:image/jpeg;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Could not process image for AI analysis due to CORS restrictions. In a production app, a backend proxy is required.");
  }
};

export const analyzeInstagramPost = async (imageBase64: string, currentCaption?: string): Promise<AIAnalysisResult> => {
  const ai = getAiClient();
  
  const prompt = `
    Analyze this Instagram post image. 
    The current caption is: "${currentCaption || 'No caption'}".
    
    1. Write a new, engaging caption that is better than the current one.
    2. Suggest 5-10 relevant, high-reach hashtags.
    3. Describe the "vibe" or aesthetic of the image in one short sentence.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
          hashtags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          vibe: { type: Type.STRING }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as AIAnalysisResult;
  }
  
  throw new Error("Failed to generate AI analysis.");
};
