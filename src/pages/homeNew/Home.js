import React, { useState, useMemo, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List, areEqual } from 'react-window';
import { useQuery } from '@apollo/react-hooks';
import mapSort from 'mapsort';
import { numerizeDate } from 'helpers/dateHelpers';
import { sortNumsDescending } from 'helpers/sortHelpers';
import transactionsGql from './gql/transactions.gql';
import Header from './components/Header';
import TransactionsHeader from './components/TransactionHeader';
import Transaction from './components/Transaction';
import TransactionFooter from './components/TransactionFooter';
import styles from './Home.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import TransactionInput from './components/TransactionInput';

const Home = () => {
  const [activeAccount, setActiveAccount] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({
    sort: [t => numerizeDate(t.date), sortNumsDescending],
    account: [null, t => t],
    after: [null, t => t],
    before: [null, t => t],
    type: [null, t => t],
    category: null,
    payee: null,
    search: null
  });

  const { data, error } = useQuery(transactionsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const transactions = useMemo(
    () =>
      data && data.transactions
        ? data.transactions.map(t => ({
            ...t,
            searchString: [
              t.date,
              t.payee.name || '',
              t.notes || '',
              t.category.name || '',
              (t.amount && t.amount.toString()) || ''
            ]
              .join(' ')
              .toLowerCase()
          }))
        : [],
    [data]
  );

  const loading = useMemo(() => !transactions && !data, [transactions, data]);

  const [activeTransactions, setActiveTransactions] = useState(transactions);

  const accountFilter = (arr, account, filterFunc) => {
    setActiveAccount(account);
    return arr.filter(filterFunc);
  };

  const typeFilter = (arr, type, filterFunc) => {
    setActiveType(type);
    return arr.filter(filterFunc);
  };

  const beforeFilter = (arr, date, filterFunc) => {
    setEndDate(date);
    return arr.filter(filterFunc);
  };

  const afterFilter = (arr, date, filterFunc) => {
    setStartDate(date);
    return arr.filter(filterFunc);
  };

  useEffect(() => {
    setActiveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    setActiveTransactions(
      Object.entries(filters).reduce((prev, [name, filter]) => {
        if (name === 'sort' && filter) {
          return mapSort(prev, ...filter);
        }
        if (name === 'account' && filter) {
          return accountFilter(prev, ...filter);
        }
        if (name === 'type' && filter) {
          return typeFilter(prev, ...filter);
        }
        if (name === 'after' && filter) {
          return afterFilter(prev, ...filter);
        }
        if (name === 'before' && filter) {
          return beforeFilter(prev, ...filter);
        }
        if (filter && typeof filter === 'function') {
          return prev.filter(filter);
        }
        return prev;
      }, transactions)
    );
  }, [filters, transactions]);

  const sortBy = (arrayMapFunc, sortFunc) =>
    setFilters({ ...filters, sort: [arrayMapFunc, sortFunc] });
  const filterByAccount = accountFilters =>
    setFilters({ ...filters, account: accountFilters });
  const filterByType = typeFilters =>
    setFilters({ ...filters, type: typeFilters });
  const filterByAfter = afterFilters =>
    setFilters({ ...filters, after: afterFilters });
  const filterByBefore = beforeFilters =>
    setFilters({ ...filters, before: beforeFilters });
  const filterByCategory = categoryFilter =>
    setFilters({ ...filters, category: categoryFilter });
  const filterByPayee = payeeFilter =>
    setFilters({ ...filters, payee: payeeFilter });
  const filterBySearch = searchFilter =>
    setFilters({ ...filters, search: searchFilter });

  const Row = memo(
    ({ data: transactionsList, index, style }) => (
      <div key={transactionsList[index].id} style={style}>
        <Transaction
          account={activeAccount}
          activeType={activeType}
          transaction={transactionsList[index]}
        />
      </div>
    ),
    areEqual
  );

  Row.propTypes = {
    data: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
  };

  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading</div>;
  return (
    <div className={styles.container}>
      <Sidebar
        account={activeAccount}
        activeType={activeType}
        filterByAccount={filterByAccount}
        filterByType={filterByType}
        filterByCategory={filterByCategory}
        filterByPayee={filterByPayee}
        filterBySearch={filterBySearch}
        filterByAfter={filterByAfter}
        filterByBefore={filterByBefore}
        startDate={startDate}
        endDate={endDate}
      />
      <div className={styles.main}>
        <div className={styles.header}>
          <Header
            account={activeAccount}
            activeType={activeType}
            transactions={activeTransactions}
            setShow={setShow}
          />
          <TransactionsHeader
            account={activeAccount}
            activeType={activeType}
            sortBy={sortBy}
          />
        </div>
        <div className={styles.body}>
          <TransactionInput
            account={activeAccount}
            activeType={activeType}
            show={show}
            setShow={setShow}
          />
          {/* {activeTransactions.map(transaction => (
            <Transaction
              key={transaction.id}
              account={activeAccount}
              activeType={activeType}
              transaction={transaction}
            />
          ))} */}
          <List
            height={740}
            useIsScrolling
            itemCount={activeTransactions.length}
            itemSize={35}
            itemData={activeTransactions}
            width="100%"
          >
            {Row}
          </List>
        </div>
        <div className={styles.footer}>
          <TransactionFooter
            account={activeAccount}
            activeType={activeType}
            transactions={activeTransactions}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
