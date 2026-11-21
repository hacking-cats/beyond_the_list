import type { Assistant, AskContext, AskResult } from '../../contracts/assistant';

// Offline assistant: deterministic canned reply, no network.
export function createFakeAssistant(): Assistant {
  let n = 0;
  return {
    ask(text: string, context: AskContext): Promise<AskResult> {
      n += 1;
      const reply =
        context.locale === 'de'
          ? `Offline-Modus: Ich habe deine Frage erhalten ("${text}"). Bald antworte ich mit deinen eigenen Zahlen.`
          : `Offline mode: I got your question ("${text}"). Soon I will answer with your own numbers.`;
      return Promise.resolve({
        reply: { id: `fake-${n}`, role: 'assistant', text: reply, createdAt: new Date().toISOString() },
      });
    },
  };
}
