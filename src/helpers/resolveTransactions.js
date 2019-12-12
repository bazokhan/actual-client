/* eslint-disable no-param-reassign */
const resolveTransactions = (
  transactions,
  accounts,
  categories,
  categoryGroups,
  payees
) => {
  // console.log(transactions);
  return transactions
    .filter(
      transaction =>
        !transaction.starting_balance_flag && !transaction.tombstone
    )
    .map(t => {
      const ds = t.date.toString();
      t.categoryObj = categories.find(cat => cat.id === t.category) || {};
      // console.log(t);
      t.account = accounts.find(account => account.id === t.acct) || {};
      // t.category = categories.find(cat => cat.id === t.category) || {};
      t.catGroup =
        categoryGroups.find(
          group =>
            group.id ===
            (categories.find(cat => cat.id === t.category) || {}).cat_group
        ) || {};
      t.dateString = `${ds.slice(6, 8)}/${ds.slice(4, 6)}/${ds.slice(0, 4)}`;
      t.amountType = t.amount > 0 ? 'Deposit' : 'Payment';
      t.actualAmount = t.amount / 100;
      // console.log(t);
      t.payee = payees.find(payee => payee.id === t.description) || {};
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
    sortState.prop === 'categoryObj' ||
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
