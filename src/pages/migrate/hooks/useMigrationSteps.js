import { useState, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import accountsGql from 'gql/accounts.gql';
import groupsGql from 'gql/groups.gql';
import categoriesGql from 'gql/categories.gql';
import payeesGql from 'gql/payees.gql';
import transactionsGql from 'gql/transactions.gql';
import { dateNumToString } from 'helpers/dateHelpers';
import useMigrationData from 'hooks/useMigrationData';
import createAccountsGql from '../gql/createAccounts.gql';
import createGroupsGql from '../gql/createGroups.gql';
import createCategoriesGql from '../gql/createCategories.gql';
import createPayeesGql from '../gql/createPayees.gql';
import migrateTransactionsGql from '../gql/migrateTransactions.gql';

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

  const [createAccountsMutation] = useMutation(createAccountsGql, {
    refetchQueries: [
      { query: accountsGql, variables: { includeDeleted: true } }
    ],
    awaitRefetchQueries: true
  });

  const [createGroupsMutation] = useMutation(createGroupsGql, {
    refetchQueries: [{ query: groupsGql, variables: { includeDeleted: true } }],
    awaitRefetchQueries: true
  });

  const [createCategoriesMutation] = useMutation(createCategoriesGql, {
    refetchQueries: [
      { query: categoriesGql, variables: { includeDeleted: true } }
    ],
    awaitRefetchQueries: true
  });

  const [createTransferMutation] = useMutation(createCategoriesGql, {
    refetchQueries: [
      { query: categoriesGql, variables: { includeDeleted: true } }
    ],
    awaitRefetchQueries: true
  });

  const [createPayeesMutation] = useMutation(createPayeesGql, {
    refetchQueries: [{ query: payeesGql, variables: { includeDeleted: true } }],
    awaitRefetchQueries: true
  });

  const [migrateTransactionsMutation] = useMutation(migrateTransactionsGql, {
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
      accountsData.accounts.length === accounts.length,
    [accountsData, accounts]
  );

  const successCategories = useMemo(
    () =>
      categoriesData &&
      categoriesData.categories &&
      categoriesData.categories.length === categories.length + 2,
    [categoriesData, categories]
  );

  const successGroups = useMemo(
    () =>
      groupsData &&
      groupsData.groups &&
      groupsData.groups.length === groups.length,
    [groupsData, groups]
  );

  const successPayees = useMemo(
    () =>
      payeesData &&
      payeesData.payees &&
      payeesData.payees.length === payees.length,
    [payeesData, payees]
  );

  const successTransactions = useMemo(
    () =>
      transactionsData &&
      transactionsData.transactions &&
      transactionsData.transactions.length === transactions.length,
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
            await createAccountsMutation({
              variables: {
                accounts: [next].map(a => ({
                  name: a.name,
                  // userId: '88feacf0-2ffb-11ea-977a-51bad9170054'
                  tombstone: a.tombstone
                }))
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
      oldRecords: groups.length,
      loading: loading.groups,
      success: successGroups,
      prevSuccess: successAccounts,
      onClick: async () => {
        setLoading({ ...loading, groups: true });
        groups.reduce(async (prev, next, index) => {
          const newPrev = await prev;
          try {
            await createGroupsMutation({
              variables: {
                groups: [next].map(g => ({
                  name: g.name,
                  isIncome: g.is_income > 0,
                  tombstone: g.tombstone
                }))
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
      }
    },
    {
      index: 2,
      name: 'categories',
      label: 'Categories',
      newRecords: categoriesData ? categoriesData.categories.length : 0,
      oldRecords: categories.length + 2,
      loading: loading.categories,
      success: successCategories,
      prevSuccess: successGroups,
      onClick: async () => {
        setLoading({ ...loading, categories: true });
        await categories.reduce(async (prev, next) => {
          const newPrev = await prev;
          try {
            await createCategoriesMutation({
              variables: {
                categories: [next].map(c => ({
                  name: c.name,
                  groupName: groups.find(g => g.id === c.cat_group).name,
                  tombstone: c.tombstone
                }))
              }
            });
          } catch (ex) {
            console.log(ex);
            newPrev.push(ex);
          }

          return newPrev;
        }, []);
        await createTransferMutation({
          variables: {
            categories: [
              { name: 'Transfer In', tombstone: 0 },
              { name: 'Transfer Out', tombstone: 0 }
            ].map(c => ({
              name: c.name,
              groupName: 'تحويلات',
              tombstone: c.tombstone
            }))
          }
        });
        setLoading({ ...loading, categories: false });
      }
    },
    {
      index: 3,
      name: 'payees',
      label: 'Payees',
      newRecords: payeesData ? payeesData.payees.length : 0,
      oldRecords: payees.length,
      loading: loading.payees,
      success: successPayees,
      prevSuccess: successCategories,
      onClick: async () => {
        setLoading({ ...loading, payees: true });
        payees.reduce(async (prev, next, index) => {
          const newPrev = await prev;
          try {
            await createPayeesMutation({
              variables: {
                payees: [next].map(p => {
                  const transferAccount = accounts.find(
                    a => a.id === p.transfer_acct
                  );
                  return transferAccount
                    ? {
                        name: transferAccount.name,
                        accountName: transferAccount.name,
                        tombstone: transferAccount.tombstone
                      }
                    : { name: p.name, tombstone: p.tombstone };
                })
              }
            });
          } catch (ex) {
            console.log(ex);
            newPrev.push(ex);
          }
          if (index === payees.length - 1) {
            setLoading({ ...loading, payees: false });
          }
          return newPrev;
        }, []);
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
        const errors = await transactions.reduce(async (prev, next, index) => {
          if (existingTransactions?.includes(next?.id)) {
            return prev;
          }
          const newPrev = await prev;
          try {
            await migrateTransactionsMutation({
              variables: {
                transactions: [next].map(t => ({
                  id: t.id,
                  amount: t.actualAmount,
                  notes: t.notes,
                  date: dateNumToString(t.date, 'DMY'),
                  accountName: t.account.name,
                  categoryName: t.categoryObj.name,
                  groupName: t.group.name,
                  payeeName: t.payee.name || t.transferAccount.name,
                  tombstone: t.tombstone
                }))
              }
            });
          } catch (ex) {
            console.log(ex);
            newPrev.push({ error: ex, id: next?.id, transaction: next });
          }
          return newPrev;
        }, []);
        setLoading({ ...loading, transactions: false });
        console.log(errors);
      }
    }
  ];
  return { steps, loading: queriesLoading };
};

export default useMigrationSteps;
