import React, { lazy } from 'react';

const routes = [
  {
    path: '/auth',
    exact: false,
    component: lazy(() => import('pages/auth'))
  }
];
const authRoutes = [
  {
    path: '/admin',
    exact: false,
    component: lazy(() => import('pages/admin'))
  },
  {
    path: '/service',
    exact: true,
    component: lazy(() => import('pages/service'))
  },
  {
    path: '/legacy',
    exact: false,
    component: lazy(() => import('pages/legacy'))
  },
  {
    path: '/order',
    exact: true,
    component: lazy(() => import('pages/order'))
  },
  {
    path: '/reports',
    exact: false,
    component: lazy(() => import('pages/reports'))
  },
  {
    path: '/settings',
    exact: true,
    component: lazy(() => import('pages/settings'))
  },
  {
    path: '/:notfound',
    exact: true,
    component: () => <div>404! Not found</div>
  }
];

export { routes, authRoutes };
