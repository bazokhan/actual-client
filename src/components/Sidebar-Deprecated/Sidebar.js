/* eslint-disable no-unused-expressions */
import React, { useContext, useState, useRef } from 'react';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import { DataContext } from 'App/context';
import {
  FaHome,
  FaUserCog,
  FaChartBar,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaFileAlt,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authToken } = useContext(DataContext);
  const sidebarRef = useRef(null);
  return (
    <div
      className={cx(styles.sidebar, isOpen ? styles.open : '')}
      ref={sidebarRef}
    >
      <button
        type="button"
        className={cx(styles.link, 'btn')}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.icon}>
          {isOpen ? <FaAngleLeft /> : <FaAngleRight />}
        </div>
      </button>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName={styles.active}
        exact
        to="/service"
      >
        <div className={styles.icon}>
          <FaHome />
        </div>
        <span>Home</span>
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName={styles.active}
        exact
        to="/reports"
      >
        <div className={styles.icon}>
          <FaChartBar />
        </div>
        <span>Reports</span>
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName={styles.active}
        to="/order"
      >
        <div className={styles.icon}>
          <FaFileAlt />
        </div>
        <span>Orders</span>
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName={styles.active}
        to="/admin"
      >
        <div className={styles.icon}>
          <FaUserCog />
        </div>
        <span>Admin</span>
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName={styles.active}
        exact
        to="/migrate"
      >
        <div className={styles.icon}>
          <FaExclamationTriangle />
        </div>
        <span>Migrate</span>
      </NavLink>
      {authToken && (
        <NavLink
          className={cx(styles.link, 'btn')}
          activeClassName={styles.active}
          to="/auth/logout"
        >
          <div className={styles.icon}>
            <FaSignOutAlt />
          </div>
          <span>Log out</span>
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;
