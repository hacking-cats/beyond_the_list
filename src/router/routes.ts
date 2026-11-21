import type { RouteRecordRaw } from 'vue-router';
import { enabledFeatures } from '../features/registry';

// Routes come from the feature registry; disabled features have no route.
// The start page is the first tab (Overview).
const enabled = enabledFeatures();
const start = enabled[0]?.route ?? '/';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: start },
      ...enabled.map((f) => ({ path: f.route.slice(1), name: f.key, component: f.component })),
    ],
  },
  { path: '/:catchAll(.*)*', redirect: start },
];

export default routes;
