import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { FaCaretRight, FaCaretDown } from 'react-icons/fa';
import styles from '../App.module.scss';
import Filters from './Filters';
import { n } from '../../helpers/mathHelpers';

const Sidebar = ({
  transactions,
  accounts,
  amountsByAccount,
  setActiveAccount,
  categories,
  payees,
  setDate,
  activeType,
  setType,
  setCategory,
  setPayee,
  setSearch
}) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  useEffect(() => {
    setTotalBalance(
      transactions
        .map(t => t.actualAmount)
        .reduce((sum, amount) => sum + amount, 0)
    );
  }, [transactions]);
  return (
    <div className={styles.sidebar}>
      <button
        className={styles.accountsButton}
        type="button"
        onClick={() => setActiveAccount(null)}
      >
        <span>All accounts</span>
        <span>{n(totalBalance)} EGP</span>
      </button>
      {accounts.map(account => (
        <button
          key={account.id}
          className={styles.accountButton}
          type="button"
          onClick={() => setActiveAccount(account.id)}
        >
          <span>{account.name}</span>
          <span>
            {n(
              amountsByAccount[account.id] &&
                amountsByAccount[account.id].reduce(
                  (sum, amount) => sum + amount,
                  0
                )
            )}{' '}
            EGP
          </span>
        </button>
      ))}
      <button
        type="button"
        className={styles.expandButton}
        onClick={() => setFiltersExpanded(!filtersExpanded)}
      >
        <span style={{ marginRight: '4px' }}>Filters</span>
        {filtersExpanded ? <FaCaretDown /> : <FaCaretRight />}
      </button>
      <div
        className={cx(styles.filters, filtersExpanded ? styles.expanded : '')}
      >
        <Filters
          categories={categories}
          payees={payees}
          setDate={setDate}
          activeType={activeType}
          setType={setType}
          setCategory={setCategory}
          setPayee={setPayee}
          setSearch={setSearch}
        />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  transactions: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  amountsByAccount: PropTypes.object.isRequired,
  setActiveAccount: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  payees: PropTypes.array.isRequired,
  setDate: PropTypes.func.isRequired,
  activeType: PropTypes.string.isRequired,
  setType: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  setPayee: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default Sidebar;
