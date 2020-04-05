import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import transactionsGql from '../gql/transactions.gql';
import accountsGql from '../gql/accounts.gql';
import groupsGql from '../gql/groups.gql';
import {
  reduceTransactions,
  accumulateTransactions
} from '../helpers/reduceTransactions';

const useChartsData = () => {
  const [activeAccount, setActiveAccount] = useState({
    label: 'All accounts',
    value: ''
  });
  const [activeGroup, setActiveGroup] = useState({
    label: 'All groups',
    value: ''
  });

  const { data, error, loading } = useQuery(transactionsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const transactions = useMemo(() => data?.transactions || [], [data]);

  const { data: accountsData } = useQuery(accountsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: groupsData } = useQuery(groupsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const accounts = useMemo(
    () => (accountsData && accountsData.accounts ? accountsData.accounts : []),
    [accountsData]
  );

  const groups = useMemo(
    () => (groupsData && groupsData.groups ? groupsData.groups : []),
    [groupsData]
  );

  const accountsOptions = useMemo(
    () => [
      {
        label: 'All accounts',
        value: ''
      },
      ...accounts.map(account => ({ label: account.name, value: account.id }), [
        accounts
      ])
    ],
    [accounts]
  );

  const groupsOptions = useMemo(
    () => [
      {
        label: 'All groups',
        value: ''
      },
      ...groups.map(group => ({ label: group.name, value: group.id }), [groups])
    ],
    [groups]
  );

  const dailyData = useMemo(
    () =>
      transactions
        .filter(t =>
          activeAccount.value ? t.account.id === activeAccount.value : t
        )
        .filter(t =>
          activeGroup.value ? t.category.group.id === activeGroup.value : t
        )
        .reduce(reduceTransactions, []),
    [transactions, activeAccount, activeGroup]
  );

  const accumulatedData = useMemo(
    () =>
      transactions
        .sort((a, b) => a.date - b.date)
        .filter(t =>
          activeAccount.value ? t.account.id === activeAccount.value : t
        )
        .filter(t =>
          activeGroup.value ? t.category.group.id === activeGroup.value : t
        )
        .reduce(accumulateTransactions, []),
    [transactions, activeAccount, activeGroup]
  );

  return {
    activeAccount,
    setActiveAccount,
    activeGroup,
    setActiveGroup,
    error,
    loading,
    accountsOptions,
    groupsOptions,
    dailyData,
    accumulatedData
  };
};

export default useChartsData;
