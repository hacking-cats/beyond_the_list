import { describe, expect, it, vi } from 'vitest';
import { createFakeAssistant } from '../../src/adapters/assistant/fake';
import { createHttpAssistant, stripCitations } from '../../src/adapters/assistant/http';
import type { Assistant } from '../../src/contracts/assistant';

const ctx = { page: 'buddy', locale: 'en-US' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

// Every Assistant implementation must pass this.
function contractSuite(name: string, make: () => Assistant) {
  describe(`Assistant contract: ${name}`, () => {
    it('answers a question with an assistant message', async () => {
      const result = await make().ask('What was my last salary', ctx);
      expect('reply' in result).toBe(true);
      if ('reply' in result) {
        expect(result.reply.role).toBe('assistant');
        expect(result.reply.text.length).toBeGreaterThan(0);
      }
    });
  });
}

contractSuite('fake', createFakeAssistant);
contractSuite('http', () =>
  createHttpAssistant('https://example.test/chat', () => Promise.resolve(jsonResponse({ answer: 'CHF 7464.00【4】.' }))),
);

describe('http assistant', () => {
  it('posts { question } and returns the answer without citation markers', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          answer:
            'Your last salary payment was on 2025-08-23, and the amount was 7464.00 CHF (salary from Employer AG into Privatkonto)【4】.',
        }),
      ),
    );
    const result = await createHttpAssistant('https://example.test/chat', fetchMock).ask('What was my last salary', ctx);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://example.test/chat');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ question: 'What was my last salary' });
    expect(result).toMatchObject({
      reply: {
        text: 'Your last salary payment was on 2025-08-23, and the amount was 7464.00 CHF (salary from Employer AG into Privatkonto).',
      },
    });
  });

  it('returns an error instead of throwing when the server fails', async () => {
    const down = createHttpAssistant('https://example.test/chat', () => Promise.reject(new TypeError('Failed to fetch')));
    expect(await down.ask('hi', ctx)).toHaveProperty('error');

    const bad = createHttpAssistant('https://example.test/chat', () => Promise.resolve(jsonResponse({}, 500)));
    expect(await bad.ask('hi', ctx)).toEqual({ error: 'unavailable' });

    const empty = createHttpAssistant('https://example.test/chat', () => Promise.resolve(jsonResponse({ nope: 1 })));
    expect(await empty.ask('hi', ctx)).toEqual({ error: 'unavailable' });
  });

  it('strips citation markers', () => {
    expect(stripCitations('Done【4】.')).toBe('Done.');
    expect(stripCitations('X【1】【12】 Y')).toBe('X Y');
  });
});
