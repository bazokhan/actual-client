import React, { useContext, useMemo } from 'react';
import { DataContext } from 'App/context';
import useFilterMachine from 'hooks/useFilterMachine';
import TransactionsHeader from 'pages/service/components/TransactionHeader';
import Table from 'ui/Table';
import Transaction from './components/Transaction';

const LegacyData = () => {
  const { activeTransactions } = useContext(DataContext);

  const transactions = useMemo(
    () =>
      activeTransactions.map(t => ({
        ...t,
        category: t.categoryObj
      })),
    [activeTransactions]
  );

  const {
    filteredTransactions,
    filterValues,
    filterBy,
    sortBy
  } = useFilterMachine(transactions);

  return (
    <Table
      title="Old database transactions"
      rowHeight={30}
      data={filteredTransactions}
      context={{
        filterValues,
        filterBy,
        sortBy
      }}
      header={TransactionsHeader}
      row={Transaction}
    />
  );
};

export default LegacyData;
