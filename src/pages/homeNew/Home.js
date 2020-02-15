import React, { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List, areEqual } from 'react-window';
import { useQuery } from '@apollo/react-hooks';
import useFilterMachine from 'hooks/useFilterMachine';
import transactionsGql from './gql/transactions.gql';
import Header from './components/Header';
import TransactionsHeader from './components/TransactionHeader';
import Transaction from './components/Transaction';
import TransactionFooter from './components/TransactionFooter';
import styles from './Home.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import TransactionInput from './components/TransactionInput';

const Home = () => {
  const [show, setShow] = useState(false);

  const { data, error } = useQuery(transactionsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const transactions = useMemo(
    () =>
      data && data.transactions
        ? data.transactions.map(t => ({
            ...t,
            searchString: [
              t.date,
              t.payee.name || '',
              t.notes || '',
              t.category.name || '',
              (t.amount && t.amount.toString()) || ''
            ]
              .join(' ')
              .toLowerCase()
          }))
        : [],
    [data]
  );

  const loading = useMemo(() => !transactions && !data, [transactions, data]);

  const {
    filteredTransactions,
    sortBy,
    filterBy,
    filterValues,
    reset
  } = useFilterMachine(transactions);

  const Row = memo(
    ({ data: transactionsList, index, style }) => (
      <div key={transactionsList[index].id} style={style}>
        <Transaction
          filters={filterValues}
          transaction={transactionsList[index]}
        />
      </div>
    ),
    areEqual
  );

  Row.propTypes = {
    data: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
  };

  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading</div>;

  return (
    <div className={styles.container}>
      <button type="button" onClick={reset}>
        Reset all filters
      </button>
      <Sidebar filters={filterValues} filterBy={filterBy} />
      <div className={styles.main}>
        <div className={styles.header}>
          <Header
            filters={filterValues}
            transactions={filteredTransactions}
            setShow={setShow}
          />
          <TransactionsHeader filters={filterValues} sortBy={sortBy} />
        </div>
        <div className={styles.body}>
          <TransactionInput
            filters={filterValues}
            show={show}
            setShow={setShow}
          />

          <List
            height={740}
            useIsScrolling
            itemCount={filteredTransactions.length}
            itemSize={35}
            itemData={filteredTransactions}
            width="100%"
          >
            {Row}
          </List>
        </div>
        <div className={styles.footer}>
          <TransactionFooter
            filters={filterValues}
            transactions={filteredTransactions}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
