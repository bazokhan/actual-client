export default (transactions, sortState) => {
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
