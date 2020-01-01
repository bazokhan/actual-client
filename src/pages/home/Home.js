import React, { useState, useContext } from 'react';
import TransactionsHeader from 'components/TransactionHeader';
import Transaction from 'components/Transaction';
import TransactionFooter from 'components/TransactionFooter';
import { DataContext } from 'App/context';
import Header from 'components/Header';
import styles from './Home.module.scss';

const Home = () => {
  const { activeAccount, activeType, activeTransactions, sortBy } = useContext(
    DataContext
  );
  const [isAscending, setIsAscending] = useState(false);
  return (
    <>
      <div className={styles.header}>
        <Header />
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
    </>
  );
};

export default Home;
