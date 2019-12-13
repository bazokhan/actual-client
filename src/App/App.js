import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { FaExpand } from 'react-icons/fa';
import numeral from 'numeral';
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

const n = num => numeral(num).format('0,0.00');

const toggleFullScreen = () => {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
};

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
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [amountsByAccount, setAmountsByAccount] = useState({});
  const [sortState, setSortState] = useState({
    prop: null,
    isAscending: false
  });
  const [activeAccount, setActiveAccount] = useState(null);

  useEffect(() => {
    if (sortedTransactions.length) {
      sortedTransactions.map(t => {
        // console.log(payees.find(p => p.id === t.description));
        return t;
      });
    }
  }, [sortedTransactions]);

  useEffect(() => {
    if (activeAccount) {
      const filtered = sortedTransactions.filter(
        t => t.account.id === activeAccount
      );
      setFilteredTransactions(filtered);
    }
  }, [activeAccount]);

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
        setActiveAccount={setActiveAccount}
        accounts={accounts}
        amountsByAccount={amountsByAccount}
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
            transactions={
              activeAccount && filteredTransactions.length > 0
                ? filteredTransactions
                : sortedTransactions
            }
            title={
              activeAccount
                ? accounts.find(a => a.id === activeAccount).name
                : 'All accounts'
            }
          />
          <TransactionsHeader
            activeAccount={activeAccount}
            sortState={sortState}
            setSortState={setSortState}
          />
        </div>
        <div className={styles.body}>
          {activeAccount && filteredTransactions.length > 0
            ? filteredTransactions.map(transaction => (
                <Transaction
                  key={transaction.id}
                  transaction={transaction}
                  activeAccount={activeAccount}
                />
              ))
            : sortedTransactions.map(transaction => (
                <Transaction
                  key={transaction.id}
                  transaction={transaction}
                  activeAccount={activeAccount}
                />
              ))}
        </div>
        <div className={styles.footer}>
          <div className={styles.row}>
            <div className={styles.midCell}>Total</div>
            {!activeAccount && <div className={styles.midCell}></div>}
            <div className={styles.normCell}></div>
            <div className={styles.bigCell}></div>
            <div className={styles.midCell}></div>
            <div className={styles.midCell}></div>
            <div className={cx(styles.midCell, styles.right)}>
              {n(
                filteredTransactions.reduce((sum, t) => {
                  if (t.amountType === 'Payment')
                    return sum + t.actualAmount * -1;
                  return sum;
                }, 0)
              )}
            </div>
            <div className={cx(styles.midCell, styles.right)}>
              {n(
                filteredTransactions.reduce((sum, t) => {
                  if (t.amountType === 'Deposit') return sum + t.actualAmount;
                  return sum;
                }, 0)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
