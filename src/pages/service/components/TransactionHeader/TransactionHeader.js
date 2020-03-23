import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import SORTERS from 'App/constants/Sorters';
import styles from './TransactionHeader.module.scss';

const SortButton = ({ sortBy, className, text }) => {
  const [isAscending, setIsAscending] = useState(true);
  return (
    <button
      type="button"
      onClick={() => {
        sortBy(isAscending);
        setIsAscending(!isAscending);
      }}
      className={className}
    >
      <p>{text}</p>&nbsp;&nbsp;&nbsp;&nbsp;
      {isAscending ? <FaAngleUp /> : <FaAngleDown />}
    </button>
  );
};

SortButton.propTypes = {
  sortBy: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const TransactionsHeader = ({ sortBy, filterValues }) => {
  return (
    <div className={styles.row}>
      <div style={{ width: '30px' }} />
      <SortButton
        text="Date"
        className={cx(styles.cell, styles.midCell)}
        sortBy={order => {
          sortBy(order ? SORTERS.NUM_ASC : SORTERS.NUM_DES, t => t.date);
        }}
      />
      {!filterValues?.account && (
        <SortButton
          text="Account"
          className={cx(styles.cell, styles.midCell)}
          sortBy={order => {
            sortBy(
              order ? SORTERS.STR_ASC : SORTERS.STR_DES,
              t => t.account.name
            );
          }}
        />
      )}
      <SortButton
        text="Payee"
        className={cx(styles.cell, styles.normCell)}
        sortBy={order => {
          sortBy(order ? SORTERS.STR_ASC : SORTERS.STR_DES, t => t.payee.name);
        }}
      />
      <SortButton
        text="Category"
        className={cx(styles.cell, styles.midCell)}
        sortBy={order => {
          sortBy(
            order ? SORTERS.STR_ASC : SORTERS.STR_DES,
            t => t.category.name
          );
        }}
      />

      <SortButton
        text="Notes"
        className={cx(styles.cell, styles.bigCell)}
        sortBy={order => {
          sortBy(order ? SORTERS.STR_ASC : SORTERS.STR_DES, t => t.notes);
        }}
      />

      {(filterValues?.type === 'Payment' || !filterValues?.type) && (
        <SortButton
          text="Payment"
          className={cx(styles.cell, styles.midCell)}
          sortBy={order => {
            sortBy(order ? SORTERS.NUM_ASC : SORTERS.NUM_DES, t =>
              t.amount < 0 ? t.amount : null
            );
          }}
        />
      )}
      {(filterValues?.type === 'Deposit' || !filterValues?.type) && (
        <SortButton
          text="Deposit"
          className={cx(styles.cell, styles.midCell)}
          sortBy={order => {
            sortBy(order ? SORTERS.NUM_ASC : SORTERS.NUM_DES, t =>
              t.amount >= 0 ? t.amount : null
            );
          }}
        />
      )}
    </div>
  );
};

TransactionsHeader.propTypes = {
  sortBy: PropTypes.func.isRequired,
  filterValues: PropTypes.object.isRequired
};

export default TransactionsHeader;
