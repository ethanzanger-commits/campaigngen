import OpenAI from "openai";
import type { CampaignInput } from "../../shared/campaign.js";

export class GenerationError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function buildPrompt(input: CampaignInput): string {
  return `Create a comprehensive, PERSONALIZED marketing campaign for this specific product. Make recommendations UNIQUE based on ALL provided context.

CRITICAL: Use these inputs to tailor EVERY recommendation:
- Product: ${input.productName} - ${input.description}
- Target Audience: ${input.audience}
- Tone/Style: ${input.tone}
${input.competitors && input.competitors.length > 0 ? `- User-provided Competitors: ${input.competitors.join(", ")}` : ""}
${input.campaignStartDate ? `- Campaign Period: ${input.campaignStartDate} to ${input.campaignEndDate || "TBD"}` : ""}
${input.kpis && input.kpis.length > 0 ? `- KPIs: ${input.kpis.join(", ")}` : ""}
${input.budget ? `- Budget: ${input.budget}` : ""}

PERSONALIZATION RULES:
1. Generate UNIQUE slogans that reflect the ACTUAL tone (${input.tone}) and audience (${input.audience})
2. Create platform-specific posts tailored to ${input.audience}, NOT generic content
3. Recommend vendors and budgets SPECIFICALLY for this product category
4. INCLUDE specific marquee units/ad formats (carousel ads, collection ads, horizontal video ads, native ads, etc)
5. PROVIDE detailed rationale explaining WHY each vendor is chosen for THIS product and audience
6. AUTO-SUGGEST 3 likely competitors if fewer than 3 were provided.
7. For Competitor Analysis: Provide data sources (e.g. "SimilarWeb", "Pathmatics") and recent creative examples (Display, Video, Audio) with descriptive links or references.
8. For Creative Mocks: Provide a "prompt" field for an image generation tool that would create a high-quality visual for this mock.

Return ONLY valid JSON:

{
  "slogans": ["unique slogan 1", "unique slogan 2", "unique slogan 3"],
  "sellingPoints": ["point 1", "point 2", "point 3"],
  "socialMediaPosts": [
    {"platform": "Twitter", "content": "post tailored to audience"}
  ],
  "emailDraft": {
    "subject": "compelling subject",
    "body": "email body"
  },
  "mediaVendorRecommendations": [
    {
      "platform": "Google Search Ads",
      "vendor": "Google",
      "category": "Search",
      "marqueeUnits": ["Search Text Ads", "Performance Max"],
      "recommendedBudgetPercentage": 22,
      "rationale": "Rationale here...",
      "monthlyBudget": 5500,
      "estimatedMonthlyImpressions": 180000
    }
  ],
  "competitorAnalysis": [
    {
      "competitor": "Competitor Name",
      "estimatedMonthlySpend": "$X,XXX",
      "strongChannels": ["Channel 1"],
      "positioningGap": "Gap description",
      "dataSources": ["SimilarWeb", "Internal Estimates"],
      "creativeExamples": [
        {"type": "Video", "description": "YouTube pre-roll showing product lifestyle", "link": "https://www.youtube.com/watch?v=example"},
        {"type": "Display", "description": "Banner ad on tech blogs", "link": "https://example.com/ads/banner1"}
      ]
    }
  ],
  "budgetRecommendation": {
    "recommendedTotal": "$25000",
    "breakdown": {
      "socialMedia": "40%",
      "searchAds": "22%"
    }
  },
  "creativeMocks": [
    {
      "type": "Instagram Post",
      "platform": "Instagram",
      "headline": "Headline",
      "visualDescription": "Visual description for human",
      "imagePrompt": "A professional product photography of [Product] for [Audience] in [Tone] style, high quality, 8k",
      "callToAction": "Shop Now"
    }
  ],
  "estimatedMetrics": {
    "expectedReachMonthly": "Reach info",
    "expectedConversionRate": "3-6%",
    "expectedROI": "400-600%",
    "estimatedCPA": "$8-25",
    "expectedEngagementRate": "4-10%"
  },
  "bigIdea": {
    "headline": "Headline",
    "concept": "Concept description",
    "executionChannels": ["TikTok"]
  }
}`;
}

export async function generateCampaignContent(
  input: CampaignInput,
  apiKey: string,
): Promise<Record<string, unknown>> {
  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  let raw: string | null | undefined;
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: buildPrompt(input) }],
      response_format: { type: "json_object" },
      // Hard ceiling on what one request can cost.
      max_completion_tokens: 8000,
    });
    raw = completion.choices[0]?.message?.content;
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      // Log status and code only. Never log keys or request bodies.
      console.error("OpenAI error", err.status, err.code);
      if (err.status === 401) {
        throw new GenerationError(401, "OpenAI rejected that API key. Check it and try again.");
      }
      if (err.status === 429) {
        throw new GenerationError(
          429,
          "OpenAI says this key is out of credit or rate-limited. Check your OpenAI billing and try again.",
        );
      }
      if (err.status === 404) {
        throw new GenerationError(
          502,
          `The model "${model}" isn't available to this key. Set OPENAI_MODEL to a model you can use.`,
        );
      }
    } else {
      console.error("Generation error", err instanceof Error ? err.name : "unknown");
    }
    throw new GenerationError(502, "The AI service had a problem. Please try again.");
  }

  if (!raw) {
    throw new GenerationError(502, "The AI returned an empty response. Please try again.");
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new GenerationError(502, "The AI returned something we couldn't read. Please try again.");
  }
}
