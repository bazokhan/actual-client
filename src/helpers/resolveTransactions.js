import {
  transferGroupId,
  transferinId,
  transferoutId
} from 'App/constants/Ids';
import { dateNumToString } from './dateHelpers';

/* eslint-disable no-param-reassign */
export default (transactions, accounts, categories, groups, payees) =>
  transactions && accounts
    ? transactions.map(t => {
        t.categoryObj = categories.find(cat => cat.id === t.category) || {};
        t.account = accounts.find(account => account.id === t.acct) || {};
        t.group =
          groups.find(
            group =>
              group.id ===
              (categories.find(cat => cat.id === t.category) || {}).cat_group
          ) || {};
        t.dateString = dateNumToString(t.date);
        t.amountType = t.amount > 0 ? 'Deposit' : 'Payment';
        t.actualAmount = t.amount / 100;
        t.payee = payees.find(payee => payee.id === t.description) || {};
        t.transferAccount =
          accounts.find(a => a.id === t.payee.transfer_acct) || {};
        if (
          t.transferAccount.id &&
          t.amountType === 'Deposit' &&
          !t.categoryObj.id
        ) {
          t.categoryObj = {
            id: transferinId,
            type: 'in',
            name: 'Transfer In'
          };
          t.group = { id: transferGroupId, name: 'تحويلات' };
        }
        if (
          t.transferAccount.id &&
          t.amountType === 'Payment' &&
          !t.categoryObj.id
        ) {
          t.categoryObj = {
            id: transferoutId,
            type: 'out',
            name: 'Transfer Out'
          };
          t.group = { id: transferGroupId, name: 'تحويلات' };
        }
        t.searchString = [
          t.dateString,
          t.payee.name || t.transferAccount.name || '',
          t.notes || '',
          t.categoryObj.name,
          t.group.name,
          (t.actualAmount && t.actualAmount.toString()) || ''
        ].join('');
        return t;
      })
    : [];
