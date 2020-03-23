import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes';
import styles from './Legacy.module.scss';

const Legacy = () => {
  return (
    <div className={styles.legacyContainer}>
      <div className={styles.legacyBody}>
        <Suspense fallback={<div>Loading..</div>}>
          <Switch>
            <Route path="/legacy/data" exact component={routes.Data} />
            <Route path="/legacy/wizard" exact component={routes.Wizard} />
            <Route path="/legacy/deleted" exact component={routes.Deleted} />
            <Route path="/legacy/pivot" exact component={routes.Pivot} />
            <Route path="/legacy" exact component={routes.Data} />
            <Route
              path="/legacy/:notfound"
              component={() => <div>404! Not found!</div>}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default Legacy;
