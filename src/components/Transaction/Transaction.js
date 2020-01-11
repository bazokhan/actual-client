/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { dateStringFromIsoString } from 'helpers/dateHelpers';
import { n } from 'helpers/mathHelpers';
import styles from './Transaction.module.scss';

const Transaction = ({ transaction, activeAccount, activeType }) => {
  const {
    id,
    account,
    actualAmount,
    categoryObj,
    // catGroup,
    payee,
    transferAccount,
    dateString,
    notes,
    amountType
  } = transaction;

  const isTransfer = useMemo(() => transferAccount.id, [transferAccount]);

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
      {/* <div className={styles.midCell}>{isTransfer ? 'n/a' : catGroup.name}</div> */}
      {(activeType === 'Payment' || activeType === '') && (
        <div className={cx(styles.midCell, styles.right)}>
          {amountType === 'Payment' && actualAmount
            ? n(actualAmount * -1)
            : null}
        </div>
      )}
      {(activeType === 'Deposit' || activeType === '') && (
        <div className={cx(styles.midCell, styles.right)}>
          {amountType === 'Deposit' && actualAmount ? n(actualAmount) : null}
        </div>
      )}
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  activeAccount: PropTypes.string,
  activeType: PropTypes.string
};

Transaction.defaultProps = {
  activeAccount: null,
  activeType: ''
};

export default Transaction;
