import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import styles from '../App.module.scss';

const n = num => numeral(num).format('0,0.00');
const sum = transactions =>
  transactions
    .map(t => t.actualAmount)
    .reduce((acc, amount) => acc + amount, 0);

const Header = ({ transactions, title, categories, payees, filter }) => {
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalBalance(sum(transactions));
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
      <div>
        <select
          onChange={e => filter(t => t.categoryObj.id === e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select onChange={e => filter(t => t.payee.id === e.target.value)}>
          {payees.map(payee => (
            <option key={payee.id} value={payee.id}>
              {payee.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

Header.propTypes = {
  transactions: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  payees: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired
};

export default Header;
