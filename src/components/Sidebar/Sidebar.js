import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import { DataContext } from 'App/context';
import {
  FaHome,
  FaUserCog,
  FaChartBar,
  FaExclamationTriangle,
  FaSignOutAlt,
  // FaTimes,
  FaFileAlt,
  FaBars
} from 'react-icons/fa';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authToken } = useContext(DataContext);
  return (
    <div className={cx(styles.sidebar, isOpen ? styles.open : '')}>
      <button
        type="button"
        className={cx(styles.link, 'btn')}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </button>
      {/* <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/"
      >
        <FaHome />
        {isOpen && <span>_Home</span>}
      </NavLink> */}
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/newHome"
      >
        <FaHome />
        {isOpen && <span>Home</span>}
      </NavLink>
      {/* <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/pivot"
      >
        <FaChartBar />
        {isOpen && <span>_Reports</span>}
      </NavLink> */}
      {/* <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/newPivot"
      >
        <FaChartBar />
        {isOpen && <span>Reports</span>}
      </NavLink> */}
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/reports"
      >
        <FaChartBar />
        {isOpen && <span>Reports</span>}
      </NavLink>
      {/* <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        to="/history"
      >
        <FaTimes />
        {isOpen && <span>_Deleted</span>}
      </NavLink> */}
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        to="/order"
      >
        <FaFileAlt />
        {isOpen && <span>Orders</span>}
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        to="/admin"
      >
        <FaUserCog />
        {isOpen && <span>Admin</span>}
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn')}
        activeClassName="btn-primary"
        exact
        to="/migrate"
      >
        <FaExclamationTriangle />
        {isOpen && <span>Migrate</span>}
      </NavLink>
      {authToken && (
        <NavLink
          className={cx(styles.link, 'btn')}
          activeClassName="btn-primary"
          to="/auth/logout"
        >
          <FaSignOutAlt />
          {isOpen && <span>Log out</span>}
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;
