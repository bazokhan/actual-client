import React from 'react';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/new"
      >
        New Home
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/migrate"
      >
        Migrate
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/pivot"
      >
        Pivot
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        to="/history"
      >
        Deleted
      </NavLink>
    </div>
  );
};

export default Sidebar;
