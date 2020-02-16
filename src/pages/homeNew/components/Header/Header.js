import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { v2sum, n } from 'helpers/mathHelpers';
import { FaPlus, FaBuffer, FaChartLine, FaLock } from 'react-icons/fa';
import styles from './Header.module.scss';
import useAccounts from '../../hooks/useAccounts';

const Header = ({ filters, transactions, setShow }) => {
  const sheetNet = useMemo(() => v2sum(transactions), [transactions]);
  const { balance } = useAccounts();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.title}>
        <h1>
          {filters.account ? filters.account.name : 'All accounts'} overview
        </h1>
        <p>{filters.type ? ` - ${filters.type}s only` : ''}</p>
      </div>

      <div className={styles.headerCard}>
        <span>
          <FaBuffer />
        </span>
        <p>{transactions.length}</p>
        <p>transactions</p>
      </div>

      <div className={styles.headerCard}>
        <span>
          <FaChartLine />
        </span>
        <p>Sheet Net</p>
        <p
          style={
            sheetNet < 0
              ? { color: 'var(--error-color)' }
              : { color: 'var(--success-color)' }
          }
        >
          {n(sheetNet)} EGP
        </p>
      </div>

      <div className={styles.headerLastCard}>
        <span>
          <FaLock />
        </span>
        <p>Safe</p>
        <p>{n(balance)} EGP</p>
      </div>

      <div className={styles.headerRow}>
        <button
          type="button"
          onClick={() => setShow(true)}
          className={styles.addButton}
        >
          <FaPlus style={{ marginRight: '5px' }} />
          Add new transaction
        </button>
        {/* <div className={styles.balance}>
          <h2>BALANCE</h2>
          <p>{n(balance)} EGP</p>
        </div>
        <div className={styles.balance}>
          <h2>Sheet Net</h2>
          <p>{n(sheetNet)} EGP</p>
        </div> */}
      </div>
    </div>
  );
};

Header.propTypes = {
  filters: PropTypes.object.isRequired,
  transactions: PropTypes.array.isRequired,
  setShow: PropTypes.func.isRequired
};

export default Header;
