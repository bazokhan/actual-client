/* eslint-disable no-param-reassign */
export default (transactions, accounts, categories, categoryGroups, payees) => {
  return transactions
    .filter(
      transaction =>
        !transaction.starting_balance_flag && !transaction.tombstone
    )
    .map(t => {
      const ds = t.date.toString();
      t.categoryObj = categories.find(cat => cat.id === t.category) || {};
      t.account = accounts.find(account => account.id === t.acct) || {};
      t.catGroup =
        categoryGroups.find(
          group =>
            group.id ===
            (categories.find(cat => cat.id === t.category) || {}).cat_group
        ) || {};
      t.dateString = `${ds.slice(6, 8)}/${ds.slice(4, 6)}/${ds.slice(0, 4)}`;
      t.amountType = t.amount > 0 ? 'Deposit' : 'Payment';
      t.actualAmount = t.amount / 100;
      t.payee = payees.find(payee => payee.id === t.description) || {};
      return t;
    });
};
