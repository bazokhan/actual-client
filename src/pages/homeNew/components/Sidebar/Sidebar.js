/* eslint-disable no-param-reassign */
import React, { useState, useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { FaCaretRight, FaCaretDown, FaExclamationCircle } from 'react-icons/fa';
import { n } from 'helpers/mathHelpers';
import styles from './Sidebar.module.scss';
import Filters from './components/Filters';
import useAccounts from '../../hooks/useAccounts';
import sidebarGql from '../../gql/sidebar.gql';
import Search from './components/Search';

const ToggleButton = ({ expanded, onClick, text }) => (
  <button type="button" className={styles.expandButton} onClick={onClick}>
    <FaExclamationCircle />
    <span style={{ margin: '4px' }}>{text}</span>
    {expanded ? <FaCaretDown /> : <FaCaretRight />}
  </button>
);

ToggleButton.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

const Sidebar = ({
  account: activeAccount,
  activeType,
  filterByAccount,
  filterByType,
  filterByCategory,
  filterByPayee,
  filterBySearch,
  filterByAfter,
  filterByBefore,
  startDate,
  endDate
}) => {
  const [isExapanded, setIsExpanded] = useState({
    search: true,
    filters: false
  });

  const expand = keyName => {
    const tabNames = Object.keys(isExapanded);
    if (!keyName || !tabNames.length || !tabNames.includes(keyName)) return;
    const updatedTabState = tabNames.reduce((obj, key) => {
      if (key === keyName) {
        obj[key] = !isExapanded[key];
        return obj;
      }
      obj[key] = false;
      return obj;
    }, {});
    setIsExpanded(updatedTabState);
  };
  const { accounts, balance } = useAccounts();

  const { data, error } = useQuery(sidebarGql, {
    fetchPolicy: 'cache-and-network'
  });

  const categories = useMemo(
    () => (data && data.categories ? data.categories : []),
    [data]
  );

  const payees = useMemo(() => (data && data.payees ? data.payees : []), [
    data
  ]);

  const loading = useMemo(() => (!categories || !payees) && !data, [
    categories,
    payees,
    data
  ]);

  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading</div>;

  return (
    <div className={styles.sidebar}>
      <button
        className={cx(
          styles.accountsButton,
          !activeAccount ? styles.active : ''
        )}
        type="button"
        onClick={() => filterByAccount([null, t => t])}
      >
        <span>All accounts</span>
        <span>{n(balance)} EGP</span>
      </button>
      {accounts.map(account => (
        <button
          key={account.id}
          className={cx(
            styles.accountButton,
            activeAccount && activeAccount.id === account.id
              ? styles.active
              : ''
          )}
          type="button"
          onClick={() =>
            filterByAccount([account, t => t.account.id === account.id])
          }
        >
          <span>{account.name}</span>
          <span>{n(account.balance)} EGP</span>
        </button>
      ))}
      <div className={styles.tabs}>
        <ToggleButton
          expanded={isExapanded.search}
          text="Search"
          onClick={() => expand('search')}
        />
        <div
          className={cx(
            styles.filters,
            isExapanded.search ? styles.expanded : ''
          )}
        >
          <Search filterBySearch={filterBySearch} />
        </div>
        <ToggleButton
          expanded={isExapanded.filters}
          text="Filters"
          onClick={() => expand('filters')}
        />
        <div
          className={cx(
            styles.filters,
            isExapanded.filters ? styles.expanded : ''
          )}
        >
          <Filters
            categories={categories}
            payees={payees}
            activeType={activeType}
            filterByType={filterByType}
            filterByCategory={filterByCategory}
            filterByPayee={filterByPayee}
            filterByAfter={filterByAfter}
            filterByBefore={filterByBefore}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  account: PropTypes.object,
  activeType: PropTypes.string,
  filterByAccount: PropTypes.func.isRequired,
  filterByType: PropTypes.func.isRequired,
  filterByCategory: PropTypes.func.isRequired,
  filterByPayee: PropTypes.func.isRequired,
  filterBySearch: PropTypes.func.isRequired,
  filterByAfter: PropTypes.func.isRequired,
  filterByBefore: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string
};

Sidebar.defaultProps = {
  account: null,
  activeType: null,
  startDate: null,
  endDate: null
};

export default Sidebar;
