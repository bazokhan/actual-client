/* eslint-disable no-param-reassign */
export default (transactions, accounts) => {
  if (!accounts) return {};
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
