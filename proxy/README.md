# proxy

One serverless function that holds the LLM API key and forwards requests from the `claude` LlmProvider adapter. The key never ships in the app.

Planned rules: accept only the `LlmProvider` request shape, reject payloads with raw transactions or account ids, rate-limit, no logging of request bodies. Host: TBD (Cloudflare Workers or Vercel). Placeholder.
