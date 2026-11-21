import type { Assistant, AskContext, AskResult } from '../../contracts/assistant';

// Assistant backed by the team's chat backend: POST { question } to `url`, reply with { answer }.
// Only the question text is sent; no transactions, account ids or personal details.

type FetchLike = typeof fetch;

// The backend cites its sources like 【4】; the user cannot open them, so drop them.
export function stripCitations(text: string): string {
  return text
    .replace(/【[^】]*】/g, '')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
}

export function createHttpAssistant(url: string, fetchImpl: FetchLike = fetch, timeoutMs = 30000): Assistant {
  let n = 0;
  return {
    async ask(text: string, context: AskContext): Promise<AskResult> {
      void context; // the backend takes only the question for now
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetchImpl(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Skips ngrok's browser warning page on free tunnels; harmless elsewhere.
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({ question: text }),
          signal: controller.signal,
        });
        if (!res.ok) return { error: 'unavailable' };
        const body = (await res.json()) as { answer?: unknown };
        if (typeof body.answer !== 'string' || !body.answer.trim()) return { error: 'unavailable' };
        n += 1;
        return {
          reply: {
            id: `http-${n}`,
            role: 'assistant',
            text: stripCitations(body.answer),
            createdAt: new Date().toISOString(),
          },
        };
      } catch {
        const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
        return { error: offline ? 'offline' : 'unavailable' };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
