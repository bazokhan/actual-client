/* eslint-disable no-console */
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import accountsGql from 'gql/accounts.gql';
import groupsGql from 'gql/groups.gql';
import categoriesGql from 'gql/categories.gql';
import payeesGql from 'gql/payees.gql';
import transactionsGql from 'gql/transactions.gql';
import createAccountsGql from './gql/createAccounts.gql';
import createCatGroupsGql from './gql/createCatGroups.gql';
import createCategoriesGql from './gql/createCategories.gql';
import createPayeesGql from './gql/createPayees.gql';
import createTransactionsGql from './gql/createTransactions.gql';
import { dateNumToString } from '../../helpers/dateHelpers';
import useMigrationData from '../../hooks/useMigrationData';

const Migrate = () => {
  const {
    accounts,
    categoryGroups,
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
  const [success, setSuccess] = useState({
    accounts: false,
    categoryGroups: false,
    categories: false,
    payees: false,
    transactions: false,
    transfer: false
  });
  const [createAccountsMutation] = useMutation(createAccountsGql, {
    onCompleted: data => {
      if (
        data &&
        data.createAccounts &&
        data.createAccounts.length === accounts.length
      ) {
        setSuccess({ ...success, accounts: true });
      }
    }
  });

  const [createCatGroupsMutation] = useMutation(createCatGroupsGql, {
    onCompleted: data => {
      if (
        data &&
        data.createCatGroups &&
        data.createCatGroups.length === categoryGroups.length
      ) {
        setSuccess({ ...success, categoryGroups: true });
      }
    }
  });

  const [createCategoriesMutation] = useMutation(createCategoriesGql, {
    onCompleted: data => {
      if (
        data &&
        data.createCategories &&
        data.createCategories.length === categories.length
      ) {
        setSuccess({ ...success, categories: true });
      }
    }
  });

  const [createTransferMutation] = useMutation(createCategoriesGql, {
    onCompleted: data => {
      if (data && data.createCategories && data.createCategories.length === 2) {
        setSuccess({ ...success, transfer: true });
      }
    }
  });

  const [createPayeesMutation] = useMutation(createPayeesGql, {
    onCompleted: data => {
      if (
        data &&
        data.createPayees &&
        data.createPayees.length === payees.length
      ) {
        setSuccess({ ...success, payees: true });
      }
    }
  });

  const [createTransactionsMutation] = useMutation(createTransactionsGql, {
    onCompleted: data => {
      if (
        data &&
        data.createTransactions &&
        data.createTransactions.length === transactions.length
      ) {
        setSuccess({ ...success, transactions: true });
      }
    }
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

  if (
    accountsLoading ||
    groupsLoading ||
    categoriesLoading ||
    payeesLoading ||
    transactionsLoading
  ) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      {/* {categories.map(group => (
        <p>
          {group.name}: {group.is_income}
        </p>
      ))} */}
      <p>Accounts: {accounts.length}</p>
      <p>
        Migrated {accountsData.accounts.length} of {accounts.length}
      </p>
      <button
        type="button"
        disabled={loading.accounts || success.accounts}
        onClick={async () => {
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
        }}
      >
        {success.accounts
          ? 'Accounts successfully created'
          : 'Create All Accounts'}
      </button>
      <p>Category Groups: {categoryGroups.length}</p>
      <p>
        Migrated {groupsData.catGroups.length} of {categoryGroups.length}
      </p>
      <button
        type="button"
        disabled={loading.categoryGroups || success.categoryGroups}
        onClick={async () => {
          setLoading({ ...loading, categoryGroups: true });
          try {
            await createCatGroupsMutation({
              variables: {
                groups: categoryGroups.map(g => ({
                  name: g.name,
                  isIncome: g.is_income > 0
                }))
              }
            });
          } catch (ex) {
            console.log(ex);
          }
          setLoading({ ...loading, categoryGroups: false });
        }}
      >
        {success.categoryGroups
          ? 'Groups successfully created'
          : 'Create All Groups'}
      </button>
      <p>Categories: {categories.length}</p>
      <p>
        Migrated {categoriesData.categories.length} of {categories.length}
      </p>
      <button
        type="button"
        disabled={loading.categories || success.categories}
        onClick={async () => {
          setLoading({ ...loading, categories: true });
          try {
            await createCategoriesMutation({
              variables: {
                categories: categories.map(c => ({
                  name: c.name,
                  groupName: categoryGroups.find(g => g.id === c.cat_group).name
                }))
              }
            });
          } catch (ex) {
            console.log(ex);
          }
          setLoading({ ...loading, categories: false });
        }}
      >
        {success.categories
          ? 'Categories successfully created'
          : 'Create All Categories'}
      </button>
      <p>Transfer Categories: 2</p>
      <button
        type="button"
        disabled={loading.transfer || success.transfer}
        onClick={async () => {
          setLoading({ ...loading, transfer: true });
          try {
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
          setLoading({ ...loading, transfer: false });
        }}
      >
        {success.transfer
          ? 'Transfer Categories successfully created'
          : 'Create Transfer Categories'}
      </button>
      <p>Payees: {payees.length}</p>
      <p>
        Migrated {payeesData.payees.length} of {payees.length}
      </p>
      <button
        type="button"
        disabled={loading.payees || success.payees}
        onClick={async () => {
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
        }}
      >
        {success.payees ? 'Payees successfully created' : 'Create All Payees'}
      </button>
      <p>Transactions: {transactions.length}</p>
      <p>
        Migrated {transactionsData.transactions.length} of {transactions.length}
      </p>
      <button
        type="button"
        disabled={loading.transactions || success.transactions}
        onClick={async () => {
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
        }}
      >
        {success.transactions
          ? 'Transactions successfully created'
          : 'Create All Transactions'}
      </button>
    </div>
  );
};

export default Migrate;
