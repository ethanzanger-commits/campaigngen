// The "credential" is either an access code the site owner gave out, or the
// visitor's own OpenAI API key (starts with "sk-").
// Access codes are remembered on this device. API keys are kept only for the
// current browser tab (sessionStorage) and are never saved to the server.
const CODE_KEY = "campaigngen:access-code";
const OWN_KEY = "campaigngen:openai-key";

export function loadCredential(): string {
  try {
    return sessionStorage.getItem(OWN_KEY) || localStorage.getItem(CODE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveCredential(credential: string) {
  const value = credential.trim();
  try {
    if (value.startsWith("sk-")) {
      sessionStorage.setItem(OWN_KEY, value);
      localStorage.removeItem(CODE_KEY);
    } else {
      localStorage.setItem(CODE_KEY, value);
      sessionStorage.removeItem(OWN_KEY);
    }
  } catch {
    // storage blocked; the user just re-enters it next time
  }
}
