import { useState, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import accountsGql from 'gql/accounts.gql';
import groupsGql from 'gql/groups.gql';
import categoriesGql from 'gql/categories.gql';
import payeesGql from 'gql/payees.gql';
import transactionsGql from 'gql/transactions.gql';
import { dateNumToString } from 'helpers/dateHelpers';
import useMigrationData from 'hooks/useMigrationData';
import {
  transferGroupId,
  transferinId,
  transferoutId,
  spareCategoryId,
  spareGroupId,
  sparePayeeId
} from 'App/constants/Ids';
import migrateAccountGql from '../gql/migrateAccount.gql';
import migrateGroupGql from '../gql/migrateGroup.gql';
import migrateCategoryGql from '../gql/migrateCategory.gql';
import migratePayeeGql from '../gql/migratePayee.gql';
import migrateTransactionGql from '../gql/migrateTransaction.gql';

const useMigrationSteps = () => {
  const {
    accounts,
    groups,
    categories,
    payees,
    transactions
  } = useMigrationData();

  const [loading, setLoading] = useState({
    accounts: false,
    groups: false,
    categories: false,
    payees: false,
    transactions: false,
    transfer: false
  });

  const [migrateAccountMutation] = useMutation(migrateAccountGql, {
    refetchQueries: [
      { query: accountsGql, variables: { includeDeleted: true } }
    ],
    awaitRefetchQueries: true
  });

  const [migrateGroupMutation] = useMutation(migrateGroupGql, {
    refetchQueries: [{ query: groupsGql, variables: { includeDeleted: true } }],
    awaitRefetchQueries: true
  });

  const [migrateCategoryMutation] = useMutation(migrateCategoryGql, {
    refetchQueries: [
      { query: categoriesGql, variables: { includeDeleted: true } }
    ],
    awaitRefetchQueries: true
  });

  const [migratePayeeMutation] = useMutation(migratePayeeGql, {
    refetchQueries: [{ query: payeesGql, variables: { includeDeleted: true } }],
    awaitRefetchQueries: true
  });

  const [migrateTransactionMutation] = useMutation(migrateTransactionGql, {
    refetchQueries: [
      { query: transactionsGql, variables: { includeDeleted: true } }
    ],
    awaitRefetchQueries: true
  });

  const { data: accountsData, loading: accountsLoading } = useQuery(
    accountsGql,
    {
      fetchPolicy: 'cache-and-network',
      variables: { includeDeleted: true }
    }
  );
  const { data: groupsData, loading: groupsLoading } = useQuery(groupsGql, {
    fetchPolicy: 'cache-and-network',
    variables: { includeDeleted: true }
  });
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    categoriesGql,
    {
      fetchPolicy: 'cache-and-network',
      variables: { includeDeleted: true }
    }
  );
  const { data: payeesData, loading: payeesLoading } = useQuery(payeesGql, {
    fetchPolicy: 'cache-and-network',
    variables: { includeDeleted: true }
  });
  const { data: transactionsData, loading: transactionsLoading } = useQuery(
    transactionsGql,
    {
      fetchPolicy: 'cache-and-network',
      variables: { includeDeleted: true }
    }
  );

  const successAccounts = useMemo(
    () =>
      accountsData &&
      accountsData.accounts &&
      accountsData.accounts.length >= accounts.length,
    [accountsData, accounts]
  );

  const successCategories = useMemo(
    () =>
      categoriesData &&
      categoriesData.categories &&
      categoriesData.categories.length >= categories.length + 2,
    [categoriesData, categories]
  );

  const successGroups = useMemo(
    () =>
      groupsData &&
      groupsData.groups &&
      groupsData.groups.length >= groups.length,
    [groupsData, groups]
  );

  const successPayees = useMemo(
    () =>
      payeesData &&
      payeesData.payees &&
      payeesData.payees.length >= payees.length,
    [payeesData, payees]
  );

  const successTransactions = useMemo(
    () =>
      transactionsData &&
      transactionsData.transactions &&
      transactionsData.transactions.length >= transactions.length,
    [transactionsData, transactions]
  );

  const queriesLoading = useMemo(
    () =>
      accountsLoading ||
      groupsLoading ||
      categoriesLoading ||
      payeesLoading ||
      transactionsLoading,
    [
      accountsLoading,
      groupsLoading,
      categoriesLoading,
      payeesLoading,
      transactionsLoading
    ]
  );

  const existingTransactions = useMemo(
    () => transactionsData?.transactions?.map(t => t.id),
    [transactionsData]
  );

  const steps = [
    {
      index: 0,
      name: 'accounts',
      label: 'Accounts',
      newRecords: accountsData ? accountsData.accounts.length : 0,
      oldRecords: accounts.length,
      loading: loading.accounts,
      success: successAccounts,
      // success: false,
      prevSuccess: true,
      onClick: async () => {
        setLoading({ ...loading, accounts: true });
        accounts.reduce(async (prev, next, index) => {
          const newPrev = await prev;
          try {
            await migrateAccountMutation({
              variables: {
                account: {
                  id: next.id,
                  name: next.name,
                  tombstone: next.tombstone
                }
              }
            });
          } catch (ex) {
            console.log(ex);
          }
          if (index === accounts.length - 1) {
            setLoading({ ...loading, accounts: false });
          }
          return newPrev;
        }, []);
      }
    },
    {
      index: 1,
      name: 'groups',
      label: 'Groups',
      newRecords: groupsData ? groupsData.groups.length : 0,
      oldRecords: groups.length + 2,
      loading: loading.groups,
      success: successGroups,
      prevSuccess: successAccounts,
      onClick: async () => {
        setLoading({ ...loading, groups: true });
        groups.reduce(async (prev, next, index) => {
          const newPrev = await prev;
          try {
            await migrateGroupMutation({
              variables: {
                group: {
                  id: next.id,
                  name: next.name,
                  isIncome: next.is_income > 0,
                  tombstone: next.tombstone
                }
              }
            });
          } catch (ex) {
            console.log(ex);
            newPrev.push(ex);
          }
          if (index === groups.length - 1) {
            setLoading({ ...loading, groups: false });
          }
          return newPrev;
        }, []);
        try {
          await migrateGroupMutation({
            variables: {
              group: {
                id: transferGroupId,
                name: 'transfer',
                isIncome: false,
                tombstone: 0
              }
            }
          });
        } catch (ex) {
          console.log(ex);
        }
        try {
          await migrateGroupMutation({
            variables: {
              group: {
                id: spareGroupId,
                name: 'Spare Group',
                isIncome: false,
                tombstone: 0
              }
            }
          });
        } catch (ex) {
          console.log(ex);
        }
      }
    },
    {
      index: 2,
      name: 'categories',
      label: 'Categories',
      newRecords: categoriesData ? categoriesData.categories.length : 0,
      oldRecords: categories.length + 3,
      loading: loading.categories,
      success: successCategories,
      prevSuccess: successGroups,
      onClick: async () => {
        setLoading({ ...loading, categories: true });
        await categories.reduce(async (prev, next) => {
          const newPrev = await prev;
          try {
            await migrateCategoryMutation({
              variables: {
                category: {
                  id: next.id,
                  name: next.name,
                  groupId: groups.find(g => g.id === next.cat_group)?.id,
                  tombstone: next.tombstone
                }
              }
            });
          } catch (ex) {
            if (ex.message?.includes('No Group Found!')) {
              await migrateCategoryMutation({
                variables: {
                  category: {
                    id: next.id,
                    name: next.name,
                    groupId: spareGroupId,
                    tombstone: next.tombstone
                  }
                }
              });
            } else {
              console.log(next);
              console.log(ex);
            }
            newPrev.push(ex);
          }

          return newPrev;
        }, []);
        await [
          { id: transferinId, name: 'Transfer In', tombstone: 0 },
          { id: transferoutId, name: 'Transfer Out', tombstone: 0 }
        ].reduce(async (prev, next) => {
          const newPrev = await prev;
          try {
            await migrateCategoryMutation({
              variables: {
                category: {
                  id: next.id,
                  name: next.name,
                  groupId: transferGroupId,
                  tombstone: next.tombstone
                }
              }
            });
          } catch (ex) {
            console.log(next);
            console.log(ex);
            newPrev.push(ex);
          }
          return newPrev;
        }, []);
        try {
          await migrateCategoryMutation({
            variables: {
              category: {
                id: spareCategoryId,
                name: 'Spare Category',
                groupId: spareGroupId,
                tombstone: 0
              }
            }
          });
        } catch (ex) {
          console.log(ex);
        }
        setLoading({ ...loading, categories: false });
      }
    },
    {
      index: 3,
      name: 'payees',
      label: 'Payees',
      newRecords: payeesData ? payeesData.payees.length : 0,
      oldRecords: payees.length + 1,
      loading: loading.payees,
      success: successPayees,
      prevSuccess: successCategories,
      onClick: async () => {
        setLoading({ ...loading, payees: true });
        payees.reduce(async (prev, next) => {
          const newPrev = await prev;
          try {
            const transferAccount = accounts.find(
              a => a.id === next.transfer_acct
            );
            await migratePayeeMutation({
              variables: {
                payee: transferAccount
                  ? {
                      id: next.id,
                      name: `${transferAccount.name} (Account)`,
                      accountId: transferAccount.id,
                      tombstone: transferAccount.tombstone
                    }
                  : { id: next.id, name: next.name, tombstone: next.tombstone }
              }
            });
          } catch (ex) {
            console.log(ex);
            newPrev.push(ex);
          }
        }, []);
        try {
          await migratePayeeMutation({
            variables: {
              payee: {
                id: sparePayeeId,
                name: 'Spare Payee',
                tombstone: 0
              }
            }
          });
        } catch (ex) {
          console.log(ex);
        }
        setLoading({ ...loading, payees: false });
      }
    },
    {
      index: 4,
      name: 'transactions',
      label: 'Transactions',
      newRecords: transactionsData ? transactionsData.transactions.length : 0,
      oldRecords: transactions.length,
      loading: loading.transactions,
      success: successTransactions,
      prevSuccess: successPayees,
      onClick: async () => {
        setLoading({ ...loading, transactions: true });
        await transactions.reduce(async (prev, next) => {
          if (existingTransactions?.includes(next?.id)) {
            return prev;
          }
          const newPrev = await prev;
          try {
            await migrateTransactionMutation({
              variables: {
                transaction: {
                  id: next.id,
                  amount: next.actualAmount,
                  notes: next.notes,
                  date: dateNumToString(next.date, 'DMY'),
                  accountId: next.account.id,
                  categoryId: next.categoryObj.id,
                  payeeId: next.payee.id,
                  tombstone: next.tombstone
                }
              }
            });
          } catch (ex) {
            if (ex.message?.includes('No Payee Found!')) {
              await migrateTransactionMutation({
                variables: {
                  transaction: {
                    id: next.id,
                    amount: next.actualAmount,
                    notes: next.notes,
                    date: dateNumToString(next.date, 'DMY'),
                    accountId: next.account.id,
                    categoryId: next.categoryObj.id,
                    payeeId: sparePayeeId,
                    tombstone: next.tombstone
                  }
                }
              });
            } else {
              console.log(next);
              console.log(ex);
              newPrev.push({ error: ex, id: next?.id, transaction: next });
            }
          }
          return newPrev;
        }, []);
        setLoading({ ...loading, transactions: false });
      }
    }
  ];
  return { steps, loading: queriesLoading };
};

export default useMigrationSteps;
