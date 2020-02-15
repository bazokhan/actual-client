import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { numerizeDate } from 'helpers/dateHelpers';
import styles from './TransactionHeader.module.scss';
import SORTERS from '../../../../App/constants/Sorters';

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
      <p>{text}</p>
      {isAscending ? <FaAngleUp /> : <FaAngleDown />}
    </button>
  );
};

SortButton.propTypes = {
  sortBy: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const TransactionsHeader = ({ sortBy, filters }) => {
  return (
    <div className={styles.row}>
      <div style={{ width: '30px' }} />
      <SortButton
        text="Date"
        className={styles.midCell}
        sortBy={order => {
          sortBy(order ? SORTERS.NUM_ASC : SORTERS.NUM_DES, t =>
            numerizeDate(t.date)
          );
        }}
      />
      {!filters.account && (
        <SortButton
          text="Account"
          className={styles.midCell}
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
        className={styles.normCell}
        sortBy={order => {
          sortBy(order ? SORTERS.STR_ASC : SORTERS.STR_DES, t => t.payee.name);
        }}
      />
      <SortButton
        text="Notes"
        className={styles.bigCell}
        sortBy={order => {
          sortBy(order ? SORTERS.STR_ASC : SORTERS.STR_DES, t => t.notes);
        }}
      />
      <SortButton
        text="Category"
        className={styles.midCell}
        sortBy={order => {
          sortBy(
            order ? SORTERS.STR_ASC : SORTERS.STR_DES,
            t => t.category.name
          );
        }}
      />
      {(filters.type === 'Payment' || !filters.type) && (
        <SortButton
          text="Payment"
          className={styles.midCell}
          sortBy={order => {
            sortBy(order ? SORTERS.NUM_ASC : SORTERS.NUM_DES, t =>
              t.amount < 0 ? t.amount : null
            );
          }}
        />
      )}
      {(filters.type === 'Deposit' || !filters.type) && (
        <SortButton
          text="Deposit"
          className={styles.midCell}
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
  filters: PropTypes.object.isRequired
};

export default TransactionsHeader;
