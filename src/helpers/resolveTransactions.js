/* eslint-disable no-param-reassign */
const resolveTransactions = (
  transactions,
  accounts,
  categories,
  categoryGroups
) => {
  return transactions.map(t => {
    const ds = t.date.toString();
    t.account = accounts.find(account => account.id === t.acct) || {};
    t.category = categories.find(cat => cat.id === t.category) || {};
    t.catGroup =
      categoryGroups.find(group => group.id === t.category.cat_group) || {};
    t.dateString = `${ds.slice(6, 8)}/${ds.slice(4, 6)}/${ds.slice(0, 4)}`;
    t.amountType = t.amount > 0 ? 'Deposit' : 'Payment';
    t.actualAmount = t.amount / 100;
    return t;
  });
};

const sortAmountsByAccount = (transactions, accounts) => {
  const sorted = accounts.reduce((hash, account) => {
    const accountId = account.id;
    if (!hash[accountId]) hash[accountId] = [];
    hash[accountId] = transactions
      .filter(transaction => transaction.account.id === accountId)
      .map(acc => acc.actualAmount);
    return hash;
  }, {});
  return sorted;
};

const sortTransactions = (transactions, sortState) => {
  if (
    sortState.prop === 'account' ||
    sortState.prop === 'category' ||
    sortState.prop === 'catGroup'
  ) {
    if (sortState.isAscending) {
      return [...transactions].sort(
        (a, b) => a[sortState.prop].name - b[sortState.prop].name
      );
    }
    return [...transactions]
      .sort((a, b) => a[sortState.prop].name - b[sortState.prop].name)
      .reverse();
  }
  if (sortState.prop === 'amount' || sortState.prop === 'date') {
    if (sortState.isAscending) {
      return [...transactions].sort(
        (a, b) => a[sortState.prop] - b[sortState.prop]
      );
    }
    return [...transactions].sort(
      (a, b) => a[sortState.prop] + b[sortState.prop]
    );
  }
  return transactions;
};

export { resolveTransactions, sortAmountsByAccount, sortTransactions };
