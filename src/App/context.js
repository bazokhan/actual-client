/* eslint-disable import/prefer-default-export */
import React from 'react';

const DataContext = React.createContext({
  activeTransactions: [],
  activeAccountAmount: [],
  activeAccountName: 'all accounts',
  deadTransactions: [],
  transactionsByCategory: [],
  totalPayment: 0,
  totalDeposit: 0,
  totalTransactions: 0,
  authToken: null
});

export { DataContext };
