/* eslint-disable no-console */
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
import createCatGroupsGql from '../gql/createCatGroups.gql';
import createCategoriesGql from '../gql/createCategories.gql';
import createPayeesGql from '../gql/createPayees.gql';
import createTransactionsGql from '../gql/createTransactions.gql';

const useMigrationSteps = () => {
  const {
    accounts,
    categoryGroups: groups,
    categories,
    payees,
    transactions
  } = useMigrationData();

  const [loading, setLoading] = useState({
    accounts: false,
    categoryGroups: false,
    categories: false,
    payees: false,
    transactions: false,
    transfer: false
  });

  const [createAccountsMutation] = useMutation(createAccountsGql, {
    refetchQueries: [{ query: accountsGql }],
    awaitRefetchQueries: true
  });

  const [createCatGroupsMutation] = useMutation(createCatGroupsGql, {
    refetchQueries: [{ query: groupsGql }],
    awaitRefetchQueries: true
  });

  const [createCategoriesMutation] = useMutation(createCategoriesGql, {
    refetchQueries: [{ query: categoriesGql }],
    awaitRefetchQueries: true
  });

  const [createTransferMutation] = useMutation(createCategoriesGql, {
    refetchQueries: [{ query: categoriesGql }],
    awaitRefetchQueries: true
  });

  const [createPayeesMutation] = useMutation(createPayeesGql, {
    refetchQueries: [{ query: payeesGql }],
    awaitRefetchQueries: true
  });

  const [createTransactionsMutation] = useMutation(createTransactionsGql, {
    refetchQueries: [{ query: transactionsGql }],
    awaitRefetchQueries: true
  });

  const { data: accountsData, loading: accountsLoading } = useQuery(
    accountsGql,
    {
      fetchPolicy: 'cache-and-network'
    }
  );
  const { data: groupsData, loading: groupsLoading } = useQuery(groupsGql, {
    fetchPolicy: 'cache-and-network'
  });
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    categoriesGql,
    {
      fetchPolicy: 'cache-and-network'
    }
  );
  const { data: payeesData, loading: payeesLoading } = useQuery(payeesGql, {
    fetchPolicy: 'cache-and-network'
  });
  const { data: transactionsData, loading: transactionsLoading } = useQuery(
    transactionsGql,
    {
      fetchPolicy: 'cache-and-network'
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
      groupsData.catGroups &&
      groupsData.catGroups.length >= groups.length,
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

  const steps = [
    {
      index: 0,
      name: 'accounts',
      label: 'Accounts',
      newRecords: accountsData ? accountsData.accounts.length : 0,
      oldRecords: accounts.length,
      loading: loading.accounts,
      success: successAccounts,
      prevSuccess: true,
      onClick: async () => {
        setLoading({ ...loading, accounts: true });
        try {
          await createAccountsMutation({
            variables: {
              accounts: accounts.map(a => ({
                name: a.name,
                userId: '88feacf0-2ffb-11ea-977a-51bad9170054'
              }))
            }
          });
        } catch (ex) {
          console.log(ex);
        }
        setLoading({ ...loading, accounts: false });
      }
    },
    {
      index: 1,
      name: 'groups',
      label: 'Groups',
      newRecords: groupsData ? groupsData.catGroups.length : 0,
      oldRecords: groups.length,
      loading: loading.categoryGroups,
      success: successGroups,
      prevSuccess: successAccounts,
      onClick: async () => {
        setLoading({ ...loading, categoryGroups: true });
        try {
          await createCatGroupsMutation({
            variables: {
              groups: groups.map(g => ({
                name: g.name,
                isIncome: g.is_income > 0
              }))
            }
          });
        } catch (ex) {
          console.log(ex);
        }
        setLoading({ ...loading, categoryGroups: false });
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
        try {
          await createCategoriesMutation({
            variables: {
              categories: categories.map(c => ({
                name: c.name,
                groupName: groups.find(g => g.id === c.cat_group).name
              }))
            }
          });
          await createTransferMutation({
            variables: {
              categories: [
                { name: 'Transfer In' },
                { name: 'Transfer Out' }
              ].map(c => ({
                name: c.name,
                groupName: 'تحويلات'
              }))
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
      oldRecords: payees.length,
      loading: loading.payees,
      success: successPayees,
      prevSuccess: successCategories,
      onClick: async () => {
        setLoading({ ...loading, payees: true });
        try {
          await createPayeesMutation({
            variables: {
              payees: payees.map(p => {
                const transferAccount = accounts.find(
                  a => a.id === p.transfer_acct
                );
                return transferAccount
                  ? {
                      name: transferAccount.name,
                      accountName: transferAccount.name
                    }
                  : { name: p.name };
              })
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
        try {
          await createTransactionsMutation({
            variables: {
              transactions: transactions.map(t => ({
                amount: t.actualAmount,
                notes: t.notes,
                date: dateNumToString(t.date, 'DMY'),
                accountName: t.account.name,
                categoryName: t.categoryObj.name,
                categoryGroupName: t.catGroup.name,
                payeeName: t.payee.name || t.transferAccount.name
              }))
            }
          });
        } catch (ex) {
          console.log(ex);
        }
        setLoading({ ...loading, transactions: false });
      }
    }
  ];
  return { steps, loading: queriesLoading };
};

export default useMigrationSteps;
