import { useMemo } from 'react';
import useInitialLoad from 'hooks/useInitialLoad';
import { resolveTransactions, resolvePayees } from 'helpers';

const useMigrationData = () => {
  const {
    loading,
    accounts,
    categories,
    categoryGroups,
    payees,
    transactions
  } = useInitialLoad();

  const allPayees = useMemo(
    () => (payees && !loading ? resolvePayees(payees, accounts) : []),
    [payees, loading, accounts]
  );

  const allTransactions = useMemo(
    () =>
      transactions && allPayees.length && !loading
        ? resolveTransactions(
            transactions.filter(
              transaction =>
                !transaction.starting_balance_flag && !transaction.tombstone
            ),
            accounts,
            categories,
            categoryGroups,
            allPayees
          )
        : [],
    [transactions, loading, allPayees, accounts, categories, categoryGroups]
  );

  const deadTransactions = useMemo(
    () =>
      transactions && allPayees.length && !loading
        ? resolveTransactions(
            transactions.filter(
              transaction =>
                transaction.starting_balance_flag || transaction.tombstone
            ),
            accounts,
            categories,
            categoryGroups,
            allPayees
          )
        : [],
    [transactions, loading, allPayees, accounts, categories, categoryGroups]
  );

  return {
    loading,
    accounts,
    categories,
    categoryGroups,
    payees: allPayees,
    transactions: allTransactions,
    deadTransactions
  };
};

export default useMigrationData;
