/* eslint-disable no-param-reassign */
export default (payees, accounts) =>
  payees
    .filter(payee => !payee.tombstone)
    .map(p => {
      p.transferAccount =
        accounts.find(a => !p.name && a.id === p.transfer_acct) || {};
      p.type = p.transferAccount.id ? 'Account' : 'Entity';
      return p;
    });
