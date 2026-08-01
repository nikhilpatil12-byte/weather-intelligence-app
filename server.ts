import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for lazy Gemini initialization
let genaiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genaiClient) {
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

// API endpoint for AI Weather & Activity Briefing
app.post("/api/ai-briefing", async (req, res) => {
  try {
    const { city, country, currentTemp, conditionText, windSpeed, dailySummary, userActivityQuery } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        briefing: `Current conditions in ${city}, ${country}: ${conditionText} at ${currentTemp}°C with wind speed around ${windSpeed} km/h.`,
        recommendations: [
          {
            category: "Outdoor Activity",
            title: conditionText.includes("Rain") ? "Indoor Activities Advised" : "Great for Outdoor Recreation",
            advice: conditionText.includes("Rain")
              ? "Rain is anticipated; opt for indoor venues or waterproof gear."
              : "Temperatures and visibility look suitable for walks, jogging, or cycling."
          },
          {
            category: "Clothing & Gear",
            title: currentTemp < 15 ? "Layer Up" : "Light & Breathable",
            advice: currentTemp < 15
              ? "Bring a medium jacket or windbreaker for cooler intervals."
              : "Comfortable casual wear is recommended; stay hydrated."
          },
          {
            category: "Travel & Commute",
            title: "Road Conditions",
            advice: "Standard road conditions expected. Watch for gusty winds on open bridges."
          }
        ]
      });
    }

    const prompt = `You are an expert meteorologist and outdoor activity planner.
Based on the following weather data for ${city}, ${country}:
- Current Temperature: ${currentTemp}°C
- Current Condition: ${conditionText}
- Wind Speed: ${windSpeed} km/h
- 7-Day Overview: ${JSON.stringify(dailySummary || [])}
${userActivityQuery ? `- User's specific activity question: "${userActivityQuery}"` : ""}

Provide a concise, practical JSON response with:
1. "briefing": A 2-sentence executive weather summary for ${city}.
2. "recommendations": An array of 3 to 4 actionable suggestions. Each item must have:
   - "category": e.g., "Outdoor Activity", "Clothing & Gear", "Commute & Travel", or "Health & Comfort"
   - "title": short headline (3-5 words)
   - "advice": 1-2 sentence specific practical tip

Return ONLY valid JSON matching this structure:
{
  "briefing": "string",
  "recommendations": [
    { "category": "string", "title": "string", "advice": "string" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated");
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      isFallback: false,
      ...parsed
    });
  } catch (err: any) {
    console.error("AI Briefing Error:", err?.message || err);
    // Return graceful fallback so user always gets actionable advice
    return res.json({
      success: true,
      isFallback: true,
      briefing: `Weather in ${req.body.city || "your area"}: ${req.body.conditionText || "Fair"} at ${req.body.currentTemp || 20}°C.`,
      recommendations: [
        {
          category: "Outdoor Activity",
          title: "Check Skies Before Outings",
          advice: "Monitor local wind speeds and daily precipitation chance before long excursions."
        },
        {
          category: "Clothing & Gear",
          title: "Pack Versatile Layers",
          advice: "A light outer shell or umbrella is recommended as a general precaution."
        }
      ]
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
