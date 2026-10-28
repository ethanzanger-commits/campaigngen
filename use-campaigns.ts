import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { CampaignInput } from "@shared/campaign";
import {
  saveCampaign,
  useStoredCampaigns,
} from "@/lib/campaign-store";
import { saveCredential } from "@/lib/credential";

export function useCampaigns() {
  return useStoredCampaigns();
}

export function useCampaign(id: string) {
  return useStoredCampaigns().find((c) => c.id === id);
}

async function errorMessageFrom(res: Response, fallback: string): Promise<string> {
  if (res.status === 504) {
    return "Generation took too long and timed out. Please try again.";
  }
  try {
    const body = await res.json();
    if (body && typeof body.message === "string") return body.message;
  } catch {
    // not JSON
  }
  return fallback;
}

export function useCreateCampaign() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (input: CampaignInput, credential: string) => {
      setIsPending(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaign: input, credential }),
        });
        if (!res.ok) {
          throw new Error(await errorMessageFrom(res, "Failed to generate campaign"));
        }
        const { generatedContent } = await res.json();
        const saved = saveCampaign(input, generatedContent);
        saveCredential(credential);
        toast({
          title: "Campaign generated",
          description: `Saved ${saved.productName} to this browser.`,
        });
        setLocation(`/campaigns/${saved.id}`);
      } catch (error) {
        toast({
          title: "Couldn't generate the campaign",
          description: error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsPending(false);
      }
    },
    [toast, setLocation],
  );

  return { mutate, isPending };
}
