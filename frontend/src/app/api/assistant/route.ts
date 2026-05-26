import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { loadExtractedPaperArtifacts } from "@/lib/extracted-papers";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, paperId, provider = "openai", mode = "ask" } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // Load artifacts server-side and find the requested paper
    const artifacts = await loadExtractedPaperArtifacts();
    const paper = artifacts.find((a) => a.id === paperId) || artifacts[0];

    const context =
      paper?.documentData?.full_text ||
      (paper?.documentData?.sections || []).map((s) => s.content).join("\n\n") ||
      paper?.sections?.find((s) => s.type === "extract")?.content ||
      "";

    const askSystemPrompt = `You are a research assistant. Answer concisely and only using the provided document context. If the answer is not present, reply: \"I couldn't find an answer in the provided document.\" Do not invent facts.`;

    const summarySystemPrompt = `You are a research summarizer. Produce a short, structured summary of the provided document context: include (1) 2-3 sentence overview, (2) 3-6 key findings or claims as bullet points, (3) suggested practical applications or next steps. Be concise and factual.`;

    const systemPrompt = mode === "summary" ? summarySystemPrompt : askSystemPrompt;

    const userPrompt = mode === "summary"
      ? `Please generate a concise summary for the following document context:\n\n${context.substring(0, 20000)}`
      : `Question: ${question}\n\nDocument Context:\n${context.substring(0, 20000)}`; // limit context size

    // Route to provider implementations
    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "Server is not configured with an OpenAI API key" }, { status: 500 });
      }

      const payload = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.0,
        max_tokens: 800,
      };

      const resp = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return NextResponse.json({ error: "Upstream error", details: text }, { status: 502 });
      }

      const data = await resp.json();
      const assistant = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
      return NextResponse.json({ answer: assistant });
    }

    // Generic GROQ/Claude passthrough via configured endpoint URLs
    if (provider === "groq" || provider === "claude") {
      const urlEnv = provider === "groq" ? process.env.GROQ_API_URL : process.env.CLAUDE_API_URL;
      const keyEnv = provider === "groq" ? process.env.GROQ_API_KEY : process.env.CLAUDE_API_KEY;

      if (!urlEnv || !keyEnv) {
        return NextResponse.json({ error: `${provider} not configured. Set ${provider.toUpperCase()}_API_URL and ${provider.toUpperCase()}_API_KEY` }, { status: 500 });
      }

      // Basic passthrough: send { prompt } or { input } depending on endpoint expectations.
      // We use a simple JSON body with `prompt` to maximize compatibility; users can point GROQ_API_URL/CLAUDE_API_URL to an adapter if needed.
      const resp = await fetch(urlEnv, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keyEnv}`,
        },
        body: JSON.stringify({ prompt: `${systemPrompt}\n\n${userPrompt}` }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return NextResponse.json({ error: "Upstream error", details: text }, { status: 502 });
      }

      const data = await resp.json().catch(async () => ({ text: await resp.text() }));
      // Try to extract a text field, otherwise return raw
      const assistant = data?.result || data?.text || data?.output || JSON.stringify(data);
      return NextResponse.json({ answer: String(assistant) });
    }

    return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
