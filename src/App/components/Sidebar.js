import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../App.module.scss';

const Sidebar = ({ transactions, accounts, amountsByAccount }) => {
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalBalance(
      transactions.map(t => t.amount).reduce((sum, amount) => sum + amount, 0)
    );
  }, [transactions]);
  return (
    <div className={styles.sidebar}>
      <button
        className={styles.accountsButton}
        type="button"
        onClick={() => console.log('all')}
      >
        <span>All accounts</span>
        <span>{totalBalance} EGP</span>
      </button>
      {accounts.map(account => (
        <button
          key={account.id}
          className={styles.accountButton}
          type="button"
          onClick={() => console.log(account.name)}
        >
          <span>{account.name}</span>
          <span>
            {amountsByAccount[account.id].reduce(
              (sum, amount) => sum + amount,
              0
            )}{' '}
            EGP
          </span>
        </button>
      ))}
    </div>
  );
};

Sidebar.propTypes = {
  transactions: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  amountsByAccount: PropTypes.object.isRequired
};

export default Sidebar;
