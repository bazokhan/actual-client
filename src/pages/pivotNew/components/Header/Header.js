import React from 'react';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import useAccounts from '../../hooks/useAccounts';
import styles from './Header.module.scss';

const Header = ({ account, totalTransactions, setActiveAccount }) => {
  const { accounts, balance } = useAccounts();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.transactionNum}>
        <p>{totalTransactions}</p>
        <p>transactions</p>
      </div>
      <div className={styles.title}>
        <h1>{account ? account.name : 'All accounts'}</h1>
      </div>
      <div className={styles.totalsRow}>
        <div className="form-group">
          <label className="form-label label-sm" htmlFor="accounts">
            Select Account
            <select
              className="form-select select-sm"
              onChange={e => {
                const accountId = e.target.value;
                return accountId
                  ? setActiveAccount(accounts.find(a => a.id === accountId))
                  : setActiveAccount(null);
              }}
              id="accounts"
              style={{ color: '#243b53' }}
            >
              <option value="">All Accounts</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.balance}>
          <h2>BALANCE</h2>
          <p>{account ? n(account.balance) : n(balance)} EGP</p>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  account: PropTypes.object,
  totalTransactions: PropTypes.number.isRequired,
  setActiveAccount: PropTypes.func.isRequired
};

Header.defaultProps = {
  account: null
};

export default Header;
