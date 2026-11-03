import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";

export const maxDuration = 60;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(SESSION_COOKIE)?.value)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY is not configured on Vercel" }, { status: 503 });
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const websiteUrl = String(body.websiteUrl ?? "").trim();
  if (!name) return NextResponse.json({ error: "Project name is required" }, { status: 400 });

  const textResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Write a concise, premium corporate portfolio description for SCORPION. Return JSON only with keys title and description. Arabic should be the primary language, with a polished English title in parentheses when useful. Project name: ${name}. Category: ${category}. Website: ${websiteUrl || "not provided"}. Do not invent specific facts, numbers, clients, or technologies.`
    })
  });
  if (!textResponse.ok) return NextResponse.json({ error: "AI text generation failed" }, { status: 502 });
  const textJson = await textResponse.json();
  const outputText = textJson.output_text || textJson.output?.flatMap((item: { content?: { text?: string }[] }) => item.content || []).map((part: { text?: string }) => part.text || "").join("") || "";
  let generated = { title: name, description: "حل رقمي مصمم بعناية ليقدم تجربة واضحة واحترافية." };
  try { generated = { ...generated, ...JSON.parse(outputText.replace(/```json|```/g, "").trim()) }; } catch { /* keep safe fallback */ }

  const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-image-1.5",
      prompt: `Premium editorial portfolio cover image for a corporate digital project named ${name}, category ${category || "digital solutions"}. Black vantablack background, matte gold accents, cinematic studio lighting, elegant architectural composition, no readable text, no logos, no watermark, formal luxury brand direction.`,
      size: "1024x1024",
      quality: "medium",
      n: 1
    })
  });
  let imageDataUrl = "";
  if (imageResponse.ok) {
    const imageJson = await imageResponse.json();
    const base64 = imageJson.data?.[0]?.b64_json;
    if (base64) imageDataUrl = `data:image/png;base64,${base64}`;
  }
  return NextResponse.json({ ...generated, imageDataUrl });
}
