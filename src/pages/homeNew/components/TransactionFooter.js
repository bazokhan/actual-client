import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n, v2sum } from 'helpers/mathHelpers';
import styles from './TransactionFooter.module.scss';

const TransactionFooter = ({ account, activeType, transactions }) => {
  return (
    <div className={styles.row}>
      <div className={styles.midCell}>Total</div>
      {!account && <div className={styles.midCell} />}
      <div className={styles.normCell} />
      <div className={styles.bigCell} />
      <div className={styles.midCell} />
      <div className={styles.midCell} />
      {(activeType === 'Payment' || !activeType) && (
        <div className={cx(styles.midCell, styles.right)}>
          {n(v2sum(transactions.filter(t => t.amount < 0)) * -1)}
        </div>
      )}
      {(activeType === 'Deposit' || !activeType) && (
        <div className={cx(styles.midCell, styles.right)}>
          {n(v2sum(transactions.filter(t => t.amount >= 0)))}
        </div>
      )}
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
