import { lazy } from 'react';

const routes = {
  Pivot: lazy(() => import('./pages/pivot')),
  Chart: lazy(() => import('./pages/chart')),
  Monthly: lazy(() => import('./pages/monthly'))
};

export default routes;
