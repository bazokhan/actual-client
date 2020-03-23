import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import styles from './Reports.module.scss';
import routes from './routes';

const Reports = () => {
  return (
    <div className={styles.reportsContainer}>
      <div className={styles.reportsBody}>
        <Suspense fallback={<div>Loading..</div>}>
          <Switch>
            <Route exact path="/reports/pivot" component={routes.Pivot} />
            <Route exact path="/reports/chart" component={routes.Chart} />
            <Route exact path="/reports/monthly" component={routes.Monthly} />
            <Route exact path="/reports" component={routes.Pivot} />
            <Route
              path="/reports/:notfound"
              component={() => <div>404! Not found.</div>}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default Reports;
