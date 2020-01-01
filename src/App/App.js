import React, { useState, useEffect, useMemo } from 'react';
import { FaExpand } from 'react-icons/fa';
import useInitialLoad from 'hooks/useInitialLoad';
import './styles/Main.scss';
import './styles/spectre.min.scss';
import './styles/spectre-exp.min.scss';
import './styles/spectre-icons.min.scss';
import {
  resolveTransactions,
  toggleFullScreen,
  sortAmountsByAccount,
  resolvePayees
} from 'helpers';
import Sidebar from 'components/Sidebar';
import Home from 'pages/home';
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
        <Home
          data={{ accounts, categories, categoryGroups, payees, transactions }}
          activeAccount={activeAccount}
          dateFilter={dateFilter}
          activeType={activeType}
          activeCategory={activeCategory}
          activePayee={activePayee}
          searchString={searchString}
          activeTransactions={activeTransactions}
          setActiveTransactions={setActiveTransactions}
        />
      </div>
    </div>
  );
};

export default App;
