/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import styles from '../App.module.scss';
import { dateStringFromIsoString } from '../../helpers/dateHelpers';

const n = num => numeral(num).format('0,0.00');

const Transaction = ({ transaction, activeAccount }) => {
  const {
    id,
    account,
    actualAmount,
    categoryObj,
    catGroup,
    payee,
    transferAccount,
    dateString,
    notes,
    amountType
  } = transaction;

  const isTransfer = useMemo(() => transferAccount.id, [transaction]);

  return (
    <div key={id} className={styles.row}>
      <div className={styles.midCell}>
        {dateStringFromIsoString(dateString, 'DMY')}
      </div>
      {!activeAccount && <div className={styles.midCell}>{account.name}</div>}
      <div className={styles.normCell}>
        {isTransfer ? transferAccount.name : payee.name}
      </div>
      <div className={styles.bigCell}>{notes}</div>
      <div className={styles.midCell}>{categoryObj.name}</div>
      <div className={styles.midCell}>{isTransfer ? 'n/a' : catGroup.name}</div>
      <div className={cx(styles.midCell, styles.right)}>
        {amountType === 'Payment' && actualAmount ? n(actualAmount * -1) : null}
      </div>
      <div className={cx(styles.midCell, styles.right)}>
        {amountType === 'Deposit' && actualAmount ? n(actualAmount) : null}
      </div>
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
