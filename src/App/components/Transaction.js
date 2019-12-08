import React from 'react';
import PropTypes from 'prop-types';
import styles from '../App.module.scss';

const Transaction = ({
  transaction: {
    id,
    account,
    actualAmount,
    category,
    catGroup,
    description,
    dateString,
    notes,
    amountType
  }
}) => {
  return (
    <div key={id} className={styles.row}>
      <div className={styles.midCell}>{dateString}</div>
      <div className={styles.midCell}>{account.name}</div>
      <div className={styles.midCell}>???</div>
      <div className={styles.bigCell}>{notes}</div>
      <div className={styles.midCell}>{category.name}</div>
      <div className={styles.midCell}>{catGroup.name}</div>
      <div className={styles.midCell}>
        {amountType === 'Payment' && actualAmount
          ? (actualAmount * -1).toString()
          : null}
      </div>
      <div className={styles.midCell}>
        {amountType === 'Deposit' && actualAmount
          ? actualAmount.toString()
          : null}
      </div>
      <div className={styles.bigCell}>{description}</div>
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired
};

export default Transaction;
