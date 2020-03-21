import React, { useMemo, useContext } from 'react';
import { sum, n } from 'helpers/mathHelpers';
import { DataContext } from 'App/context';
import styles from './Header.module.scss';

const Header = () => {
  const {
    activeTransactions,
    activeAccountAmount,
    activeAccountName
  } = useContext(DataContext);
  const totalBalance = useMemo(
    () => activeAccountAmount.reduce((total, next) => total + next, 0),
    [activeAccountAmount]
  );
  const sheetNet = useMemo(() => sum(activeTransactions), [activeTransactions]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.transactionNum}>
        <p>{activeTransactions.length}</p>
        <p>transactions</p>
      </div>
      <div className={styles.title}>
        <h1>{activeAccountName}</h1>
      </div>
      <div className={styles.totalsRow}>
        <div className={styles.balance}>
          <h2>BALANCE</h2>
          <p>{n(totalBalance)} EGP</p>
        </div>
        <div className={styles.balance}>
          <h2>Sheet Net</h2>
          <p>{n(sheetNet)} EGP</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
