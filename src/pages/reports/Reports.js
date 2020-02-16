import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { FaTable, FaChartPie, FaChartLine } from 'react-icons/fa';
import styles from './Reports.module.scss';
import Navbar from './components/Navbar';

const routes = {
  Pivot: lazy(() => import('./pages/pivot')),
  Chart: lazy(() => import('./pages/chart')),
  Monthly: lazy(() => import('./pages/monthly'))
};

const links = [
  {
    path: '/reports/pivot',
    icon: <FaTable />,
    label: 'Pivot table'
  },
  {
    path: '/reports/chart',
    icon: <FaChartPie />,
    label: 'Chart'
  },
  {
    path: '/reports/monthly',
    icon: <FaChartLine />,
    label: 'Chart'
  }
];

const Reports = () => {
  return (
    <div className={styles.reportsContainer}>
      <Navbar links={links} />
      <div className={styles.reportsBody}>
        <Suspense fallback={<div>Loading..</div>}>
          <Switch>
            <Route path="/reports/pivot" component={routes.Pivot} />
            <Route path="/reports/chart" component={routes.Chart} />
            <Route path="/reports/monthly" component={routes.Monthly} />
            <Route path="/reports" component={routes.Pivot} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default Reports;
