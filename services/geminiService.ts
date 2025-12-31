
import { GoogleGenAI, Type } from "@google/genai";

export const getBusinessInsights = async (dataSummary: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Act as a Senior Retail Data Scientist at a top-tier MNC. 
    Analyze the following sales forecasting performance and historical data summary.
    
    Data Summary:
    ${dataSummary}
    
    Provide 4 highly actionable business recommendations focused on:
    1. Inventory management strategy
    2. Promotion timing optimization
    3. Staffing requirements based on seasonal peaks
    4. Mitigation of forecast errors
    
    Format the response as clear bullet points with "Action" and "Business Impact" for each.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating insights. Please ensure API key is configured.";
  }
};
