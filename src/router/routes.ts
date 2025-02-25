import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'accounts',
        component: () => import('src/views/AccountsViews.vue'),
      }
    ],
    redirect: '/accounts'
  },
];

export default routes;
