import React, { useContext, useMemo } from 'react';
import Transaction from 'components/Transaction';
import { DataContext } from 'App/context';
import styles from './History.module.scss';

const History = () => {
  const { deadTransactions } = useContext(DataContext);
  const sortedTransactions = useMemo(
    () => [...deadTransactions].sort((a, b) => a - b),
    [deadTransactions]
  );
  return (
    <>
      <div className={styles.header}>
        <div className={styles.row}>
          <div className={styles.midCell}>
            <p>Date</p>
          </div>
          <div className={styles.midCell}>
            <p>Account</p>
          </div>
          <div className={styles.normCell}>
            <p>Payee</p>
          </div>
          <div className={styles.bigCell}>
            <p>Notes</p>
          </div>
          <div className={styles.midCell}>
            <p>Category</p>
          </div>
          <div className={styles.midCell}>
            <p>Payment</p>
          </div>
          <div className={styles.midCell}>
            <p>Deposit</p>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        {sortedTransactions.map(transaction => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
            activeAccount=""
            activeType=""
          />
        ))}
      </div>
    </>
  );
};

export default History;
