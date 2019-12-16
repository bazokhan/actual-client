import React, { useState, useEffect, useMemo } from 'react';
// import cx from 'classnames';
import { FaExpand } from 'react-icons/fa';
import mapSort from 'mapsort';
import useInitialLoad from '../hooks/useInitialLoad';
import styles from './App.module.scss';
import './styles/Main.scss';
import './styles/spectre.min.scss';
import './styles/spectre-exp.min.scss';
import './styles/spectre-icons.min.scss';
import {
  resolveTransactions,
  // sortAmountsByAccount,
  // sortTransactions,
  toggleFullScreen,
  sortAmountsByAccount
} from '../helpers';
import Transaction from './components/Transaction';
import TransactionsHeader from './components/TransactionsHeader';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import resolvePayees from '../helpers/resolvePayees';
// import { sum, n } from '../helpers/mathHelpers';
import TransactionFooter from './components/TransactionFooter';
import ExcelExport from './components/ExcelExport';

const App = () => {
  const {
    loading,
    accounts,
    categories,
    categoryGroups,
    payees,
    transactions
  } = useInitialLoad();

  const [activeTransactions, setActiveTransactions] = useState([]);
  const [activeAccount, setActiveAccount] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [dateFilter, setDateFilter] = useState([]);
  const [activeType, setActiveType] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activePayee, setActivePayee] = useState('');
  const [searchString, setSearchString] = useState('');

  const allPayees = useMemo(
    () => (payees && !loading ? resolvePayees(payees, accounts) : []),
    [payees, loading, accounts]
  );

  const allTransactions = useMemo(
    () =>
      transactions && allPayees.length && !loading
        ? resolveTransactions(
            transactions,
            accounts,
            categories,
            categoryGroups,
            allPayees
          )
        : [],
    [transactions, loading, allPayees, accounts, categories, categoryGroups]
  );

  useEffect(() => {
    setActiveTransactions(
      allTransactions
        .filter(t => (activeAccount ? t.account.id === activeAccount : t))
        .filter(t =>
          dateFilter.length === 2
            ? dateFilter[0] <= t.date && t.date <= dateFilter[1]
            : t
        )
        .filter(t => (activeType ? t.amountType === activeType : t))
        .filter(t => (activeCategory ? t.categoryObj.id === activeCategory : t))
        .filter(t => (activePayee ? t.payee.id === activePayee : t))
        .filter(t => t.searchString.includes(searchString))
    );
  }, [
    activeAccount,
    allTransactions,
    dateFilter,
    activeType,
    activeCategory,
    activePayee,
    searchString
  ]);

  const sortBy = (arrayMapFunc, sortFunc) =>
    setActiveTransactions(
      mapSort(activeTransactions, arrayMapFunc, sortFunc)
        .filter(t =>
          dateFilter.length === 2
            ? dateFilter[0] <= t.date && t.date <= dateFilter[1]
            : t
        )
        .filter(t => (activeType ? t.amountType === activeType : t))
        .filter(t => (activeCategory ? t.categoryObj.id === activeCategory : t))
        .filter(t => (activePayee ? t.payee.id === activePayee : t))
        .filter(t => t.searchString.includes(searchString))
    );

  if (loading) return <div className={styles.loading}>Loading..</div>;

  return (
    <div className={styles.container}>
      <Sidebar
        transactions={
          !loading
            ? resolveTransactions(
                transactions,
                accounts,
                categories,
                categoryGroups,
                allPayees
              )
            : []
        }
        setActiveAccount={setActiveAccount}
        accounts={accounts}
        amountsByAccount={sortAmountsByAccount(allTransactions, accounts)}
        categories={categories}
        payees={allPayees}
        setSearch={setSearchString}
        setCategory={setActiveCategory}
        setPayee={setActivePayee}
        setDate={setDateFilter}
        setType={setActiveType}
        activeType={activeType}
      />
      <div className={styles.main}>
        <button
          className={styles.topBar}
          type="button"
          onClick={toggleFullScreen}
        >
          <FaExpand />
        </button>
        <div className={styles.header}>
          <Header
            transactions={activeTransactions}
            accountsAmounts={
              sortAmountsByAccount(allTransactions, accounts)[activeAccount] ||
              allTransactions.map(t => t.actualAmount)
            }
            // categories={categories}
            // payees={allPayees}
            title={
              activeAccount
                ? accounts.find(a => a.id === activeAccount).name
                : 'All accounts'
            }
            // setSearch={setSearchString}
            // setCategory={setActiveCategory}
            // setPayee={setActivePayee}
            // setDate={setDateFilter}
            // setType={setActiveType}
            // activeType={activeType}
          />
          <ExcelExport
            transactions={activeTransactions}
            activeAccount={activeAccount}
            activeType={activeType}
          />
          <TransactionsHeader
            activeAccount={activeAccount}
            sortBy={sortBy}
            isAscending={isAscending}
            toggleSortMode={() => setIsAscending(!isAscending)}
            activeType={activeType}
          />
        </div>
        <div className={styles.body}>
          {activeTransactions.map(transaction => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
              activeAccount={activeAccount}
              activeType={activeType}
            />
          ))}
        </div>
        <div className={styles.footer}>
          <TransactionFooter
            activeAccount={activeAccount}
            activeTransactions={activeTransactions}
            activeType={activeType}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
