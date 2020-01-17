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
  Accounts: lazy(() => import('./components/Accounts')),
  Payees: lazy(() => import('./components/Payees')),
  Categories: lazy(() => import('./components/Categories')),
  Groups: lazy(() => import('./components/Groups'))
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
