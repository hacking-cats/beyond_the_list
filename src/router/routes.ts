import type { RouteRecordRaw } from 'vue-router';
import { enabledFeatures } from '../features/registry';

// Routes come from the feature registry; disabled features have no route.
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      ...enabledFeatures().map((f) => ({ path: f.route.slice(1), name: f.key, component: f.component })),
    ],
  },
  { path: '/:catchAll(.*)*', redirect: '/dashboard' },
];

export default routes;
