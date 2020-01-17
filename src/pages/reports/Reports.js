import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { FaTable } from 'react-icons/fa';
import styles from './Reports.module.scss';
import Navbar from './components/Navbar';

const routes = {
  Pivot: lazy(() => import('./pages/pivot'))
};

const links = [
  {
    path: '/reports/pivot',
    icon: <FaTable />,
    label: 'Pivot table'
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
            <Route path="/reports" component={routes.Pivot} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default Reports;
