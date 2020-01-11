/* eslint-disable import/prefer-default-export */
import React from 'react';

const DataContext = React.createContext({
  accounts: [],
  categories: [],
  categoryGroups: [],
  payees: [],
  transactions: [],
  activeTransactions: [],
  allAccountsAmounts: {},
  activeAccount: '',
  activeAccountAmount: [],
  activeType: '',
  activeCategory: '',
  activePayee: '',
  dateFilter: [],
  setActiveAccount: () => {},
  setDateFilter: () => {},
  setActiveType: () => {},
  setActiveCategory: () => {},
  setActivePayee: () => {},
  setSearchString: () => {},
  setActiveTransactions: () => {},
  activeAccountName: 'all accounts',
  searchString: '',
  sortBy: () => {},
  totalBalance: 0,
  deadTransactions: [],
  transactionsByCategory: [],
  totalPayment: 0,
  totalDeposit: 0,
  totalTransactions: 0,
  authToken: null
});

export { DataContext };
