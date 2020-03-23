import { lazy } from 'react';

const routes = {
  Data: lazy(() => import('./pages/LegacyData')),
  Wizard: lazy(() => import('./pages/MigrationWizard')),
  Deleted: lazy(() => import('./pages/LegacyDeleted')),
  Pivot: lazy(() => import('./pages/LegacyPivot'))
};

export default routes;
