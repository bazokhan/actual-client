import React, { useContext } from 'react';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import { DataContext } from 'App/context';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const { authToken } = useContext(DataContext);
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
        to="/newHome"
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
        exact
        to="/newPivot"
      >
        New Pivot
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        to="/history"
      >
        Deleted
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        to="/order"
      >
        Job orders
      </NavLink>
      {authToken && (
        <NavLink
          className={cx(styles.link, 'btn')}
          activeClassName="btn-primary"
          to="/auth/logout"
        >
          Logout
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;
