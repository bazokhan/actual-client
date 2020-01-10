/* eslint-disable no-param-reassign */
export default (payees, accounts) =>
  payees
    .filter(payee => !payee.tombstone)
    .filter(payee => payee)
    .map(p => {
      p.transferAccount =
        accounts
          .filter(account => account)
          .find(a => !p.name && a.id === p.transfer_acct) || {};
      p.type = p.transferAccount.id ? 'Account' : 'Entity';
      return p;
    });
