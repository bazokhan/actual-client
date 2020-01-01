import React, { useState, useEffect, useMemo } from 'react';
import useInitialLoad from 'hooks/useInitialLoad';
import './styles/Main.scss';
import './styles/spectre.min.scss';
import './styles/spectre-exp.min.scss';
import './styles/spectre-icons.min.scss';
import {
  resolveTransactions,
  sortAmountsByAccount,
  resolvePayees
} from 'helpers';
import Sidebar from 'components/Sidebar';
import HomePage from 'pages/home';
import HistoryPage from 'pages/history';
import mapSort from 'mapsort';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { DataContext } from './context';
import styles from './App.module.scss';
import Navbar from '../components/Navbar';

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
            transactions.filter(
              transaction =>
                !transaction.starting_balance_flag && !transaction.tombstone
            ),
            accounts,
            categories,
            categoryGroups,
            allPayees
          )
        : [],
    [transactions, loading, allPayees, accounts, categories, categoryGroups]
  );

  const deadTransactions = useMemo(
    () =>
      transactions && allPayees.length && !loading
        ? resolveTransactions(
            transactions.filter(
              transaction =>
                transaction.starting_balance_flag || transaction.tombstone
            ),
            accounts,
            categories,
            categoryGroups,
            allPayees
          )
        : [],
    [transactions, loading, allPayees, accounts, categories, categoryGroups]
  );

  const activeAccountAmount = useMemo(
    () =>
      sortAmountsByAccount(allTransactions, accounts)[activeAccount] ||
      allTransactions.map(t => t.actualAmount),
    [allTransactions, activeAccount, accounts]
  );

  const allAccountsAmounts = useMemo(
    () => sortAmountsByAccount(allTransactions, accounts),
    [allTransactions, accounts]
  );

  const activeAccountName = useMemo(
    () =>
      activeAccount
        ? accounts.find(account => account.id === activeAccount).name
        : 'all accounts',
    [activeAccount, accounts]
  );

  const totalBalance = useMemo(
    () =>
      allTransactions
        .map(t => t.actualAmount)
        .reduce((sum, amount) => sum + amount, 0),
    [allTransactions]
  );

  const sortBy = useMemo(
    () => (arrayMapFunc, sortFunc) =>
      setActiveTransactions(
        mapSort(activeTransactions, arrayMapFunc, sortFunc)
          .filter(t =>
            dateFilter.length === 2
              ? dateFilter[0] <= t.date && t.date <= dateFilter[1]
              : t
          )
          .filter(t => (activeType ? t.amountType === activeType : t))
          .filter(t =>
            activeCategory ? t.categoryObj.id === activeCategory : t
          )
          .filter(t => (activePayee ? t.payee.id === activePayee : t))
          .filter(t => t.searchString.includes(searchString))
      ),
    [
      activeTransactions,
      dateFilter,
      activeType,
      activeCategory,
      activePayee,
      searchString
    ]
  );

  const DataContextValue = useMemo(
    () => ({
      accounts,
      categories,
      categoryGroups,
      payees: allPayees,
      transactions: allTransactions,
      activeTransactions,
      allAccountsAmounts,
      activeAccount,
      activeAccountAmount,
      activeType,
      activeCategory,
      activePayee,
      dateFilter,
      setActiveAccount,
      setDateFilter,
      setActiveType,
      setActiveCategory,
      setActivePayee,
      setSearchString,
      setActiveTransactions,
      activeAccountName,
      searchString,
      sortBy,
      totalBalance,
      deadTransactions
    }),
    [
      accounts,
      categories,
      categoryGroups,
      allPayees,
      allTransactions,
      activeTransactions,
      allAccountsAmounts,
      activeAccount,
      activeAccountAmount,
      activeType,
      activeCategory,
      activePayee,
      dateFilter,
      setActiveAccount,
      setDateFilter,
      setActiveType,
      setActiveCategory,
      setActivePayee,
      setSearchString,
      setActiveTransactions,
      activeAccountName,
      searchString,
      sortBy,
      totalBalance,
      deadTransactions
    ]
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

  if (loading) return <div className={styles.loading}>Loading..</div>;

  return (
    <BrowserRouter>
      <DataContext.Provider value={DataContextValue}>
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.main}>
            <Navbar
              activeTransactions={activeTransactions}
              activeAccount={activeAccount}
              activeType={activeType}
            />
            <Switch>
              <Route path="/history" component={HistoryPage} />
              <Route path="/" component={HomePage} />
            </Switch>
          </div>
        </div>
      </DataContext.Provider>
    </BrowserRouter>
  );
};

export default App;
