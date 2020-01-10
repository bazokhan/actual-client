import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import accountsGql from '../gql/accounts.gql';

const useAccounts = () => {
  const { data: aData, loading, error } = useQuery(accountsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const accounts = useMemo(
    () => (aData && aData.accounts ? aData.accounts : []),
    [aData]
  );

  const balance = useMemo(() => accounts.reduce((a, b) => a + b.balance, 0), [
    accounts
  ]);

  return { accounts, loading, error, balance };
};

export default useAccounts;
