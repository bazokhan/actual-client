/* eslint-disable no-console */
import axios from 'axios';
import { useState, useEffect } from 'react';

const server = process.env.REACT_APP_SERVER_URL;

const a = {
  get: (query, config) => {
    if (config) return axios.get(server + query, config);
    return axios.get(server + query);
  }
};

const dbRoutes = {
  accounts: 'accounts',
  categories: 'categories',
  categoryGroups: 'category_groups',
  categoryMapping: 'category_mapping',
  payees: 'payees',
  payeeMapping: 'payee_mapping',
  transactions: 'transactions'
};

const getAfter = contentRange => {
  const range = contentRange.split(' ')[1];
  const [startToEnd, total] = range.split('/');
  const [, currentEnd] = startToEnd.split('-');
  if (Number(currentEnd) < Number(total)) {
    return currentEnd;
  }
  return null;
};

const useInitialLoad = () => {
  const [accounts, setAccounts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryGroups, setCategoryGroups] = useState(null);
  const [categoryMapping, setCategoryMapping] = useState(null);
  const [payees, setPayees] = useState(null);
  const [payeeMapping, setPayeeMapping] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [after, setAfter] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const accountsRes = await a.get(dbRoutes.accounts);
      const categoriesRes = await a.get(dbRoutes.categories);
      const categoryGroupsRes = await a.get(dbRoutes.categoryGroups);
      const categoryMappingRes = await a.get(dbRoutes.categoryMapping);
      const payeesRes = await a.get(dbRoutes.payees);
      const payeeMappingRes = await a.get(dbRoutes.payeeMapping);
      const initialTransactionsRes = await a.get(dbRoutes.transactions, {
        headers: {
          range: 'rows=0-',
          order: 'date asc'
        }
      });
      if (
        accountsRes &&
        categoriesRes &&
        categoryGroupsRes &&
        categoryMappingRes &&
        payeesRes &&
        payeeMappingRes &&
        initialTransactionsRes
      ) {
        setAccounts(accountsRes.data ? accountsRes.data : []);
        setCategories(categoriesRes.data ? categoriesRes.data : []);
        setCategoryGroups(categoryGroupsRes.data ? categoryGroupsRes.data : []);
        setCategoryMapping(
          categoryMappingRes.data ? categoryMappingRes.data : []
        );
        setPayees(payeesRes.data ? payeesRes.data : []);
        setPayeeMapping(payeeMappingRes.data ? payeeMappingRes.data : []);
        setTransactions(
          initialTransactionsRes.data ? initialTransactionsRes.data : []
        );
        const contentRange = initialTransactionsRes.headers['content-range'];
        if (contentRange) {
          setAfter(getAfter(contentRange));
        }
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fetchMoreTransactions = async transactionsAfter => {
    const transactionRes = await a.get(dbRoutes.transactions, {
      headers: {
        range: `rows=${transactionsAfter + 1}-${transactionsAfter + 1000}`,
        order: 'date asc'
      }
    });
    if (transactionRes) {
      try {
        const contentRange = transactionRes.headers['content-range'];
        if (contentRange) {
          setAfter(getAfter(contentRange));
        }
      } catch (ex) {
        console.log(ex);
      }
      const updateTransactions = [transactions, transactionRes.data].flat();
      setTransactions(updateTransactions);
    }
  };

  useEffect(() => {
    if (after) {
      fetchMoreTransactions(Number(after));
    }
  }, [after]);

  // useEffect(() => {
  //   if (!loading) {
  //     const notSameTarget = payeeMapping.filter(
  //       payee => payee.id !== payee.targetId
  //     );
  //     console.log(
  //       payees.filter(payee => notSameTarget.map(p => p.id).includes(payee.id))
  //     );
  //     console.log(
  //       accounts.filter(acc =>
  //         notSameTarget.map(p => p.targetId).includes(acc.id)
  //       )
  //     );
  //     console.log(
  //       categories.filter(acc =>
  //         notSameTarget.map(p => p.targetId).includes(acc.id)
  //       )
  //     );
  //     console.log(
  //       categoryGroups.filter(acc =>
  //         notSameTarget.map(p => p.targetId).includes(acc.id)
  //       )
  //     );
  //     console.log(
  //       payees.filter(acc =>
  //         notSameTarget.map(p => p.targetId).includes(acc.id)
  //       )
  //     );
  //     console.log(
  //       transactions.filter(acc =>
  //         notSameTarget.map(p => p.targetId).includes(acc.id)
  //       )
  //     );
  //   }
  // }, [loading]);

  return {
    loading,
    accounts,
    categories,
    categoryGroups,
    categoryMapping,
    payees,
    payeeMapping,
    transactions
  };
};

export default useInitialLoad;
