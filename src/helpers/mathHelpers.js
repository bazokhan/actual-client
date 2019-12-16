import numeral from 'numeral';

const sum = transactions =>
  transactions
    .map(t => t.actualAmount)
    .reduce((acc, amount) => acc + amount, 0);

const n = num => numeral(num).format('0,0.00');

export { sum, n };
