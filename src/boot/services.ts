// The only composition root (src/contracts/services.md): picks one implementation per contract.
import { defineBoot } from '#q-app';
import { createFakeAssistant } from '../adapters/assistant/fake';
import { createHttpAssistant } from '../adapters/assistant/http';
import { servicesKey, type Services } from '../contracts/services';

// Set at build time in quasar.config.ts (env FINAINCE_CHAT_URL). Empty means the offline fake.
const chatUrl: string = import.meta.env.FINAINCE_CHAT_URL ?? '';

export default defineBoot(({ app }) => {
  const services: Services = {
    assistant: chatUrl ? createHttpAssistant(chatUrl) : createFakeAssistant(),
  };
  app.provide(servicesKey, services);
});
