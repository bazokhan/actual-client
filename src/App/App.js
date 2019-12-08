import React, { useState, useEffect } from 'react';
import useInitialLoad from '../hooks/useInitialLoad';
import styles from './App.module.scss';
import './styles/Main.scss';
import {
  resolveTransactions,
  sortAmountsByAccount,
  sortTransactions
} from '../helpers/resolveTransactions';
import Transaction from './components/Transaction';
import TransactionsHeader from './components/TransactionsHeader';
import Sidebar from './components/Sidebar';

const App = () => {
  const {
    loading,
    accounts,
    categories,
    categoryGroups,
    categoryMapping,
    payees,
    payeeMapping,
    transactions
  } = useInitialLoad();

  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [amountsByAccount, setAmountsByAccount] = useState({});
  const [sortState, setSortState] = useState({
    prop: null,
    isAscending: false
  });

  useEffect(() => {
    console.log(sortState);
    setSortedTransactions(sortTransactions(sortedTransactions, sortState));
  }, [sortState]);

  useEffect(() => {
    if (transactions) {
      setSortedTransactions(
        resolveTransactions(transactions, accounts, categories, categoryGroups)
      );
    }
  }, [transactions]);

  useEffect(() => {
    setAmountsByAccount(sortAmountsByAccount(transactions, accounts));
  }, [transactions]);

  if (loading) return <div>Loading..</div>;

  return (
    <div className={styles.container}>
      <Sidebar
        transactions={transactions}
        accounts={accounts}
        amountsByAccount={amountsByAccount}
      />
      <div className={styles.main}>
        <div className={styles.header}>
          <p>Telescan</p>
          <TransactionsHeader
            sortState={sortState}
            setSortState={setSortState}
          />
        </div>
        <div className={styles.body}>
          {sortedTransactions.map(transaction => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
              accounts={accounts}
              categories={categories}
              categoryGroups={categoryGroups}
              categoryMapping={categoryMapping}
              payees={payees}
              payeeMapping={payeeMapping}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
