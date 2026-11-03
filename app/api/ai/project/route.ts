import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(SESSION_COOKIE)?.value)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not configured on Vercel" }, { status: 503 });
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const websiteUrl = String(body.websiteUrl ?? "").trim();
  if (!name) return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  const prompt = `أنت كاتب محتوى لشركة SCORPION. اكتب وصفًا رسميًا فاخرًا لمشروع في البورتفوليو. أرجع JSON فقط بالمفتاحين title و description. العنوان عربي واضح ويمكن إضافة English title بين قوسين. الوصف من جملة إلى جملتين، جذاب واحترافي، ولا تخترع أرقامًا أو عملاء أو تقنيات غير مذكورة. اسم المشروع: ${name}. القسم: ${category || "غير محدد"}. الرابط: ${websiteUrl || "غير متوفر"}.`;
  const payload = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 300 } };
  const models = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
  let json: { candidates?: { content?: { parts?: { text?: string }[] } }[] } | null = null;
  let lastError = "تعذر الاتصال بخدمة Gemini";
  for (const model of models) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify(payload) });
    if (response.ok) { json = await response.json(); break; }
    const providerBody = await response.text();
    try { lastError = JSON.parse(providerBody)?.error?.message || lastError; } catch { /* keep safe fallback */ }
    console.error("Gemini API error", model, response.status, providerBody.slice(0, 1000));
    if (![429, 500, 502, 503, 504].includes(response.status)) break;
  }
  if (!json) return NextResponse.json({ error: `Gemini generation failed: ${lastError}` }, { status: 502 });
  const output = json.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "";
  let result = { title: name, description: "حل رقمي مصمم بعناية ليقدم تجربة واضحة واحترافية." };
  try { result = { ...result, ...JSON.parse(output.replace(/```json|```/g, "").trim()) }; } catch { /* safe fallback */ }
  return NextResponse.json({ ...result, imageDataUrl: "" });
}
