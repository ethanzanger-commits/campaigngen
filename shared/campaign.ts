import { z } from "zod";

// What the form collects and the API accepts. Length limits also cap how many
// tokens a single request can cost.
export const campaignInputSchema = z.object({
  productName: z.string().trim().min(1, "Product name is required").max(120),
  description: z.string().trim().min(1, "Description is required").max(2000),
  audience: z.string().trim().min(1, "Target audience is required").max(300),
  tone: z.string().min(1, "Choose a tone").max(50),
  budget: z.string().max(100).optional().default(""),
  kpis: z.array(z.string().max(100)).max(20).optional().default([]),
  campaignStartDate: z.string().max(20).optional(),
  campaignEndDate: z.string().max(20).optional(),
  competitors: z.array(z.string().max(100)).max(20).optional().default([]),
});

export type CampaignInput = z.infer<typeof campaignInputSchema>;

// A campaign as saved in the visitor's browser.
export interface StoredCampaign extends CampaignInput {
  id: string;
  createdAt: string;
  generatedContent: any;
}
