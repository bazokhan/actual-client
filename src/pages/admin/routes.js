import { lazy } from 'react';

const routes = {
  Accounts: lazy(() => import('./pages/Accounts')),
  Payees: lazy(() => import('./pages/Payees')),
  Categories: lazy(() => import('./pages/Categories')),
  Groups: lazy(() => import('./pages/Groups'))
};

export default routes;
