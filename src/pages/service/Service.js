/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import useFilterMachine from 'hooks/useFilterMachine';
import { Link } from 'react-router-dom';
import Table from 'ui/Table';
import { ServiceContext } from 'App/hooks/useServicesContext';
import transactionsGql from './gql/transactions.gql';
import sidebarGql from './gql/sidebar.gql';
import Header from './components/Header';
import TransactionsHeader from './components/TransactionHeader';
import Transaction from './components/Transaction';
import styles from './Service.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import TransactionInput from './components/TransactionInput';
import contributorTransactionsGql from './gql/contributorTransactions.gql';
import contributorSidebarGql from './gql/contributorSidebar.gql';

const Service = () => {
  const { activeService, isOwnService } = useContext(ServiceContext);
  const [optionsState, setOptionsState] = useState({
    sidebar: false,
    header: true
  });

  const [modalOpen, setModalOpen] = useState(false);

  const { data, loading, error } = useQuery(
    isOwnService ? transactionsGql : contributorTransactionsGql,
    isOwnService
      ? {
          fetchPolicy: 'cache-and-network'
        }
      : {
          fetchPolicy: 'cache-and-network',
          skip: !activeService,
          variables: {
            serviceId: activeService?.id
          }
        }
  );

  const { data: sidebarData } = useQuery(
    isOwnService ? sidebarGql : contributorSidebarGql,
    isOwnService
      ? {
          fetchPolicy: 'cache-and-network'
        }
      : {
          fetchPolicy: 'cache-and-network',
          skip: !activeService,
          variables: {
            serviceId: activeService?.id
          }
        }
  );

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

  if (error)
    return (
      <div className={styles.loading}>
        <p>{activeService?.id?.slice(0, 8)}</p>
        <p>Error!</p>
      </div>
    );

  if (!activeService)
    return (
      <div className={styles.loading}>
        You have not logged into any service.&nbsp;
        <Link to="/">Please choose one!</Link>
      </div>
    );

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
          <p className={styles.headerTitle}>
            {isOwnService
              ? 'My Service'
              : `${activeService?.owner?.name}'s service`}
          </p>
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

export default Service;
