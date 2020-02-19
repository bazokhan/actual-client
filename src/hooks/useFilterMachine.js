import { useState, useEffect } from 'react';
import mapSort from 'mapsort';
import { numerizeDate } from 'helpers/dateHelpers';
import FILTERS from 'App/constants/Filters';
import SORTERS from 'App/constants/Sorters';
import * as sorters from 'helpers/sortHelpers';

const sortFunctions = {
  [SORTERS.NUM_ASC]: sorters.sortNumsAscending,
  [SORTERS.NUM_DES]: sorters.sortNumsDescending,
  [SORTERS.STR_ASC]: sorters.sortStringsAscending,
  [SORTERS.STR_DES]: sorters.sortStringsDescending
};

const useFilterMachine = transactions => {
  const [filteredTransactions, setFilteredTransactions] = useState(
    transactions
  );

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const [filterValues, setFilterValues] = useState({
    account: null,
    after: null,
    before: null,
    type: null,
    category: null,
    payee: null,
    search: null
  });

  const unfilteredState = {
    sort: [
      t => (t.date && typeof t.date === 'string' ? numerizeDate(t.date) : t),
      sorters.sortNumsDescending
    ],
    account: t => t,
    after: t => t,
    before: t => t,
    type: t => t,
    category: t => t,
    payee: t => t,
    search: t => t
  };

  const [filterFunctions, setFilterFunctions] = useState(unfilteredState);

  const reset = () => setFilterFunctions(unfilteredState);

  useEffect(() => {
    setFilteredTransactions(
      Object.entries(filterFunctions).reduce((prev, [name, filter]) => {
        if (name === FILTERS.SORT && filter && filter.length === 2) {
          return mapSort(prev, filter[0], filter[1]);
        }
        if (filter && typeof filter === 'function') {
          return prev.filter(filter);
        }
        return prev;
      }, transactions)
    );
  }, [filterFunctions, transactions]);

  const sortBy = (sortName, arrayMapFunc) => {
    setFilterFunctions({
      ...filterFunctions,
      sort: [arrayMapFunc, sortFunctions[sortName]]
    });
  };

  const filterBy = (filterName, filterFunction, filterValue) => {
    if (filterValue !== undefined) {
      setFilterValues({ ...filterValues, [filterName]: filterValue });
    }
    setFilterFunctions({ ...filterFunctions, [filterName]: filterFunction });
  };

  return { filteredTransactions, sortBy, filterBy, filterValues, reset };
};

export default useFilterMachine;
