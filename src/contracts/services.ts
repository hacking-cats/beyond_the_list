// The container useServices() returns (services.md). Grows one line per contract as each gets code.
import type { InjectionKey } from 'vue';
import type { Assistant } from './assistant';

export type Services = {
  assistant: Assistant;
};

export const servicesKey: InjectionKey<Services> = Symbol('services');
