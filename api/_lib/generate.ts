import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { campaignInputSchema } from "../shared/campaign.js";
import { generateCampaignContent, GenerationError } from "./_lib/generate.js";

const bodySchema = z.object({
  campaign: campaignInputSchema,
  credential: z.string().trim().min(1, "Enter an access code or your OpenAI API key").max(300),
});

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

type KeyResult = { apiKey: string } | { status: number; message: string };

// Decide whose OpenAI key pays for this request:
//  - "sk-..."  -> the visitor's own key (costs you nothing)
//  - otherwise -> must match ACCESS_CODE, then your OPENAI_API_KEY is used
async function resolveApiKey(credential: string): Promise<KeyResult> {
  if (credential.startsWith("sk-")) {
    return { apiKey: credential };
  }

  const accessCode = process.env.ACCESS_CODE;
  const ownerKey = process.env.OPENAI_API_KEY;
  if (!accessCode || !ownerKey) {
    return {
      status: 403,
      message: "Shared access isn't turned on for this site. Paste your own OpenAI API key (it starts with sk-).",
    };
  }
  if (!safeEqual(credential, accessCode)) {
    // Small delay makes guessing codes slow.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { status: 401, message: "That access code isn't right." };
  }
  return { apiKey: ownerKey };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    const issue = parsed.error.errors[0];
    return res.status(400).json({
      message: issue.message,
      field: issue.path.join("."),
    });
  }

  const key = await resolveApiKey(parsed.data.credential);
  if (!("apiKey" in key)) {
    return res.status(key.status).json({ message: key.message });
  }

  try {
    const generatedContent = await generateCampaignContent(parsed.data.campaign, key.apiKey);
    return res.status(200).json({ generatedContent });
  } catch (err) {
    if (err instanceof GenerationError) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to generate campaign" });
  }
}
