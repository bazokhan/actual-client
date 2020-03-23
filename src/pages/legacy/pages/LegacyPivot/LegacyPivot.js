/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useMemo, useEffect } from 'react';
import cx from 'classnames';
import { DataContext } from 'App/context';
import Header from 'components/Header';
import { n } from 'helpers/mathHelpers';
import { dateNumToString } from 'helpers/dateHelpers';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import mapSort from 'mapsort';
import {
  sortStringsAscending,
  sortStringsDescending,
  sortNumsAscending,
  sortNumsDescending
} from 'helpers/sortHelpers';
import { Link } from 'react-router-dom';
import styles from './LegacyPivot.module.scss';

const LegacyPivot = () => {
  const {
    transactionsByCategory,
    totalPayment,
    totalDeposit,
    totalTransactions
  } = useContext(DataContext);

  const [sortedCategories, setSortedCategories] = useState(
    transactionsByCategory
  );

  useEffect(() => {
    setSortedCategories(transactionsByCategory);
  }, [transactionsByCategory]);

  const sortBy = useMemo(
    () => (arrayMapFunc, sortFunc) =>
      setSortedCategories(mapSort(sortedCategories, arrayMapFunc, sortFunc)),
    [sortedCategories]
  );

  const [isAscending, setIsAscending] = useState(false);
  const toggleSortMode = () => setIsAscending(!isAscending);
  return (
    <>
      <div className={styles.header}>
        <Header />
        <div className={styles.row}>
          <div className={cx(styles.cell, styles.tiny)}>
            <p>#</p>
          </div>

          <button
            type="button"
            onClick={() => {
              sortBy(
                c => c.name,
                isAscending ? sortStringsAscending : sortStringsDescending
              );
              toggleSortMode();
            }}
            className={cx(styles.cell, styles.mid)}
          >
            <p>Category</p>
            {isAscending ? <FaAngleUp /> : <FaAngleDown />}
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

          <button
            type="button"
            onClick={() => {
              sortBy(
                c => (c.amountType === 'Payment' ? c.amount : null),
                isAscending ? sortNumsAscending : sortNumsDescending
              );
              toggleSortMode();
            }}
            className={cx(styles.cell, styles.mid)}
          >
            <p>Payment</p>
            {isAscending ? <FaAngleUp /> : <FaAngleDown />}
          </button>

          <button
            type="button"
            onClick={() => {
              sortBy(
                c => (c.amountType === 'Deposit' ? c.amount : null),
                isAscending ? sortNumsAscending : sortNumsDescending
              );
              toggleSortMode();
            }}
            className={cx(styles.cell, styles.mid)}
          >
            <p>Deposit</p>
            {isAscending ? <FaAngleUp /> : <FaAngleDown />}
          </button>

          <button
            type="button"
            onClick={() => {
              sortBy(
                c => c.transactions.length,
                isAscending ? sortNumsAscending : sortNumsDescending
              );
              toggleSortMode();
            }}
            className={cx(styles.cell, styles.small)}
          >
            <p>T</p>
            {isAscending ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </div>
      </div>
      <div className={styles.body}>
        {sortedCategories &&
          sortedCategories.map((category, index) => (
            <div key={category.name} className={styles.row}>
              <div className={cx(styles.cell, styles.tiny)}>{index + 1}</div>
              <div className={cx(styles.cell, styles.mid)}>{category.name}</div>
              <div className={cx(styles.cell, styles.norm)}>
                {category.duration
                  .map(d => dateNumToString(d, 'DMY'))
                  .join(' : ')}
              </div>
              <div className={cx(styles.cell, styles.norm)}>
                {category.accounts.join()}
              </div>
              <div className={cx(styles.cell, styles.big)}>
                {category.payees.join()}
              </div>
              <div className={cx(styles.cell, styles.mid)}>
                {category.amountType === 'Payment'
                  ? n(category.amount * -1)
                  : null}
              </div>
              <div className={cx(styles.cell, styles.mid)}>
                {category.amountType === 'Deposit' ? n(category.amount) : null}
              </div>
              <Link
                to={`/pivot/${category.id}`}
                className={cx(styles.cell, styles.small)}
              >
                {category.transactions.length}
              </Link>
            </div>
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

export default LegacyPivot;
