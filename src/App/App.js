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
import Header from './components/Header';

const App = () => {
  const {
    loading,
    accounts,
    categories,
    categoryGroups,
    // categoryMapping,
    payees,
    // payeeMapping,
    transactions
  } = useInitialLoad();
  // console.log(transactions);

  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [amountsByAccount, setAmountsByAccount] = useState({});
  const [sortState, setSortState] = useState({
    prop: null,
    isAscending: false
  });
  const [activeAccount, setActiveAccount] = useState('all');

  useEffect(() => {
    if (sortedTransactions.length) {
      sortedTransactions.map(t => {
        // console.log(payees.find(p => p.id === t.description));
        return t;
      });
    }
  }, [sortedTransactions]);

  useEffect(() => {
    // console.log(sortState);
    setSortedTransactions(sortTransactions(sortedTransactions, sortState));
  }, [sortState]);

  useEffect(() => {
    if (transactions && !loading) {
      setSortedTransactions(
        resolveTransactions(
          transactions,
          accounts,
          categories,
          categoryGroups,
          payees
        )
      );
    }
  }, [transactions, loading]);

  useEffect(() => {
    if (transactions && !loading) {
      setAmountsByAccount(
        sortAmountsByAccount(
          resolveTransactions(
            transactions,
            accounts,
            categories,
            categoryGroups,
            payees
          ),
          accounts
        )
      );
    }
  }, [transactions, loading]);

  if (loading) return <div>Loading..</div>;

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
                payees
              )
            : []
        }
        accounts={accounts}
        amountsByAccount={amountsByAccount}
      />
      <div className={styles.main}>
        <div className={styles.header}>
          <Header transactions={sortedTransactions} title="telescan" />
          <TransactionsHeader
            sortState={sortState}
            setSortState={setSortState}
          />
        </div>
        <div className={styles.body}>
          {sortedTransactions.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
