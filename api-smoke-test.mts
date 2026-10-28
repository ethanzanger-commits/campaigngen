// Run with: npm run test:api  (no network, database or real OpenAI key needed)
import http from "node:http";

function mkRes() {
  const r: any = { statusCode: 0, body: undefined, headers: {} };
  r.status = (c: number) => { r.statusCode = c; return r; };
  r.json = (b: unknown) => { r.body = b; return r; };
  r.setHeader = (k: string, v: string) => { r.headers[k] = v; return r; };
  return r;
}
let failed = 0;
function expect(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(ok ? "PASS" : "FAIL", name, ok ? "" : `got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);
}

// ---- Mock OpenAI ----
const fake = { slogans: ["a", "b", "c"], sellingPoints: ["x"], socialMediaPosts: [{ platform: "Twitter", content: "hi" }], emailDraft: { subject: "s", body: "b" } };
let mode: "ok" | "401" | "429" | "badjson" = "ok";
let seen: { auth?: string; body?: any; calls: number } = { calls: 0 };
const srv = http.createServer((req, res) => {
  let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
    seen = { auth: req.headers.authorization, body: JSON.parse(body), calls: seen.calls + 1 };
    res.setHeader("content-type", "application/json");
    if (mode === "401") { res.statusCode = 401; return res.end(JSON.stringify({ error: { message: "Incorrect API key", code: "invalid_api_key" } })); }
    if (mode === "429") { res.statusCode = 429; res.setHeader("retry-after-ms", "1"); return res.end(JSON.stringify({ error: { message: "quota", code: "insufficient_quota" } })); }
    const content = mode === "badjson" ? "not json {" : JSON.stringify(fake);
    res.end(JSON.stringify({ id: "1", object: "chat.completion", created: 1, model: "m", choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }] }));
  });
}).listen(0);
await new Promise((r) => srv.once("listening", r));
process.env.OPENAI_BASE_URL = `http://127.0.0.1:${(srv.address() as any).port}/v1`;

const handler = (await import("../api/generate.ts")).default;
const campaign = { productName: "EcoBottle", description: "A bottle", audience: "Millennials", tone: "Friendly", budget: "$5,000", kpis: ["CTR"], competitors: ["Brand X"] };
const call = async (method: string, body: any) => { const r = mkRes(); await handler({ method, body, headers: {} } as any, r); return r; };

// ---- Request validation ----
let r = await call("GET", undefined);
expect("GET -> 405", r.statusCode, 405);
r = await call("POST", {});
expect("empty body -> 400", r.statusCode, 400);
r = await call("POST", { campaign });
expect("missing credential -> 400", r.statusCode, 400);
r = await call("POST", { campaign: { ...campaign, description: "x".repeat(2001) }, credential: "sk-visitor" });
expect("oversized description -> 400 (caps cost per request)", r.statusCode, 400);
r = await call("POST", { campaign: { ...campaign, productName: "" }, credential: "sk-visitor" });
expect("empty product name -> 400", r.statusCode, 400);
expect("no OpenAI calls were made for invalid requests", seen.calls, 0);

// ---- Access code mode ----
delete process.env.ACCESS_CODE; delete process.env.OPENAI_API_KEY;
r = await call("POST", { campaign, credential: "some-code" });
expect("access code when sharing is off -> 403", r.statusCode, 403);
expect("... and no OpenAI call", seen.calls, 0);

process.env.ACCESS_CODE = "correct-horse-battery-staple";
process.env.OPENAI_API_KEY = "sk-owner-secret";
r = await call("POST", { campaign, credential: "wrong-code" });
expect("wrong access code -> 401", r.statusCode, 401);
expect("... and no OpenAI call (owner key never used)", seen.calls, 0);

r = await call("POST", { campaign, credential: "correct-horse-battery-staple" });
expect("right access code -> 200", r.statusCode, 200);
expect("... uses the OWNER key", seen.auth, "Bearer sk-owner-secret");
expect("... returns generated content", r.body?.generatedContent?.slogans, ["a", "b", "c"]);
expect("... response never echoes the key or code", JSON.stringify(r.body).includes("sk-owner") || JSON.stringify(r.body).includes("correct-horse"), false);
expect("... caps output tokens", seen.body?.max_completion_tokens, 8000);
expect("... default model", seen.body?.model, "gpt-4o-mini");
expect("... prompt includes the inputs", ["EcoBottle", "Millennials", "Friendly", "$5,000", "CTR", "Brand X"].every((t) => seen.body.messages[0].content.includes(t)), true);

// ---- Bring-your-own-key mode ----
r = await call("POST", { campaign, credential: "sk-visitor-123" });
expect("own key -> 200", r.statusCode, 200);
expect("... uses the VISITOR's key, not yours", seen.auth, "Bearer sk-visitor-123");

delete process.env.ACCESS_CODE; delete process.env.OPENAI_API_KEY;
r = await call("POST", { campaign, credential: "sk-visitor-456" });
expect("own key works with no server-side key configured", r.statusCode, 200);
expect("... still the visitor's key", seen.auth, "Bearer sk-visitor-456");

// ---- OpenAI errors ----
mode = "401";
r = await call("POST", { campaign, credential: "sk-bad" });
expect("OpenAI rejects key -> 401 with clear message", [r.statusCode, /rejected that API key/.test(r.body?.message)], [401, true]);
mode = "429";
r = await call("POST", { campaign, credential: "sk-broke" });
expect("OpenAI out of credit -> 429 with clear message", [r.statusCode, /out of credit/.test(r.body?.message)], [429, true]);
mode = "badjson";
r = await call("POST", { campaign, credential: "sk-visitor" });
expect("model returns invalid JSON -> 502", r.statusCode, 502);

srv.close();
console.log(failed ? `\n${failed} FAILED` : "\nALL PASSED");
process.exit(failed ? 1 : 0);
