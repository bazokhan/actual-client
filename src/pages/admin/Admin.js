import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import styles from './Admin.module.scss';
import routes from './routes';

const Admin = () => {
  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminBody}>
        <Suspense fallback={<div>Loading..</div>}>
          <Switch>
            <Route path="/admin/accounts" exact component={routes.Accounts} />
            <Route path="/admin/payees" exact component={routes.Payees} />
            <Route
              path="/admin/categories"
              exact
              component={routes.Categories}
            />
            <Route path="/admin/groups" exact component={routes.Groups} />
            <Route path="/admin" exact component={routes.Accounts} />
            <Route
              path="/admin/:notfound"
              component={() => <div>404! Not found!</div>}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default Admin;
