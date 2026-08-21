import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

// Singleton so we don't re-instantiate the client on every request
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
