import React, { useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import ExcelExport from 'components/ExcelExport';
import ReactToPrint from 'react-to-print';
import Print from 'components/Print';
import { FaPrint, FaExpand } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { toggleFullScreen } from 'helpers';
import styles from './Navbar.module.scss';

const PrintButton = () => (
  <button type="button" className="btn btn-action btn-link btn-sm s-square">
    <FaPrint />
  </button>
);

const Navbar = ({ activeTransactions, activeAccount, activeType }) => {
  const printRef = useRef();
  return (
    <div className={styles.actionButtons}>
      <NavLink
        className={cx(styles.link, 'btn btn-sm')}
        activeClassName="btn-primary"
        exact
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn btn-sm')}
        activeClassName="btn-primary"
        exact
        to="/pivot"
      >
        Pivot
      </NavLink>
      <NavLink
        className={cx(styles.link, 'btn btn-sm')}
        activeClassName="btn-primary"
        to="/history"
      >
        Deleted
      </NavLink>
      <ExcelExport
        transactions={activeTransactions}
        activeAccount={activeAccount}
        activeType={activeType}
      />
      <ReactToPrint
        trigger={PrintButton}
        content={() => printRef.current}
        copyStyles
      />
      <button
        className="btn btn-action btn-link btn-sm s-square"
        type="button"
        onClick={toggleFullScreen}
      >
        <FaExpand />
      </button>
      <div className={styles.print} ref={printRef}>
        <Print
          transactions={activeTransactions}
          activeAccount={activeAccount}
          activeType={activeType}
        />
      </div>
    </div>
  );
};

Navbar.propTypes = {
  activeTransactions: PropTypes.array.isRequired,
  activeAccount: PropTypes.string.isRequired,
  activeType: PropTypes.string.isRequired
};

export default Navbar;