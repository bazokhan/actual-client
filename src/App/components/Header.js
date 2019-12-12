import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import styles from '../App.module.scss';

const n = num => numeral(num).format('0,0.00');

const Header = ({ transactions, title }) => {
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalBalance(
      transactions
        .map(t => t.actualAmount)
        .reduce((sum, amount) => sum + amount, 0)
    );
  }, [transactions]);
  return (
    <div className={styles.headerContainer}>
      <div className={styles.transactionNum}>
        <p>{transactions.length}</p>
        <p>transactions</p>
      </div>
      <div className={styles.title}>
        <h1>{title}</h1>
      </div>
      <div className={styles.balance}>
        <h2>BALANCE</h2>
        <p>{n(totalBalance)} EGP</p>
      </div>
    </div>
  );
};

Header.propTypes = {
  transactions: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default Header;
