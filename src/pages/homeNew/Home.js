import React, { useState, useMemo, memo, useRef } from 'react';
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
import sidebarGql from './gql/sidebar.gql';

const colors = [
  '#26de80',
  '#de4663',
  '#1382eb',
  '#EB2226',
  '#DE4400',
  '#0C8810',
  '#056DBA',
  '#0E9447',
  '#9324A2',
  '#565451',
  '#C9205D',
  '#D63B40',
  '#F96F07',
  '#394960',
  '#C43A2D',
  '#D95405',
  '#4EB49F',
  '#51C9B0'
];

const payeeColors = [
  '#26de80',
  '#de4663',
  '#1382eb',
  '#EB2226',
  '#DE4400',
  '#0C8810',
  '#056DBA',
  '#0E9447',
  '#9324A2',
  '#565451',
  '#C9205D',
  '#D63B40',
  '#F96F07',
  '#394960',
  '#C43A2D',
  '#D95405',
  '#4EB49F',
  '#51C9B0'
];

// const accountColors = ['#000000', '#666666', '#999999'];
const accountColors = ['#43a5f2', '#056DBA', '#394960'];
const Home = () => {
  const listRef = useRef(null);
  const [show, setShow] = useState(false);

  const { data, loading, error } = useQuery(transactionsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: sidebarData } = useQuery(sidebarGql, {
    fetchPolicy: 'cache-and-network'
  });

  const categories = useMemo(() => sidebarData?.categories, [sidebarData]);
  const accounts = useMemo(() => sidebarData?.accounts, [sidebarData]);
  const payees = useMemo(() => sidebarData?.payees, [sidebarData]);

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

  // const loading = useMemo(() => !transactions && !data, [transactions, data]);

  const {
    filteredTransactions,
    sortBy,
    filterBy,
    filterValues,
    reset
  } = useFilterMachine(transactions);

  const Row = memo(({ data: transactionsList, index, style }) => {
    const transaction = transactionsList[index];
    const isOdd = index % 2;
    const transactionIndex = categories.reduce((prev, c, i) => {
      if (c?.id === transaction?.category?.id) {
        return i;
      }
      return prev;
    }, 0);
    const accountIndex = accounts.reduce((prev, a, i) => {
      if (a?.id === transaction?.account?.id) {
        return i;
      }
      return prev;
    }, 0);
    const payeeIndex = payees.reduce((prev, p, i) => {
      if (p?.id === transaction?.payee?.id) {
        return i;
      }
      return prev;
    }, 0);
    return (
      <div key={transaction.id}>
        <Transaction
          filters={filterValues}
          transaction={transaction}
          tagColor={colors[transactionIndex % colors.length]}
          style={
            isOdd
              ? {
                  ...style,
                  background: 'linear-gradient(transparent, #F8F6F1)'
                }
              : { ...style }
          }
          // tagColor={`${colors[0]}${Math.floor(
          //   transactionIndex % 10
          // )}${Math.floor(transactionIndex % 10)}`}
          accountColor={accountColors[accountIndex % accountColors.length]}
          payeeColor={payeeColors[payeeIndex % payeeColors.length]}
        />
      </div>
    );
  }, areEqual);

  Row.propTypes = {
    data: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
  };

  if (error) return <div className={styles.loading}>Error!</div>;
  // if (loading) return <div className={styles.loading}>Loading</div>;

  return (
    <div className={styles.container}>
      {/* <button type="button" onClick={reset}>
        Reset all filters
      </button> */}
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
          {show && (
            <TransactionInput
              filters={filterValues}
              onClose={() => setShow(false)}
            />
          )}

          {loading ? (
            <div className={styles.placeholder}>
              <div />
              <div />
              <div />
              <div />
            </div>
          ) : (
            <div className={styles.list} ref={listRef}>
              <List
                height={listRef?.current?.getClientRects()?.[0]?.height || 340}
                useIsScrolling
                itemCount={filteredTransactions.length}
                itemSize={60}
                itemData={filteredTransactions}
                width="100%"
              >
                {Row}
              </List>
            </div>
          )}
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
