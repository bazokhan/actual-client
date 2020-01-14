/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import ContentEditable from 'react-contenteditable';
import { useMutation } from '@apollo/react-hooks';
import { FaTimes } from 'react-icons/fa';
import styles from './Transaction.module.scss';
import updateTransactionGql from './gql/updateTransaction.gql';

const InputCell = ({ html, className, mutate }) => {
  const [loading, setLoading] = useState(false);
  return (
    <ContentEditable
      className={cx(className, loading ? styles.loading : '')}
      disabled={loading}
      tabIndex={0}
      onBlur={async e => {
        setLoading(true);
        try {
          await mutate(e.currentTarget.textContent);
        } catch (ex) {
          console.log(ex);
        }
        setLoading(false);
      }}
      html={html || ''}
    />
  );
};

InputCell.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired
};

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

  const [updateTransactionMutation] = useMutation(updateTransactionGql);

  const amountType = useMemo(() => (amount >= 0 ? 'Deposit' : 'Payment'), [
    amount
  ]);

  return (
    <div key={id} className={styles.row}>
      <button
        onClick={() => console.log(transaction)}
        type="button"
        className={styles.deleteButton}
        tabIndex={-1}
      >
        <FaTimes />
      </button>
      <div className={styles.midCell}>{date}</div>
      {!account && <div className={styles.midCell}>{accountName}</div>}
      <div className={styles.normCell}>{payeeName}</div>
      <InputCell
        className={styles.bigCell}
        mutate={async newNotes => {
          if (newNotes === notes) return;
          await updateTransactionMutation({
            variables: {
              id,
              transaction: { notes: newNotes }
            }
          });
        }}
        html={notes || ''}
      />
      <div className={styles.midCell}>{categoryName}</div>
      {(activeType === 'Payment' || !activeType) && (
        <InputCell
          className={cx(styles.midCell, styles.right)}
          mutate={async newAmountString => {
            try {
              if (!newAmountString) return;
              const newAmount = Number(newAmountString.replace(/,/g, ''));
              if (newAmount === amount) return;
              if (!typeof newAmount === 'number' || isNaN(newAmount)) return;
              await updateTransactionMutation({
                variables: {
                  id,
                  transaction: { amount: newAmount * -1 }
                }
              });
            } catch (ex) {
              console.log(ex);
            }
          }}
          html={amountType === 'Payment' && amount ? n(amount * -1) : ''}
        />
      )}
      {(activeType === 'Deposit' || !activeType) && (
        <InputCell
          className={cx(styles.midCell, styles.right)}
          mutate={async newAmountString => {
            try {
              if (!newAmountString) return;
              const newAmount = Number(newAmountString.replace(/,/g, ''));
              if (newAmount === amount) return;
              if (!typeof newAmount === 'number' || isNaN(newAmount)) return;
              await updateTransactionMutation({
                variables: {
                  id,
                  transaction: { amount: newAmount }
                }
              });
            } catch (ex) {
              console.log(ex);
            }
          }}
          html={amountType === 'Deposit' && amount ? n(amount) : ''}
        />
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
