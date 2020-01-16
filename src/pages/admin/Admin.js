import React, { lazy, Suspense } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import styles from './Admin.module.scss';

const routes = {
  Accounts: lazy(() => import('./components/Accounts')),
  Payees: lazy(() => import('./components/Payees')),
  Categories: lazy(() => import('./components/Categories')),
  Groups: lazy(() => import('./components/Groups'))
};

const Admin = () => {
  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminNavbar}>
        <NavLink
          className={styles.adminLink}
          activeClassName={styles.active}
          to="/admin/accounts"
        >
          Accounts
        </NavLink>
        <NavLink
          className={styles.adminLink}
          activeClassName={styles.active}
          to="/admin/payees"
        >
          Payees
        </NavLink>
        <NavLink
          className={styles.adminLink}
          activeClassName={styles.active}
          to="/admin/categories"
        >
          Categories
        </NavLink>
        <NavLink
          className={styles.adminLink}
          activeClassName={styles.active}
          to="/admin/groups"
        >
          Groups
        </NavLink>
      </div>
      <div className={styles.adminBody}>
        <Suspense fallback={<div>Loading..</div>}>
          <Switch>
            <Route path="/admin/accounts" component={routes.Accounts} />
            <Route path="/admin/payees" component={routes.Payees} />
            <Route path="/admin/categories" component={routes.Categories} />
            <Route path="/admin/groups" component={routes.Groups} />
            <Route path="/admin" component={routes.Accounts} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default Admin;
