import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';
import { FaPrint } from 'react-icons/fa';
import mapSort from 'mapsort';
import { resolveTransactions, sortAmountsByAccount } from 'helpers';
import Header from 'components/Header';
import ExcelExport from 'components/ExcelExport';
import Print from 'components/Print';
import TransactionsHeader from 'components/TransactionHeader';
import Transaction from 'components/Transaction';
import TransactionFooter from 'components/TransactionFooter';
import resolvePayees from 'helpers/resolvePayees';
import styles from './Home.module.scss';

const PrintButton = () => (
  <button type="button" className="btn btn-action s-square">
    <FaPrint />
  </button>
);

const Home = ({
  activeTransactions,
  setActiveTransactions,
  activeAccount,
  dateFilter,
  activeType,
  activeCategory,
  activePayee,
  searchString,
  data: { accounts, categories, categoryGroups, payees, transactions }
}) => {
  const printRef = useRef();
  const [isAscending, setIsAscending] = useState(false);
  const allPayees = useMemo(
    () => (payees ? resolvePayees(payees, accounts) : []),
    [payees, accounts]
  );

  const allTransactions = useMemo(
    () =>
      transactions && allPayees.length
        ? resolveTransactions(
            transactions,
            accounts,
            categories,
            categoryGroups,
            allPayees
          )
        : [],
    [transactions, allPayees, accounts, categories, categoryGroups]
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
        <Header
          transactions={activeTransactions}
          accountsAmounts={
            sortAmountsByAccount(allTransactions, accounts)[activeAccount] ||
            allTransactions.map(t => t.actualAmount)
          }
          title={
            activeAccount
              ? accounts.find(a => a.id === activeAccount).name
              : 'All accounts'
          }
        />
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

Home.propTypes = {
  activeAccount: PropTypes.string.isRequired,
  dateFilter: PropTypes.array.isRequired,
  activeType: PropTypes.string.isRequired,
  activeCategory: PropTypes.string.isRequired,
  activePayee: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  activeTransactions: PropTypes.array.isRequired,
  setActiveTransactions: PropTypes.func.isRequired
};

export default Home;
