import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const savedKeys = localStorage.getItem('founder_os_keys');
  let apiKey = process.env.GEMINI_API_KEY || "";
  
  if (savedKeys) {
    const keys = JSON.parse(savedKeys);
    if (keys.gemini) apiKey = keys.gemini;
  }
  
  return new GoogleGenAI({ apiKey });
};

const handleAIError = (error: any) => {
  console.error("AI Service Error:", error);
  if (error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED") {
    throw new Error("AI Quota Exceeded: The API key has reached its limit. Please try again later or use a different key in Settings.");
  }
  throw error;
};

export const analyzeStartup = async (input: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this startup data: "${input}". 
      Extract the business domain, sector, best revenue model, and key value proposition.
      Also provide a list of 5 initial tasks for an execution roadmap.
      Return the data in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING },
            sector: { type: Type.STRING },
            revenueModel: { type: Type.STRING },
            valueProp: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedSymbol: { type: Type.STRING, description: "A relevant stock symbol for market comparison (e.g., AAPL, TSLA)" },
            scores: {
              type: Type.OBJECT,
              properties: {
                startupScore: { type: Type.NUMBER },
                riskScore: { type: Type.NUMBER },
                successProbability: { type: Type.NUMBER },
                marketOpportunity: { type: Type.NUMBER }
              },
              required: ["startupScore", "riskScore", "successProbability", "marketOpportunity"]
            },
            feasibility: { type: Type.STRING },
            caseStudy: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                keyTakeaway: { type: Type.STRING }
              },
              required: ["name", "description", "keyTakeaway"]
            }
          },
          required: ["domain", "sector", "revenueModel", "valueProp", "tasks", "suggestedSymbol", "scores", "feasibility", "caseStudy"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return handleAIError(error);
  }
};

export const analyzeMarket = async (idea: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the market for this startup idea: "${idea}". 
      Provide TAM, SAM, SOM estimates in INR (Cr), a list of top 3 competitors with their strengths and gaps, and a brief market sentiment analysis.
      Return the data in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tam: { type: Type.STRING },
            sam: { type: Type.STRING },
            som: { type: Type.STRING },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  gap: { type: Type.STRING },
                  marketShare: { type: Type.NUMBER }
                }
              }
            },
            sentiment: { type: Type.STRING }
          },
          required: ["tam", "sam", "som", "competitors", "sentiment"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return handleAIError(error);
  }
};

export const getAIMentorResponse = async (idea: string, message: string, history: any[]) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: `Startup Idea: ${idea}` }] },
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are a world-class startup mentor. Provide strategic, actionable, and blunt advice. Help the founder navigate challenges in product, growth, and fundraising."
      }
    });
    return response.text;
  } catch (error) {
    return handleAIError(error);
  }
};

export const generateFinancialModel = async (idea: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 5-year financial projection for this startup idea: "${idea}". 
      Provide annual revenue, expenses, and profit estimates. 
      Also provide a list of key financial assumptions.
      Return the data in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.NUMBER },
                  revenue: { type: Type.NUMBER },
                  expenses: { type: Type.NUMBER },
                  profit: { type: Type.NUMBER }
                }
              }
            },
            assumptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["projections", "assumptions"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return handleAIError(error);
  }
};

export const generateReportData = async (idea: string, reportType: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a detailed ${reportType} report for the startup idea: "${idea}". 
      Include sections like Executive Summary, Market Analysis, Strategy, and Financial Highlights.
      Make it professional and data-driven.
      Return the data in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            businessName: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              }
            }
          },
          required: ["title", "businessName", "sections"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return handleAIError(error);
  }
};

export const fetchTrendsWithGemini = async (query: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for Google Trends data for the keyword: "${query}". 
      Provide interest over time data for the last 12 months as a list of data points with date and value (0-100).
      Return the data in JSON format matching the SerpApi structure for interest_over_time.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interest_over_time: {
              type: Type.OBJECT,
              properties: {
                timeline_data: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      values: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            extracted_value: { type: Type.NUMBER }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return handleAIError(error);
  }
};

export const fetchCompetitorsWithGemini = async (query: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for top competitors for the startup niche: "${query}". 
      Provide a list of 5 competitors with their name (title) and website link.
      Return the data in JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              link: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    return handleAIError(error);
  }
};

export const fetchTrendingProblems = async (domain: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Identify top 5 trending problems in the "${domain}" domain specifically for India and the US. 
      Return the data in JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              problem: { type: Type.STRING },
              region: { type: Type.STRING, enum: ["India", "US"] },
              description: { type: Type.STRING }
            },
            required: ["problem", "region", "description"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    return handleAIError(error);
  }
};

export const fetchIncubationAndFunding = async (domain: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find top 5 incubation websites and top 5 government funding websites for startups in the "${domain}" domain. 
      Return the data in JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            incubation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["name", "url"]
              }
            },
            funding: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["name", "url"]
              }
            }
          },
          required: ["incubation", "funding"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return handleAIError(error);
  }
};
