import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  FaObjectGroup,
  FaList,
  FaUserFriends,
  FaMoneyBill
} from 'react-icons/fa';
import styles from './Admin.module.scss';
import Navbar from './components/Navbar';

const routes = {
  Accounts: lazy(() => import('./pages/Accounts')),
  Payees: lazy(() => import('./pages/Payees')),
  Categories: lazy(() => import('./pages/Categories')),
  Groups: lazy(() => import('./pages/Groups'))
};

const links = [
  {
    path: '/admin/accounts',
    icon: <FaMoneyBill />,
    label: 'Accounts'
  },
  {
    path: '/admin/payees',
    icon: <FaUserFriends />,
    label: 'Payees'
  },
  {
    path: '/admin/categories',
    icon: <FaList />,
    label: 'Categories'
  },
  {
    path: '/admin/groups',
    icon: <FaObjectGroup />,
    label: 'Groups'
  }
];

const Admin = () => {
  return (
    <div className={styles.adminContainer}>
      <Navbar links={links} />
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
