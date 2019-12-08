import axios from 'axios';
import { useState, useEffect } from 'react';

const server = 'http://localhost:8085/';
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

const useInitialLoad = () => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState([]);
  const [payees, setPayees] = useState([]);
  const [payeeMapping, setPayeeMapping] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    a.get(dbRoutes.accounts).then(res => setAccounts(res.data));
    a.get(dbRoutes.categories).then(res => setCategories(res.data));
    a.get(dbRoutes.categoryGroups).then(res => setCategoryGroups(res.data));
    a.get(dbRoutes.categoryMapping).then(res => setCategoryMapping(res.data));
    a.get(dbRoutes.payees).then(res => setPayees(res.data));
    a.get(dbRoutes.payeeMapping).then(res => setPayeeMapping(res.data));
    a.get(dbRoutes.transactions).then(res => setTransactions(res.data));
    // assigning headers: {
    //   headers: {
    //     range: 'rows=0-200'
    //   }
    // }
  }, []);

  useEffect(() => {
    if (
      accounts.length &&
      categories.length &&
      categoryGroups.length &&
      categoryMapping.length &&
      payees.length &&
      payeeMapping.length &&
      transactions.length
    ) {
      setLoading(false);
    }
  }, [
    accounts,
    categories,
    categoryGroups,
    categoryMapping,
    payees,
    payeeMapping,
    transactions
  ]);

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
