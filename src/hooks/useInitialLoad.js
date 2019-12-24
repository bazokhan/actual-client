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

const formatContentRange = contentRange => {
  const range = contentRange.split(' ')[1];
  const startToEnd = contentRange.split('/');
  const [startIndex, endIndex] = startToEnd.split('-');
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
    a.get(dbRoutes.accounts)
      .then(res => setAccounts(res.data))
      .catch(e => {
        console.log(e);
        setAccounts([]);
      });
    a.get(dbRoutes.categories)
      .then(res => setCategories(res.data))
      .catch(e => {
        console.log(e);
        setCategories([]);
      });
    a.get(dbRoutes.categoryGroups)
      .then(res => setCategoryGroups(res.data))
      .catch(e => {
        console.log(e);
        setCategoryGroups([]);
      });
    a.get(dbRoutes.categoryMapping)
      .then(res => setCategoryMapping(res.data))
      .catch(e => {
        console.log(e);
        setCategoryMapping([]);
      });
    a.get(dbRoutes.payees)
      .then(res => setPayees(res.data))
      .catch(e => {
        console.log(e);
        setPayees([]);
      });
    a.get(dbRoutes.payeeMapping)
      .then(res => setPayeeMapping(res.data))
      .catch(e => {
        console.log(e);
        setPayeeMapping([]);
      });
    a.get(dbRoutes.transactions, {
      headers: {
        range: 'rows=0-',
        order: 'date asc'
      }
    })
      .then(res => {
        console.log(res.headers['content-range']);
        setTransactions([...transactions, ...res.data]);
      })
      .catch(e => {
        console.log(e);
      });
    // a.get(dbRoutes.transactions, {
    //   headers: {
    //     range: 'rows=700-',
    //     order: 'date desc'
    //   }
    // })
    //   .then(res => {
    //     setTransactions([...transactions, ...res.data]);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }, []);

  useEffect(() => {
    if (
      accounts.length &&
      categories.length &&
      categoryGroups.length &&
      payees.length &&
      transactions.length
    ) {
      setLoading(false);
    }
  }, [accounts, categories, categoryGroups, payees, transactions]);

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
