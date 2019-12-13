import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import styles from '../App.module.scss';

const TransactionsHeader = ({ sortState, setSortState, activeAccount }) => {
  const sort = prop => {
    setSortState({
      prop,
      isAscending: !sortState.isAscending
    });
  };

  return (
    <div className={styles.row}>
      <button
        type="button"
        onClick={() => sort('date')}
        className={styles.midCell}
      >
        <p>Date</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      {!activeAccount && (
        <button
          type="button"
          onClick={() => sort('account')}
          className={styles.midCell}
        >
          <p>Account</p>
          {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      )}
      <button type="button" onClick={() => {}} className={styles.normCell}>
        <p>Payee</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <button type="button" onClick={() => {}} className={styles.bigCell}>
        <p>Notes</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <button
        type="button"
        onClick={() => sort('categoryObj')}
        className={styles.midCell}
      >
        <p>Category</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <button
        type="button"
        onClick={() => sort('catGroup')}
        className={styles.midCell}
      >
        <p>Type</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <button
        type="button"
        onClick={() => sort('amount')}
        className={styles.midCell}
      >
        <p>Payment</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <button
        type="button"
        onClick={() => sort('amount')}
        className={styles.midCell}
      >
        <p>Deposit</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      {/* <button type="button" onClick={() => {}} className={styles.bigCell}>
        <p>Description</p>
        {sortState.isAscending ? <FaAngleUp /> : <FaAngleDown />}
      </button> */}
    </div>
  );
};

TransactionsHeader.propTypes = {
  sortState: PropTypes.object.isRequired,
  setSortState: PropTypes.func.isRequired,
  activeAccount: PropTypes.string
};

TransactionsHeader.defaultProps = {
  activeAccount: null
};

export default TransactionsHeader;
