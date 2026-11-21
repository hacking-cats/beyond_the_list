// TypeScript side of the Assistant contract (assistant.md).
// Partial on purpose: only `ask` exists so far, because the finAInce chat is the first caller.
// monthlyReport, dailyInvestIdea and the approval queue join when the spec is frozen.

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string; // ISO 8601
};

// Which page is asking. Facts from engines join here later (summaries only, never raw data).
export type AskContext = {
  page: string;
  locale: string;
};

export type AskError = 'offline' | 'unavailable';

export type AskResult = { reply: ChatMessage } | { error: AskError };

export interface Assistant {
  // Never throws: failures come back as { error }.
  ask(text: string, context: AskContext): Promise<AskResult>;
}
