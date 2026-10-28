import { useSyncExternalStore } from "react";
import type { CampaignInput, StoredCampaign } from "@shared/campaign";

// Campaigns live in this browser's localStorage. They are not sent anywhere
// except to /api/generate when a campaign is being created.
const STORAGE_KEY = "campaigngen:campaigns";
const CHANGE_EVENT = "campaigngen:campaigns-changed";

let cachedRaw: string | null = null;
let cachedList: StoredCampaign[] = [];

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// Returns a stable array reference until the stored data changes
// (required by useSyncExternalStore).
function getSnapshot(): StoredCampaign[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      cachedList = Array.isArray(parsed) ? parsed : [];
    } catch {
      cachedList = [];
    }
  }
  return cachedList;
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function write(list: StoredCampaign[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    throw new Error(
      "Couldn't save this campaign in your browser (storage is full or blocked).",
    );
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function saveCampaign(
  input: CampaignInput,
  generatedContent: unknown,
): StoredCampaign {
  const campaign: StoredCampaign = {
    ...input,
    id: newId(),
    createdAt: new Date().toISOString(),
    generatedContent,
  };
  write([campaign, ...getSnapshot()]);
  return campaign;
}

export function deleteCampaign(id: string) {
  write(getSnapshot().filter((c) => c.id !== id));
}

export function useStoredCampaigns(): StoredCampaign[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => []);
}
