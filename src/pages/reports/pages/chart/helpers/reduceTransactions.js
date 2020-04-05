import * as moment from 'moment';

const reduceTransactions = (prev, next) => {
  const dateString = moment(`${next.date}`, 'YYYYMMDD').format('MM/DD/YYYY');
  if (!dateString) {
    return prev;
  }
  const targetSeries = prev.find(
    series => series.name === next.category.group.name
  );
  if (targetSeries) {
    const targetDate = targetSeries.data.find(
      transaction => transaction.x === dateString
    );

    if (targetDate) {
      targetDate.y += next.amount;
      return prev;
    }

    targetSeries.data.push({ x: dateString, y: next.amount });
    return prev;
  }
  prev.push({
    name: next.category.group.name,
    data: [{ x: dateString, y: next.amount }]
  });
  return prev;
};

const accumulateTransactions = (prev, next) => {
  if (!next?.date) return prev;
  const dateString = moment(`${next.date}`, 'YYYYMMDD').format('MM/DD/YYYY');
  if (!dateString) {
    return prev;
  }
  const targetSeries = prev.find(
    series => series.name === next.category.group.name
  );
  if (targetSeries) {
    const targetDate = targetSeries.data.find(
      transaction => transaction.x === dateString
    );

    if (targetDate) {
      targetDate.y += next.amount;
      return prev;
    }

    const accumulated = targetSeries.data[targetSeries.data.length - 1] || {
      y: 0
    };

    targetSeries.data.push({
      x: dateString,
      y: next.amount + accumulated.y
    });
    return prev;
  }
  prev.push({
    name: next.category.group.name,
    data: [{ x: dateString, y: next.amount }]
  });
  return prev;
};

export { reduceTransactions, accumulateTransactions };
