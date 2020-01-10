import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import {
  sortNumsAscending,
  sortNumsDescending,
  sortStringsAscending,
  sortStringsDescending
} from 'helpers/sortHelpers';
import { numerizeDate } from 'helpers/dateHelpers';
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

const TransactionsHeader = ({ sortBy, account, activeType }) => {
  return (
    <div className={styles.row}>
      <SortButton
        text="Date"
        className={styles.midCell}
        sortBy={order => {
          sortBy(
            t => numerizeDate(t.date),
            order ? sortNumsAscending : sortNumsDescending
          );
        }}
      />
      {!account && (
        <SortButton
          text="Account"
          className={styles.midCell}
          sortBy={order => {
            sortBy(
              t => t.account.name,
              order ? sortStringsAscending : sortStringsDescending
            );
          }}
        />
      )}
      <SortButton
        text="Payee"
        className={styles.normCell}
        sortBy={order => {
          sortBy(
            t => t.payee.name,
            order ? sortStringsAscending : sortStringsDescending
          );
        }}
      />
      <SortButton
        text="Notes"
        className={styles.bigCell}
        sortBy={order => {
          sortBy(
            t => t.notes,
            order ? sortStringsAscending : sortStringsDescending
          );
        }}
      />
      <SortButton
        text="Category"
        className={styles.midCell}
        sortBy={order => {
          sortBy(
            t => t.category.name,
            order ? sortStringsAscending : sortStringsDescending
          );
        }}
      />
      {(activeType === 'Payment' || !activeType) && (
        <SortButton
          text="Payment"
          className={styles.midCell}
          sortBy={order => {
            sortBy(
              t => (t.amount < 0 ? t.amount : null),
              order ? sortNumsAscending : sortNumsDescending
            );
          }}
        />
      )}
      {(activeType === 'Deposit' || !activeType) && (
        <SortButton
          text="Deposit"
          className={styles.midCell}
          sortBy={order => {
            sortBy(
              t => (t.amount >= 0 ? t.amount : null),
              order ? sortNumsAscending : sortNumsDescending
            );
          }}
        />
      )}
    </div>
  );
};

TransactionsHeader.propTypes = {
  sortBy: PropTypes.func.isRequired,
  account: PropTypes.object,
  activeType: PropTypes.string
};

TransactionsHeader.defaultProps = {
  account: null,
  activeType: ''
};

export default TransactionsHeader;
