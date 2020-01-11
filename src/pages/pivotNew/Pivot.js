/* eslint-disable no-nested-ternary */
import React, { useMemo, useState, useEffect } from 'react';
import cx from 'classnames';
import Header from 'components/Header';
import { n } from 'helpers/mathHelpers';
import { useQuery } from '@apollo/react-hooks';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import styles from './Pivot.module.scss';
import categoriesGql from './gql/categories.gql';
import Category from './components/Category';

const Pivot = () => {
  const [collapseAll, setCollapseAll] = useState(true);
  const { data, error } = useQuery(categoriesGql);

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

  const [transactions, setTransactions] = useState(categoriesTransactions);

  useEffect(() => {
    setTransactions(categoriesTransactions);
  }, [categoriesTransactions]);

  const handleCategoryFilter = category => {
    setTransactions([
      ...transactions.filter(c => c.id !== category.id),
      category
    ]);
  };

  const totalPayment = useMemo(
    () =>
      transactions.reduce((prev, category) => {
        const balance = category.transactions.reduce(
          (sum, t) => sum + t.amount,
          0
        );
        return balance < 0 ? prev + balance : prev;
      }, 0),
    [transactions]
  );

  const totalDeposit = useMemo(
    () =>
      transactions.reduce((prev, category) => {
        const balance = category.transactions.reduce(
          (sum, t) => sum + t.amount,
          0
        );
        return balance >= 0 ? prev + balance : prev;
      }, 0),
    [transactions]
  );

  const totalTransactions = useMemo(
    () =>
      transactions.reduce(
        (prev, category) => prev + category.transactions.length,
        0
      ),
    [transactions]
  );

  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading</div>;

  return (
    <>
      <div className={styles.header}>
        <Header />
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
        {categoriesTransactions &&
          categoriesTransactions.map((category, index) => (
            <Category
              key={category.id}
              category={category}
              index={index}
              collapseAll={collapseAll}
              handleCategoryFilter={handleCategoryFilter}
            />
          ))}
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
