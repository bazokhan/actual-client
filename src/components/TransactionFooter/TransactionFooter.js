import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n, sum } from 'helpers/mathHelpers';
import styles from './TransactionFooter.module.scss';

const TransactionFooter = ({
  activeAccount,
  activeTransactions,
  activeType
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.midCell}>Total</div>
      {!activeAccount && <div className={styles.midCell} />}
      <div className={styles.normCell} />
      <div className={styles.bigCell} />
      <div className={styles.midCell} />
      <div className={styles.midCell} />
      {(activeType === 'Payment' || activeType === '') && (
        <div className={cx(styles.midCell, styles.right, styles.payment)}>
          {n(
            sum(activeTransactions.filter(t => t.amountType === 'Payment')) * -1
          )}
        </div>
      )}
      {(activeType === 'Deposit' || activeType === '') && (
        <div className={cx(styles.midCell, styles.right, styles.deposit)}>
          {n(sum(activeTransactions.filter(t => t.amountType === 'Deposit')))}
        </div>
      )}
    </div>
  );
};

TransactionFooter.propTypes = {
  activeAccount: PropTypes.string,
  activeType: PropTypes.string,
  activeTransactions: PropTypes.array.isRequired
};

TransactionFooter.defaultProps = {
  activeAccount: null,
  activeType: ''
};

export default TransactionFooter;
