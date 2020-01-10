import numeral from 'numeral';

const sum = transactions =>
  transactions
    .map(t => t.actualAmount)
    .reduce((acc, amount) => acc + amount, 0);

const v2sum = transactions =>
  transactions.map(t => t.amount).reduce((prev, next) => prev + next, 0);

const n = num => numeral(num).format('0,0.00');

export { sum, n, v2sum };
