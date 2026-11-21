/**
 * Feature registry: each page declares itself once; routes and the drawer are generated
 * from this list. Spec: src/contracts/feature-registry.md (draft). APPEND-ONLY: one entry
 * per feature, never reorder. Disabled features get no route and no menu entry.
 */
import type { RouteComponent } from 'vue-router';

export interface FeatureEntry {
  key: string;
  route: string;
  titleKey: string;
  icon: string; // Material icon name
  order: number;
  enabled: boolean;
  component: () => Promise<RouteComponent>;
}

export const features: FeatureEntry[] = [
  { key: 'dashboard', route: '/dashboard', titleKey: 'features.dashboard.title', icon: 'dashboard', order: 10, enabled: true, component: () => import('./dashboard/DashboardPage.vue') },
  { key: 'movements', route: '/movements', titleKey: 'features.movements.title', icon: 'receipt_long', order: 20, enabled: true, component: () => import('./movements/MovementsPage.vue') },
  { key: 'chat', route: '/chat', titleKey: 'features.chat.title', icon: 'chat', order: 30, enabled: false, component: () => import('./chat/ChatPage.vue') },
  { key: 'savings', route: '/savings', titleKey: 'features.savings.title', icon: 'savings', order: 40, enabled: true, component: () => import('./savings/SavingsPage.vue') },
  { key: 'invest', route: '/invest', titleKey: 'features.invest.title', icon: 'trending_up', order: 50, enabled: false, component: () => import('./invest/InvestPage.vue') },
  { key: 'data-generator', route: '/data-generator', titleKey: 'features.dataGenerator.title', icon: 'science', order: 60, enabled: false, component: () => import('./data-generator/DataGeneratorPage.vue') },
];

export const enabledFeatures = (): FeatureEntry[] =>
  features.filter((f) => f.enabled).sort((a, b) => a.order - b.order);
