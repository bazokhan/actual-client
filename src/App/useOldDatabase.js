/* eslint-disable no-nested-ternary */
import { useMemo, useState, useEffect } from 'react';
import useMigrationData from 'hooks/useMigrationData';
import { sortAmountsByAccount } from 'helpers';

const useOldDatabase = () => {
  const authToken = localStorage.getItem('auth_token');

  const {
    loading,
    accounts,
    categories,
    transactions,
    deadTransactions
  } = useMigrationData();

  const [activeTransactions, setActiveTransactions] = useState([]);
  const [activeAccount] = useState('');
  const [dateFilter] = useState([]);
  const [activeType] = useState('');
  const [activeCategory] = useState('');
  const [activePayee] = useState('');
  const [searchString] = useState('');

  useEffect(() => {
    setActiveTransactions(
      transactions
        .filter(t => (activeAccount ? t.account.id === activeAccount : t))
        .filter(t =>
          dateFilter.length === 2
            ? dateFilter[0] <= t.date && t.date <= dateFilter[1]
            : t
        )
        .filter(t => (activeType ? t.amountType === activeType : t))
        .filter(t => (activeCategory ? t.categoryObj.id === activeCategory : t))
        .filter(t => (activePayee ? t.payee.id === activePayee : t))
        .filter(t => t.searchString.includes(searchString))
    );
  }, [
    activeAccount,
    transactions,
    dateFilter,
    activeType,
    activeCategory,
    activePayee,
    searchString
  ]);

  const activeAccountAmount = useMemo(
    () =>
      sortAmountsByAccount(transactions, accounts)[activeAccount] ||
      transactions.map(t => t.actualAmount),
    [transactions, activeAccount, accounts]
  );

  const activeAccountName = useMemo(
    () =>
      activeAccount
        ? accounts.find(account => account.id === activeAccount).name
        : 'all accounts',
    [activeAccount, accounts]
  );

  const transactionsByCategory = useMemo(
    () =>
      [
        ...categories,
        { id: 'transfer', type: 'in' },
        { id: 'transfer', type: 'out' }
      ]
        .map(category =>
          activeTransactions.filter(
            t =>
              t.categoryObj.id === category.id &&
              t.categoryObj.type === category.type
          )
        )
        .filter(category => category.length)
        .map(category => ({
          id: category.length
            ? category.find(t => t.categoryObj).categoryObj.id
            : 'NotFound',
          name: category.length
            ? category.find(t => t.categoryObj).categoryObj.name
            : 'No name',
          amount: category.reduce((sum, t) => sum + t.actualAmount, 0),
          accounts: category.reduce(
            (all, t) =>
              all.includes(t.account.name) ? all : [...all, t.account.name],
            []
          ),
          payees: category.reduce(
            (all, t) =>
              all.includes(t.payee.name || t.transferAccount.name)
                ? all
                : [
                    ...all,
                    t.payee.name
                      ? t.payee.name
                      : t.transferAccount.name
                      ? t.transferAccount.name
                      : null
                  ],
            []
          ),
          duration: category.reduce(
            (startEnd, t) => [
              Math.min(startEnd[0], t.date),
              Math.max(startEnd[1], t.date)
            ],
            [100000000, 0]
          ),
          transactions: category
        }))
        .map(category =>
          category.amount >= 0
            ? { ...category, amountType: 'Deposit' }
            : { ...category, amountType: 'Payment' }
        ),
    [categories, activeTransactions]
  );

  const totalPayment = useMemo(
    () =>
      transactionsByCategory.reduce(
        (sum, category) =>
          category.amountType === 'Payment' ? sum + category.amount : sum,
        0
      ),
    [transactionsByCategory]
  );

  const totalDeposit = useMemo(
    () =>
      transactionsByCategory.reduce(
        (sum, category) =>
          category.amountType === 'Deposit' ? sum + category.amount : sum,
        0
      ),
    [transactionsByCategory]
  );

  const totalTransactions = useMemo(
    () =>
      transactionsByCategory.reduce(
        (sum, category) => sum + category.transactions.length,
        0
      ),
    [transactionsByCategory]
  );

  const DataContextValue = useMemo(
    () => ({
      activeTransactions,
      activeAccountAmount,
      activeAccountName,
      deadTransactions,
      transactionsByCategory,
      totalPayment,
      totalDeposit,
      totalTransactions,
      authToken
    }),
    [
      activeTransactions,
      activeAccountAmount,
      activeAccountName,
      deadTransactions,
      transactionsByCategory,
      totalPayment,
      totalDeposit,
      totalTransactions,
      authToken
    ]
  );
  return { loading, DataContextValue };
};

export default useOldDatabase;
