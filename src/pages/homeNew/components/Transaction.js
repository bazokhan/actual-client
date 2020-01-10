import React, { useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import styles from './Transaction.module.scss';

const Transaction = ({ transaction, account, activeType }) => {
  const {
    id,
    amount,
    notes,
    date,
    account: { name: accountName },
    category: { name: categoryName },
    payee: { name: payeeName }
  } = transaction;

  const amountType = useMemo(() => (amount >= 0 ? 'Deposit' : 'Payment'), [
    amount
  ]);

  return (
    <div key={id} className={styles.row}>
      <div className={styles.midCell}>{date}</div>
      {!account && <div className={styles.midCell}>{accountName}</div>}
      <div className={styles.normCell}>{payeeName}</div>
      <div className={styles.bigCell}>{notes}</div>
      <div className={styles.midCell}>{categoryName}</div>
      {(activeType === 'Payment' || !activeType) && (
        <div className={cx(styles.midCell, styles.right)}>
          {amountType === 'Payment' && amount ? n(amount * -1) : null}
        </div>
      )}
      {(activeType === 'Deposit' || !activeType) && (
        <div className={cx(styles.midCell, styles.right)}>
          {amountType === 'Deposit' && amount ? n(amount) : null}
        </div>
      )}
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  account: PropTypes.object,
  activeType: PropTypes.string
};

Transaction.defaultProps = {
  account: null,
  activeType: ''
};

export default Transaction;
