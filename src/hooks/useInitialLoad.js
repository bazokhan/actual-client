import { useState, useEffect, useCallback } from 'react';

const server = process.env.REACT_APP_SERVER_URL;

const a = {
  get: async query => {
    const res = await fetch(server + query).then(r => r.json());
    return res;
  }
};

const dbRoutes = {
  accounts: 'accounts',
  categories: 'categories',
  groups: 'category_groups',
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
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState([]);
  const [payees, setPayees] = useState([]);
  const [payeeMapping, setPayeeMapping] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [after, setAfter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsRes = await a.get(dbRoutes.accounts);
        const categoriesRes = await a.get(dbRoutes.categories);
        const groupsRes = await a.get(dbRoutes.groups);
        const categoryMappingRes = await a.get(dbRoutes.categoryMapping);
        const payeesRes = await a.get(dbRoutes.payees);
        const payeeMappingRes = await a.get(dbRoutes.payeeMapping);
        const initialTransactionsRes = await a.get(dbRoutes.transactions);
        if (
          accountsRes &&
          categoriesRes &&
          groupsRes &&
          categoryMappingRes &&
          payeesRes &&
          payeeMappingRes &&
          initialTransactionsRes
        ) {
          setAccounts(accountsRes?.resources || []);
          setCategories(categoriesRes?.resources || []);
          setGroups(groupsRes?.resources || []);
          setCategoryMapping(categoryMappingRes?.resources || []);
          setPayees(payeesRes?.resources || []);
          setPayeeMapping(payeeMappingRes?.resources || []);
          setTransactions(initialTransactionsRes?.resources || []);
          const contentRange =
            initialTransactionsRes.headers?.['content-range'];
          if (contentRange) {
            setAfter(getAfter(contentRange));
          }
          setLoading(false);
        }
      } catch (ex) {
        console.log(ex);
        setAccounts([]);
        setCategories([]);
        setGroups([]);
        setCategoryMapping([]);
        setPayees([]);
        setPayeeMapping([]);
        setTransactions([]);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchMoreTransactions = useCallback(
    async transactionsAfter => {
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
    },
    [transactions]
  );

  useEffect(() => {
    if (after) {
      fetchMoreTransactions(Number(after));
    }
  }, [after, fetchMoreTransactions]);

  return {
    loading,
    accounts,
    categories,
    groups,
    categoryMapping,
    payees,
    payeeMapping,
    transactions
  };
};

export default useInitialLoad;
