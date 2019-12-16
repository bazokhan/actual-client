import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from '../App.module.scss';
import { n, sum } from '../../helpers/mathHelpers';

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
        <div className={cx(styles.midCell, styles.right)}>
          {n(
            sum(activeTransactions.filter(t => t.amountType === 'Payment')) * -1
          )}
        </div>
      )}
      {(activeType === 'Deposit' || activeType === '') && (
        <div className={cx(styles.midCell, styles.right)}>
          {n(sum(activeTransactions.filter(t => t.amountType === 'Deposit')))}
        </div>
      )}
    </div>
  );
};

TransactionFooter.propTypes = {
  activeAccount: PropTypes.string.isRequired,
  activeType: PropTypes.string.isRequired,
  activeTransactions: PropTypes.array.isRequired
};

export default TransactionFooter;
