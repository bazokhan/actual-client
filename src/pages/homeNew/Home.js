import React, { useState, useMemo, memo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List, areEqual } from 'react-window';
import { useQuery } from '@apollo/react-hooks';
import useFilterMachine from 'hooks/useFilterMachine';
import transactionsGql from './gql/transactions.gql';
import Header from './components/Header';
import TransactionsHeader from './components/TransactionHeader';
import Transaction from './components/Transaction';
import styles from './Home.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import TransactionInput from './components/TransactionInput';
import sidebarGql from './gql/sidebar.gql';
import { COLOR_WHEEL, MAIN_COLORS } from '../../App/constants/Colors';
import WindowDiv from '../../ui/WindowDiv';
import PlaceholderDiv from '../../ui/PlaceholderDiv';

const Home = () => {
  const [optionsState, setOptionsState] = useState({
    sidebar: true,
    header: true
  });
  const listRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    const transactionIndex = categories?.reduce((prev, c, i) => {
      if (c?.id === transaction?.category?.id) {
        return i;
      }
      return prev;
    }, 0);
    const accountIndex = accounts?.reduce((prev, a, i) => {
      if (a?.id === transaction?.account?.id) {
        return i;
      }
      return prev;
    }, 0);
    const payeeIndex = payees?.reduce((prev, p, i) => {
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
          categoryColor={COLOR_WHEEL[transactionIndex % COLOR_WHEEL.length]}
          style={
            isOdd
              ? {
                  ...style,
                  background: 'linear-gradient(transparent, #F8F6F1)'
                }
              : { ...style }
          }
          accountColor={MAIN_COLORS[accountIndex % MAIN_COLORS.length]}
          payeeColor={COLOR_WHEEL[payeeIndex % COLOR_WHEEL.length]}
        />
      </div>
    );
  }, areEqual);

  Row.propTypes = {
    data: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
  };

  const [mode, setMode] = useState('original');
  const [listHeight, setListHeight] = useState(340);

  useLayoutEffect(() => {
    setListHeight(
      console.log(listRef?.current?.getClientRects()) ||
        listRef?.current?.getClientRects()?.[0]?.height ||
        340
    );
  }, [listRef, mode]);

  if (error) return <div className={styles.loading}>Error!</div>;
  // if (loading) return <div className={styles.loading}>Loading</div>;

  return (
    <div className={styles.container}>
      {/* <button type="button" onClick={reset}>
        Reset all filters
      </button> */}
      {optionsState.sidebar && (
        <Sidebar filters={filterValues} filterBy={filterBy} />
      )}
      <div className={styles.main}>
        <div className={styles.header}>
          <Header
            filters={filterValues}
            transactions={filteredTransactions}
            setModalOpen={setModalOpen}
            optionsState={optionsState}
            setOptionsState={setOptionsState}
          />
          <TransactionsHeader filters={filterValues} sortBy={sortBy} />
        </div>
        <div className={styles.body}>
          {modalOpen && (
            <TransactionInput
              filters={filterValues}
              onClose={() => setModalOpen(false)}
            />
          )}

          {loading ? (
            <PlaceholderDiv
              number={Math.floor(listHeight / 64)}
              height={listHeight}
            />
          ) : (
            <WindowDiv
              ref={listRef}
              title="Transactions table"
              onExpand={() => setMode('fullScreen')}
              onMinimize={() => setMode('minimized')}
              onRestore={() => setMode('original')}
            >
              <List
                height={listHeight}
                useIsScrolling
                itemCount={filteredTransactions.length}
                itemSize={60}
                itemData={filteredTransactions}
                width="100%"
              >
                {Row}
              </List>
            </WindowDiv>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
