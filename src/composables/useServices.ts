import { inject } from 'vue';
import { servicesKey, type Services } from '../contracts/services';

// The only way pages, components and stores reach implementations.
export function useServices(): Services {
  const services = inject(servicesKey);
  if (!services) throw new Error('Services not provided: is the "services" boot file registered?');
  return services;
}
