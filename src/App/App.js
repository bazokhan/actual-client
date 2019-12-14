import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { FaExpand } from 'react-icons/fa';
import numeral from 'numeral';
import mapSort from 'mapsort';
import useInitialLoad from '../hooks/useInitialLoad';
import styles from './App.module.scss';
import './styles/Main.scss';
import {
  resolveTransactions,
  // sortAmountsByAccount,
  // sortTransactions,
  toggleFullScreen
} from '../helpers';
import Transaction from './components/Transaction';
import TransactionsHeader from './components/TransactionsHeader';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const n = num => numeral(num).format('0,0.00');

const App = () => {
  const {
    loading,
    accounts,
    categories,
    categoryGroups,
    payees,
    transactions
  } = useInitialLoad();

  const [allTransactions, setAllTransactions] = useState([]);
  const [activeTransactions, setActiveTransactions] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    if (transactions && !loading) {
      setAllTransactions(
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
    if (activeAccount) {
      const filtered = allTransactions.filter(
        t => t.account.id === activeAccount
      );
      setActiveTransactions(filtered);
    } else {
      setActiveTransactions(allTransactions);
    }
  }, [activeAccount, allTransactions]);

  const sortBy = (arrayMapFunc, sortFunc) =>
    setActiveTransactions(mapSort(activeTransactions, arrayMapFunc, sortFunc));

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
        amountsByAccount={{}}
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
            categories={categories}
            payees={payees}
            title={
              activeAccount
                ? accounts.find(a => a.id === activeAccount).name
                : 'All accounts'
            }
            filter={filterFunc => {
              if (activeAccount) {
                const filtered = allTransactions.filter(
                  t => t.account.id === activeAccount
                );
                setActiveTransactions(filtered.filter(filterFunc));
              } else {
                setActiveTransactions(allTransactions.filter(filterFunc));
              }
            }}
          />
          <TransactionsHeader
            activeAccount={activeAccount}
            sortBy={sortBy}
            isAscending={isAscending}
            toggleSortMode={() => setIsAscending(!isAscending)}
          />
        </div>
        <div className={styles.body}>
          {activeTransactions.map(transaction => (
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
            {!activeAccount && <div className={styles.midCell} />}
            <div className={styles.normCell} />
            <div className={styles.bigCell} />
            <div className={styles.midCell} />
            <div className={styles.midCell} />
            <div className={cx(styles.midCell, styles.right)}>
              {n(
                activeTransactions.reduce((sum, t) => {
                  if (t.amountType === 'Payment')
                    return sum + t.actualAmount * -1;
                  return sum;
                }, 0)
              )}
            </div>
            <div className={cx(styles.midCell, styles.right)}>
              {n(
                activeTransactions.reduce((sum, t) => {
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
