/* eslint-disable no-nested-ternary */
import React, { useMemo, useState, useCallback } from 'react';
import cx from 'classnames';
import { n } from 'helpers/mathHelpers';
import { useQuery } from '@apollo/react-hooks';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Header from './components/Header';
import styles from './Pivot.module.scss';
import categoriesGql from './gql/categories.gql';
import Category from './components/Category';

const Pivot = () => {
  const [activeAccount, setActiveAccount] = useState(null);
  const [collapseAll, setCollapseAll] = useState(true);
  const [categoryToFilterBy, setFilter] = useState(null);

  const { data, error } = useQuery(categoriesGql, {
    fetchPolicy: 'cache-and-network'
  });

  const categoriesTransactions = useMemo(
    () =>
      data && data.categories
        ? data.categories.filter(c => c.transactions && c.transactions.length)
        : [],
    [data]
  );

  const loading = useMemo(() => !categoriesTransactions && !data, [
    categoriesTransactions,
    data
  ]);

  const transactions = useMemo(() => {
    return categoriesTransactions
      .map(category =>
        activeAccount
          ? {
              ...category,
              transactions: category.transactions.filter(
                t => t.account.id === activeAccount.id
              )
            }
          : category
      )
      .filter(c => (categoryToFilterBy ? c.id !== categoryToFilterBy.id : c));
  }, [activeAccount, categoriesTransactions, categoryToFilterBy]);

  const handleCategoryFilter = useCallback(
    category => {
      setFilter(category);
    },
    [setFilter]
  );

  const totalPayment = useMemo(
    () =>
      transactions.reduce((prev, category) => {
        const balance = category
          ? category.transactions.reduce((sum, t) => sum + t.amount, 0)
          : 0;
        return balance < 0 ? prev + balance : prev;
      }, 0),
    [transactions]
  );

  const totalDeposit = useMemo(
    () =>
      transactions.reduce((prev, category) => {
        const balance = category
          ? category.transactions.reduce((sum, t) => sum + t.amount, 0)
          : 0;
        return balance >= 0 ? prev + balance : prev;
      }, 0),
    [transactions]
  );

  const totalTransactions = useMemo(
    () =>
      transactions.reduce(
        (prev, category) =>
          category ? prev + category.transactions.length : prev,
        0
      ),
    [transactions]
  );

  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading</div>;

  return (
    <>
      <div className={styles.header}>
        <Header
          account={activeAccount}
          setActiveAccount={setActiveAccount}
          totalTransactions={totalTransactions}
        />
        <div className={styles.row}>
          <button
            type="button"
            onClick={() => setCollapseAll(!collapseAll)}
            className={cx(styles.cell, styles.tiny)}
          >
            {collapseAll ? <FaAngleDown /> : <FaAngleUp />}
          </button>

          <button type="button" className={cx(styles.cell, styles.mid)}>
            <p>Category</p>
          </button>

          <div className={cx(styles.cell, styles.norm)}>
            <p>From - to</p>
          </div>
          <div className={cx(styles.cell, styles.norm)}>
            <p>Accounts</p>
          </div>
          <div className={cx(styles.cell, styles.big)}>
            <p>Payees</p>
          </div>

          <button type="button" className={cx(styles.cell, styles.mid)}>
            <p>Payment</p>
          </button>

          <button type="button" className={cx(styles.cell, styles.mid)}>
            <p>Deposit</p>
          </button>

          <button type="button" className={cx(styles.cell, styles.small)}>
            <p>T</p>
          </button>
        </div>
      </div>
      <div className={styles.body}>
        {transactions &&
          transactions.map(
            (category, index) =>
              category && (
                <Category
                  key={category ? category.id : index}
                  category={category}
                  index={index}
                  collapseAll={collapseAll}
                  handleCategoryFilter={handleCategoryFilter}
                />
              )
          )}
      </div>
      <div className={styles.footer}>
        <div className={styles.row}>
          <div className={cx(styles.cell, styles.tiny)} />
          <div className={cx(styles.cell, styles.mid)} />
          <div className={cx(styles.cell, styles.norm)} />
          <div className={cx(styles.cell, styles.norm)} />
          <div className={cx(styles.cell, styles.big)} />
          <div className={cx(styles.cell, styles.mid)}>
            {n(totalPayment * -1 || 0)}
          </div>
          <div className={cx(styles.cell, styles.mid)}>
            {n(totalDeposit || 0)}
          </div>
          <div className={cx(styles.cell, styles.small)}>
            {totalTransactions}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pivot;
