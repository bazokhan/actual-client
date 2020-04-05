import { useMemo, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ServiceContext } from 'App/hooks/useServicesContext';
import accountsGql from '../gql/accounts.gql';
import contributorAccountsGql from '../gql/contributorAccounts.gql';

const useAccounts = () => {
  const { activeService, isOwnService } = useContext(ServiceContext);
  const { data, loading, error } = useQuery(
    isOwnService ? accountsGql : contributorAccountsGql,
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

  const accounts = useMemo(() => (data && data.accounts ? data.accounts : []), [
    data
  ]);

  const balance = useMemo(() => accounts.reduce((a, b) => a + b.balance, 0), [
    accounts
  ]);

  return { accounts, loading, error, balance };
};

export default useAccounts;
