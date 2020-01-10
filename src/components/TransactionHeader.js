import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import {
  sortNumsAscending,
  sortNumsDescending,
  sortStringsAscending,
  sortStringsDescending
} from 'helpers/sortHelpers';
import styles from './TransactionHeader.module.scss';

const TransactionsHeader = ({
  sortBy,
  isAscending,
  activeAccount,
  toggleSortMode,
  activeType
}) => {
  return (
    <div className={styles.row}>
      <button
        type="button"
        onClick={() => {
          sortBy(
            t => t.date,
            isAscending ? sortNumsAscending : sortNumsDescending
          );
          toggleSortMode();
        }}
        className={styles.midCell}
      >
        <p>Date</p>
        {isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      {!activeAccount && (
        <button
          type="button"
          onClick={() => {
            sortBy(
              t => t.account.name,
              isAscending ? sortStringsAscending : sortStringsDescending
            );
            toggleSortMode();
          }}
          className={styles.midCell}
        >
          <p>Account</p>
          {isAscending ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          sortBy(
            t => t.payee.name,
            isAscending ? sortStringsAscending : sortStringsDescending
          );
          toggleSortMode();
        }}
        className={styles.normCell}
      >
        <p>Payee</p>
        {isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <button
        type="button"
        onClick={() => {
          sortBy(
            t => t.notes,
            isAscending ? sortStringsAscending : sortStringsDescending
          );
          toggleSortMode();
        }}
        className={styles.bigCell}
      >
        <p>Notes</p>
        {isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <button
        type="button"
        onClick={() => {
          sortBy(
            t => t.categoryObj.name,
            isAscending ? sortStringsAscending : sortStringsDescending
          );
          toggleSortMode();
        }}
        className={styles.midCell}
      >
        <p>Category</p>
        {isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      {/* <button
        type="button"
        onClick={() => {
          sortBy(
            t => t.catGroup.name,
            isAscending ? sortStringsAscending : sortStringsDescending
          );
          toggleSortMode();
        }}
        className={styles.midCell}
      >
        <p>Type</p>
        {isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button> */}
      {(activeType === 'Payment' || activeType === '') && (
        <button
          type="button"
          onClick={() => {
            sortBy(
              t => (t.amountType === 'Payment' ? t.actualAmount : null),
              isAscending ? sortNumsAscending : sortNumsDescending
            );
            toggleSortMode();
          }}
          className={styles.midCell}
        >
          <p>Payment</p>
          {isAscending ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      )}
      {(activeType === 'Deposit' || activeType === '') && (
        <button
          type="button"
          onClick={() => {
            sortBy(
              t => (t.amountType === 'Deposit' ? t.actualAmount : null),
              isAscending ? sortNumsAscending : sortNumsDescending
            );
            toggleSortMode();
          }}
          className={styles.midCell}
        >
          <p>Deposit</p>
          {isAscending ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      )}
      {/* <button type="button" onClick={() => {}} className={styles.bigCell}>
        <p>Description</p>
        {isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button> */}
    </div>
  );
};

TransactionsHeader.propTypes = {
  sortBy: PropTypes.func.isRequired,
  isAscending: PropTypes.bool.isRequired,
  activeAccount: PropTypes.string,
  toggleSortMode: PropTypes.func,
  activeType: PropTypes.string
};

TransactionsHeader.defaultProps = {
  activeAccount: null,
  activeType: '',
  toggleSortMode: () => {}
};

export default TransactionsHeader;
