/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataContext } from 'App/context';
import Header from 'components/Header';
import mapSort from 'mapsort';
import TransactionsHeader from 'components/TransactionHeader';
import Transaction from 'components/Transaction';
import TransactionFooter from 'components/TransactionFooter';
import styles from './Category.module.scss';

const Category = ({ match }) => {
  const { transactionsByCategory } = useContext(DataContext);

  const transactions = useMemo(
    () =>
      (transactionsByCategory.find(c => c.id === match.params.categoryid) || {})
        .transactions || [],
    [match.params.categoryid, transactionsByCategory]
  );

  const [sortedTransactions, setSortedTransactions] = useState(transactions);

  useEffect(() => {
    setSortedTransactions(transactions);
  }, [transactions]);

  const sortBy = useMemo(
    () => (arrayMapFunc, sortFunc) =>
      setSortedTransactions(mapSort(transactions, arrayMapFunc, sortFunc)),
    [transactions]
  );

  const [isAscending, setIsAscending] = useState(false);
  const toggleSortMode = () => setIsAscending(!isAscending);
  return (
    <>
      <div className={styles.header}>
        <Header />
        <TransactionsHeader
          sortBy={sortBy}
          isAscending={isAscending}
          toggleSortMode={toggleSortMode}
        />
      </div>
      <div className={styles.body}>
        {sortedTransactions &&
          sortedTransactions.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
      </div>
      <div className={styles.footer}>
        <TransactionFooter activeTransactions={sortedTransactions} />
      </div>
    </>
  );
};

Category.propTypes = {
  match: PropTypes.object.isRequired
};

export default Category;
