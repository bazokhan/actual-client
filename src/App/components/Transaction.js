import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import styles from '../App.module.scss';

const n = num => numeral(num).format('0,0.00');

const Transaction = ({ transaction, activeAccount }) => {
  // console.log(transaction.categoryId);
  // if (transaction.financial_id) console.log(transaction.financial_id);
  // if (transaction.imported_description)
  //   console.log(transaction.imported_description);
  // if (transaction.isChild) console.log(transaction.isChild);
  // if (transaction.isParent) console.log(transaction.isParent);
  // if (transaction.location) console.log(transaction.location);
  // if (transaction.starting_balance_flag)
  //   console.log(transaction.starting_balance_flag);
  // if (transaction.tombstone) console.log(transaction.tombstone);
  // if (transaction.type) console.log(transaction.type);
  const {
    id,
    account,
    actualAmount,
    // category,
    categoryObj,
    catGroup,
    payee,
    // description,
    dateString,
    notes,
    amountType
  } = transaction;
  return (
    <div key={id} className={styles.row}>
      <div className={styles.midCell}>{dateString}</div>
      {!activeAccount && <div className={styles.midCell}>{account.name}</div>}
      <div className={styles.normCell}>{payee.name}</div>
      <div className={styles.bigCell}>{notes}</div>
      <div className={styles.midCell}>{categoryObj.name}</div>
      <div className={styles.midCell}>{catGroup.name}</div>
      <div className={cx(styles.midCell, styles.right)}>
        {amountType === 'Payment' && actualAmount ? n(actualAmount * -1) : null}
      </div>
      <div className={cx(styles.midCell, styles.right)}>
        {amountType === 'Deposit' && actualAmount ? n(actualAmount) : null}
      </div>
      {/* <div className={styles.bigCell}>{description}</div> */}
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  activeAccount: PropTypes.string
};

Transaction.defaultProps = {
  activeAccount: null
};

export default Transaction;
