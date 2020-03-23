/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
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
  const unfilteredTransactions = useMemo(
    () =>
      transactions.map(t => ({
        ...t,
        month:
          typeof t.date === 'string'
            ? `${t.date?.split('-')?.[1]}/${t.date?.split('-')?.[2]}`
            : typeof t.date === 'number'
            ? `${Math.floor(t.date / 10000)}/${Math.floor(t.date / 100)
                .toString()
                .slice(4)}`
            : ''
      })) || [],
    [transactions]
  );

  const [filteredTransactions, setFilteredTransactions] = useState(
    unfilteredTransactions
  );

  const unfilteredLists = useMemo(
    () => ({
      months: unfilteredTransactions?.reduce(
        (prev, t) => (prev.includes(t.month) ? prev : [...prev, t.month]),
        []
      ),
      accounts: unfilteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.account?.id) ? prev : [...prev, t.account?.id],
        []
      ),
      categories: unfilteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.category?.id) ? prev : [...prev, t.category?.id],
        []
      ),
      payees: unfilteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.payee?.id) ? prev : [...prev, t.payee?.id],
        []
      ),
      groups: unfilteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.category?.group?.id)
            ? prev
            : [...prev, t.category?.group?.id],
        []
      )
    }),
    [unfilteredTransactions]
  );

  const filteredLists = useMemo(
    () => ({
      months: filteredTransactions?.reduce(
        (prev, t) => (prev.includes(t.month) ? prev : [...prev, t.month]),
        []
      ),
      accounts: filteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.account?.id) ? prev : [...prev, t.account?.id],
        []
      ),
      categories: filteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.category?.id) ? prev : [...prev, t.category?.id],
        []
      ),
      payees: filteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.payee?.id) ? prev : [...prev, t.payee?.id],
        []
      ),
      groups: filteredTransactions?.reduce(
        (prev, t) =>
          prev.includes(t.category?.group?.id)
            ? prev
            : [...prev, t.category?.group?.id],
        []
      )
    }),
    [filteredTransactions]
  );

  const { payment, deposit, net } = useMemo(() => {
    return filteredTransactions?.reduce(
      (prev, t) =>
        t.amount < 0
          ? {
              ...prev,
              payment: prev.payment + t.amount,
              net: prev.net + t.amount
            }
          : {
              ...prev,
              deposit: prev.deposit + t.amount,
              net: prev.net + t.amount
            },
      { payment: 0, deposit: 0, net: 0 }
    );
  }, [filteredTransactions]);

  const unfilteredState = useMemo(
    () => ({
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
      search: t => t,
      month: t => t,
      categories: t => t
    }),
    [unfilteredLists]
  );

  const [filterValues, setFilterValues] = useState({
    account: null,
    after: null,
    before: null,
    type: null,
    category: null,
    payee: null,
    search: null,
    month: null,
    categories: unfilteredLists?.categories
  });

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
      }, unfilteredTransactions)
    );
  }, [filterFunctions, unfilteredTransactions]);

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

  return {
    unfilteredTransactions,
    filteredTransactions,
    sortBy,
    filterBy,
    filterValues,
    reset,
    unfilteredLists,
    filteredLists,
    payment,
    deposit,
    net
  };
};

export default useFilterMachine;
