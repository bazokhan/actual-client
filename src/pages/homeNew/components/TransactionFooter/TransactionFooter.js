import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n, v2sum } from 'helpers/mathHelpers';
import styles from './TransactionFooter.module.scss';

const TransactionFooter = ({ account, activeType, transactions }) => {
  return (
    <div className={styles.row}>
      {/* <div className={styles.midCell} />
      {!filters.account && <div className={styles.midCell} />}
      <div className={styles.normCell} />
      <div className={styles.bigCell} />
      <div className={styles.midCell} /> */}
      {(filters.type === 'Payment' || !filters.type) && (
        <div className={cx(styles.midCell, styles.payment)}>
          Total payments:&nbsp;&nbsp;&nbsp;
          {n(v2sum(transactions.filter(t => t.amount < 0)) * -1)}
        </div>
      )}
      {(filters.type === 'Deposit' || !filters.type) && (
        <div className={cx(styles.midCell, styles.deposit)}>
          Total deposits:&nbsp;&nbsp;&nbsp;
          {n(v2sum(transactions.filter(t => t.amount >= 0)))}
        </div>
      )}
      <div
        className={cx(
          styles.midCell,
          v2sum(transactions) < 0 ? styles.paymentTag : styles.depositTag
        )}
      >
        Net:&nbsp;&nbsp;&nbsp;
        {n(v2sum(transactions))}
      </div>
    </div>
  );
};

TransactionFooter.propTypes = {
  account: PropTypes.object,
  activeType: PropTypes.string,
  transactions: PropTypes.array.isRequired
};

TransactionFooter.defaultProps = {
  account: null,
  activeType: ''
};

export default TransactionFooter;
