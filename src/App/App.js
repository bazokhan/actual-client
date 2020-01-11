/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo } from 'react';
import useMigrationData from 'hooks/useMigrationData';
import './styles/Main.scss';
import './styles/spectre.min.scss';
import './styles/spectre-exp.min.scss';
import './styles/spectre-icons.min.scss';
import { sortAmountsByAccount } from 'helpers';
import HomePage from 'pages/home';
import HomeNew from 'pages/homeNew';
import HistoryPage from 'pages/history';
// import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import AuthPage from 'pages/auth';
import PivotPage from 'pages/pivot';
import PivotNew from 'pages/pivotNew';
import MigratePage from 'pages/migrate';
import CategoryPage from 'pages/category';
import mapSort from 'mapsort';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { DataContext } from './context';
import styles from './App.module.scss';
import client from './client';
import AuthRoute from './AuthRoute';

const App = () => {
  const {
    loading,
    accounts,
    categories,
    categoryGroups,
    payees,
    transactions,
    deadTransactions
  } = useMigrationData();

  const authToken = localStorage.getItem('auth_token');

  const [activeTransactions, setActiveTransactions] = useState([]);
  const [activeAccount, setActiveAccount] = useState('');
  const [dateFilter, setDateFilter] = useState([]);
  const [activeType, setActiveType] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activePayee, setActivePayee] = useState('');
  const [searchString, setSearchString] = useState('');

  const activeAccountAmount = useMemo(
    () =>
      sortAmountsByAccount(transactions, accounts)[activeAccount] ||
      transactions.map(t => t.actualAmount),
    [transactions, activeAccount, accounts]
  );

  const allAccountsAmounts = useMemo(
    () => sortAmountsByAccount(transactions, accounts),
    [transactions, accounts]
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
      transactions
        .map(t => t.actualAmount)
        .reduce((sum, amount) => sum + amount, 0),
    [transactions]
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
      payees,
      transactions,
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
      totalTransactions,
      authToken
    }),
    [
      accounts,
      categories,
      categoryGroups,
      payees,
      transactions,
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
      totalTransactions,
      authToken
    ]
  );

  useEffect(() => {
    setActiveTransactions(
      transactions
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
    transactions,
    dateFilter,
    activeType,
    activeCategory,
    activePayee,
    searchString
  ]);

  if (loading) return <div className={styles.loading}>Loading..</div>;

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <DataContext.Provider value={DataContextValue}>
          <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>
              {/* <Navbar
                activeTransactions={activeTransactions}
                activeAccount={activeAccount}
                activeType={activeType}
              /> */}
              <Switch>
                <Route path="/auth" component={AuthPage} />
                <AuthRoute path="/newHome" component={HomeNew} />
                <AuthRoute path="/migrate" component={MigratePage} />
                <AuthRoute path="/history" component={HistoryPage} />
                <AuthRoute path="/pivot/:categoryid" component={CategoryPage} />
                <AuthRoute path="/pivot" component={PivotPage} />
                <AuthRoute path="/newPivot" component={PivotNew} />
                <AuthRoute path="/" component={HomePage} />
              </Switch>
            </div>
          </div>
        </DataContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
