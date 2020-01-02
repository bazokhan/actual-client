/* eslint-disable no-nested-ternary */
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
import Navbar from 'components/Navbar';
import PivotPage from 'pages/pivot';
import CategoryPage from 'pages/category';
import mapSort from 'mapsort';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { DataContext } from './context';
import styles from './App.module.scss';

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

  const transactionsByCategory = useMemo(
    () =>
      [
        ...categories,
        { id: 'transfer', type: 'in' },
        { id: 'transfer', type: 'out' }
      ]
        .map(category =>
          activeTransactions.filter(
            t =>
              t.categoryObj.id === category.id &&
              t.categoryObj.type === category.type
          )
        )
        .filter(category => category.length)
        .map(category => ({
          id: category.length
            ? category.find(t => t.categoryObj).categoryObj.id
            : 'NotFound',
          name: category.length
            ? category.find(t => t.categoryObj).categoryObj.name
            : 'No name',
          amount: category.reduce((sum, t) => sum + t.actualAmount, 0),
          accounts: category.reduce(
            (all, t) =>
              all.includes(t.account.name) ? all : [...all, t.account.name],
            []
          ),
          payees: category.reduce(
            (all, t) =>
              all.includes(t.payee.name || t.transferAccount.name)
                ? all
                : [
                    ...all,
                    t.payee.name
                      ? t.payee.name
                      : t.transferAccount.name
                      ? t.transferAccount.name
                      : null
                  ],
            []
          ),
          duration: category.reduce(
            (startEnd, t) => [
              Math.min(startEnd[0], t.date),
              Math.max(startEnd[1], t.date)
            ],
            [100000000, 0]
          ),
          transactions: category
        }))
        .map(category =>
          category.amount >= 0
            ? { ...category, amountType: 'Deposit' }
            : { ...category, amountType: 'Payment' }
        ),
    [categories, activeTransactions]
  );

  const totalPayment = useMemo(
    () =>
      transactionsByCategory.reduce(
        (sum, category) =>
          category.amountType === 'Payment' ? sum + category.amount : sum,
        0
      ),
    [transactionsByCategory]
  );

  const totalDeposit = useMemo(
    () =>
      transactionsByCategory.reduce(
        (sum, category) =>
          category.amountType === 'Deposit' ? sum + category.amount : sum,
        0
      ),
    [transactionsByCategory]
  );

  const totalTransactions = useMemo(
    () =>
      transactionsByCategory.reduce(
        (sum, category) => sum + category.transactions.length,
        0
      ),
    [transactionsByCategory]
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
      deadTransactions,
      transactionsByCategory,
      totalPayment,
      totalDeposit,
      totalTransactions
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
      deadTransactions,
      transactionsByCategory,
      totalPayment,
      totalDeposit,
      totalTransactions
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
              <Route path="/pivot/:categoryid" component={CategoryPage} />
              <Route path="/pivot" component={PivotPage} />
              <Route path="/" component={HomePage} />
            </Switch>
          </div>
        </div>
      </DataContext.Provider>
    </BrowserRouter>
  );
};

export default App;
