// The only file that talks to the AI provider. Swap providers by changing this file.
const URL = "https://api.groq.com/openai/v1/chat/completions";

export class LlmError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function chatJson(system: string, user: string, maxTokens = 4500): Promise<unknown> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new LlmError("The AI key is missing. Add GROQ_API_KEY to .env.local and restart.", 500);
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
      temperature: 0.3,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (res.status === 429) {
    const detail = (await res.text()).slice(0, 300);
    console.error("Groq rate limit", detail);
    throw new LlmError("The AI hit its free-plan limit: " + detail, 429);
  }
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 400);
    console.error("Groq error", res.status, detail);
    throw new LlmError("The AI request failed (" + res.status + "): " + detail, 502);
  }
  const data = await res.json();
  let text: string = data?.choices?.[0]?.message?.content ?? "";
  text = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a < 0 || b < 0) throw new LlmError("The AI returned something unreadable.", 502);
  return JSON.parse(text.slice(a, b + 1));
}
