import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n, v2sum } from 'helpers/mathHelpers';
import styles from './TransactionFooter.module.scss';

const TransactionFooter = ({ filters, transactions }) => {
  return (
    <div className={styles.row}>
      <div className={styles.midCell}>Total</div>
      {!filters.account && <div className={styles.midCell} />}
      <div className={styles.normCell} />
      <div className={styles.bigCell} />
      <div className={styles.midCell} />
      <div className={styles.midCell} />
      {(filters.type === 'Payment' || !filters.type) && (
        <div className={cx(styles.midCell, styles.right)}>
          {n(v2sum(transactions.filter(t => t.amount < 0)) * -1)}
        </div>
      )}
      {(filters.type === 'Deposit' || !filters.type) && (
        <div className={cx(styles.midCell, styles.right)}>
          {n(v2sum(transactions.filter(t => t.amount >= 0)))}
        </div>
      )}
    </div>
  );
};

TransactionFooter.propTypes = {
  filters: PropTypes.object.isRequired,
  transactions: PropTypes.array.isRequired
};

export default TransactionFooter;
