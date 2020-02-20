/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo, forwardRef } from 'react';
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
import Table from '../../ui/Table';

const Home = () => {
  const [optionsState, setOptionsState] = useState({
    sidebar: true,
    header: true
  });

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

  if (error) return <div className={styles.loading}>Error!</div>;

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
        </div>
        <div className={styles.body}>
          {modalOpen && (
            <TransactionInput
              filters={filterValues}
              onClose={() => setModalOpen(false)}
            />
          )}
          {
            <Table
              data={filteredTransactions}
              loading={loading}
              context={{
                categories,
                accounts,
                payees,
                filterValues,
                sortBy,
                reset
              }}
              header={TransactionsHeader}
              row={Transaction}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
