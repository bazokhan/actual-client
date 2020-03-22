import React, { lazy } from 'react';

const routes = [
  { path: '/auth', exact: false, component: lazy(() => import('pages/auth')) }
];
const authRoutes = [
  {
    path: '/admin',
    exact: false,
    component: lazy(() => import('pages/admin'))
  },
  {
    path: '/pivot/:categoryid',
    exact: true,
    component: lazy(() => import('pages/category'))
  },
  {
    path: '/history',
    exact: true,
    component: lazy(() => import('pages/history'))
  },
  { path: '/', exact: true, component: lazy(() => import('pages/home')) },
  {
    path: '/newHome',
    exact: true,
    component: lazy(() => import('pages/homeNew'))
  },
  {
    path: '/migrate',
    exact: true,
    component: lazy(() => import('pages/migrate'))
  },
  { path: '/order', exact: true, component: lazy(() => import('pages/order')) },
  { path: '/pivot', exact: true, component: lazy(() => import('pages/pivot')) },
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
