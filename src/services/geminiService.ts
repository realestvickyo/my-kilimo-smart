import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  analyzeLeaf: async (base64Image: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `You are an expert plant pathologist and agronomist specializing EXCLUSIVELY in Kenyan maize production. 
              Analyze this maize leaf image with high precision. 
              1. Confirm if the image is indeed a maize leaf. If not, state "Not a maize leaf" in the diagnosis.
              2. Identify any maize-specific pests (e.g., Fall Armyworm, Maize Stalk Borer, Aphids), diseases (e.g., Maize Lethal Necrosis Disease (MLND), Maize Streak Virus, Grey Leaf Spot, Northern Leaf Blight, Rust), or nutrient deficiencies (e.g., Nitrogen, Phosphorus, Potassium).
              3. Provide a clear, technical diagnosis specifically for maize.
              4. Assign a severity level (low, moderate, high).
              5. Provide a confidence score (0-1).
              6. Offer 4-5 detailed, actionable recommendations for Kenyan maize farmers including:
                 - Immediate physical/cultural controls (e.g., handpicking FAW, rogueing MLND plants).
                 - Specific treatment guidelines (mentioning active ingredients common in Kenya like Emamectin benzoate for FAW, or fungicides for blights).
                 - Long-term prevention strategies (e.g., crop rotation, using certified seeds like H614D or SC Duma 43).
              Return the result in JSON format.` },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["low", "moderate", "high"] },
              confidence: { type: Type.NUMBER },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["diagnosis", "severity", "recommendations"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  },

  getPersonalizedAdvice: async (farmerData: any, soilMetrics: any) => {
    try {
      const prompt = `As an expert agronomist in Kenya, provide 3 personalized recommendations for a farmer with the following profile:
      - Location: ${farmerData.location}
      - Crops: ${farmerData.crops.map((c: any) => c.name).join(', ')}
      - Farm Size: ${farmerData.farmSize} acres
      - Soil Metrics: Moisture ${soilMetrics.moisture}%, pH ${soilMetrics.ph}, Nitrogen ${soilMetrics.nitrogen}, Temp ${soilMetrics.temp}°C
      
      Provide advice on irrigation, fertilizer application, and pest prevention specific to their region and crops. Return as a JSON array of objects with 'title', 'content', and 'type' (soil, crop, water, or pest).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["soil", "crop", "water", "pest"] }
              },
              required: ["title", "content", "type"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini Advice Error:", error);
      return [];
    }
  }
};
