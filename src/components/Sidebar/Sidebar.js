import React, { useState, useContext } from 'react';
import cx from 'classnames';
import { FaCaretRight, FaCaretDown } from 'react-icons/fa';
import { n } from 'helpers/mathHelpers';
import { DataContext } from 'App/context';
import styles from './Sidebar.module.scss';
import Filters from '../Filters';

const Sidebar = () => {
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const {
    accounts,
    categories,
    activeType,
    payees,
    allAccountsAmounts,
    totalBalance,
    activeAccount,
    setActiveAccount,
    setDateFilter,
    setActiveType,
    setActiveCategory,
    setActivePayee,
    setSearchString
  } = useContext(DataContext);

  return (
    <div className={styles.sidebar}>
      <button
        className={cx(
          styles.accountsButton,
          !activeAccount ? styles.active : ''
        )}
        type="button"
        onClick={() => setActiveAccount(null)}
      >
        <span>All accounts</span>
        <span>{n(totalBalance)} EGP</span>
      </button>
      {accounts.map(account => (
        <button
          key={account.id}
          className={cx(
            styles.accountButton,
            activeAccount === account.id ? styles.active : ''
          )}
          type="button"
          onClick={() => setActiveAccount(account.id)}
        >
          <span>{account.name}</span>
          <span>
            {n(
              allAccountsAmounts[account.id] &&
                allAccountsAmounts[account.id].reduce(
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
          setDate={setDateFilter}
          activeType={activeType}
          setType={setActiveType}
          setCategory={setActiveCategory}
          setPayee={setActivePayee}
          setSearch={setSearchString}
        />
      </div>
    </div>
  );
};

export default Sidebar;
