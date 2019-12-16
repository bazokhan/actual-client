import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from '../App.module.scss';
import { sum, n } from '../../helpers/mathHelpers';

const Header = ({ transactions, accountsAmounts, title }) => {
  const totalBalance = useMemo(
    () => accountsAmounts.reduce((total, next) => total + next, 0),
    [accountsAmounts]
  );
  const sheetNet = useMemo(() => sum(transactions), [transactions]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.transactionNum}>
        <p>{transactions.length}</p>
        <p>transactions</p>
      </div>
      <div className={styles.title}>
        <h1>{title}</h1>
      </div>
      <div className={styles.totalsRow}>
        <div className={styles.balance}>
          <h2>BALANCE</h2>
          <p>{n(totalBalance)} EGP</p>
        </div>
        <div className={styles.balance}>
          <h2>Sheet Net</h2>
          <p>{n(sheetNet)} EGP</p>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  transactions: PropTypes.array.isRequired,
  accountsAmounts: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default Header;
