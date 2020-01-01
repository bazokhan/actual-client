import React, { useState, useRef, useContext } from 'react';
import ReactToPrint from 'react-to-print';
import { FaPrint } from 'react-icons/fa';
import mapSort from 'mapsort';
import ExcelExport from 'components/ExcelExport';
import Print from 'components/Print';
import TransactionsHeader from 'components/TransactionHeader';
import Transaction from 'components/Transaction';
import TransactionFooter from 'components/TransactionFooter';
import Header from 'components/Header';
import { DataContext } from 'App/context';
import styles from './Home.module.scss';

const PrintButton = () => (
  <button type="button" className="btn btn-action s-square">
    <FaPrint />
  </button>
);

const Home = () => {
  const printRef = useRef();
  const {
    activeAccount,
    activeType,
    activeCategory,
    activePayee,
    activeTransactions,
    dateFilter,
    setActiveTransactions,
    searchString
  } = useContext(DataContext);
  const [isAscending, setIsAscending] = useState(false);

  const sortBy = (arrayMapFunc, sortFunc) =>
    setActiveTransactions(
      mapSort(activeTransactions, arrayMapFunc, sortFunc)
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

  return (
    <>
      <div className={styles.header}>
        <Header />
        <div className={styles.actionButtons}>
          <ExcelExport
            transactions={activeTransactions}
            activeAccount={activeAccount}
            activeType={activeType}
          />
          <ReactToPrint
            trigger={PrintButton}
            content={() => printRef.current}
            copyStyles
          />
        </div>
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
      <div className={styles.print} ref={printRef}>
        <Print
          transactions={activeTransactions}
          activeAccount={activeAccount}
          activeType={activeType}
        />
      </div>
    </>
  );
};

export default Home;
