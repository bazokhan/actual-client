/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import ContentEditable from 'react-contenteditable';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FaTimes } from 'react-icons/fa';
import styles from './Transaction.module.scss';
import updateTransactionGql from './gql/updateTransaction.gql';
import transactionListsGql from './gql/transactionLists.gql';
import SelectCell from './components/SelectCell';

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
  const { data } = useQuery(transactionListsGql, {
    fetchPolicy: 'cache-and-network'
  });
  const [accountEdit, setAccountEdit] = useState(false);
  const [payeeEdit, setPayeeEdit] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState(false);
  const [tAccount, setAccount] = useState(transaction.account);
  const [tPayee, setPayee] = useState(transaction.payee);
  const [tCategory, setCategory] = useState(transaction.category);
  const {
    id,
    amount,
    notes,
    date,
    account: { name: accountName },
    category: { name: categoryName },
    payee: { name: payeeName }
  } = transaction;

  const [updateTransactionMutation] = useMutation(updateTransactionGql, {
    onCompleted: res => {
      if (res.updateTransaction) {
        setAccount(res.updateTransaction.account);
        setPayee(res.updateTransaction.payee);
        setCategory(res.updateTransaction.category);
      }
    },
    onError: e => console.log(e)
  });

  const amountType = useMemo(() => (amount >= 0 ? 'Deposit' : 'Payment'), [
    amount
  ]);

  const accounts = useMemo(
    () =>
      data && data.accounts
        ? data.accounts.map(a => ({ label: a.name, value: a.id }))
        : [],
    [data]
  );

  const payees = useMemo(
    () =>
      data && data.payees
        ? data.payees.map(a => ({ label: a.name, value: a.id }))
        : [],
    [data]
  );

  const categories = useMemo(
    () =>
      data && data.categories
        ? data.categories.map(a => ({ label: a.name, value: a.id }))
        : [],
    [data]
  );

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
      <div className={styles.midCell} tabIndex={0}>
        {date}
      </div>
      {!account &&
        (accountEdit ? (
          <SelectCell
            onBlur={() => setAccountEdit(false)}
            className={styles.midCell}
            value={{ label: tAccount.name, value: tAccount.id }}
            onChange={async a => {
              try {
                if (!a) return;
                if (a.value === tAccount.id) return;
                await updateTransactionMutation({
                  variables: {
                    id,
                    transaction: { accountId: a.value }
                  }
                });
              } catch (ex) {
                console.log(ex);
              }
              setAccountEdit(false);
            }}
            options={accounts}
          />
        ) : (
          <div
            className={styles.midCell}
            onClick={() => setAccountEdit(true)}
            onFocus={() => setAccountEdit(true)}
            tabIndex={0}
          >
            {accountName}
          </div>
        ))}

      {payeeEdit ? (
        <SelectCell
          className={styles.normCell}
          value={{ label: tPayee.name, value: tPayee.id }}
          onBlur={() => setPayeeEdit(false)}
          onChange={async p => {
            try {
              if (!p) return;
              if (p.value === tPayee.id) return;
              await updateTransactionMutation({
                variables: {
                  id,
                  transaction: { payeeId: p.value }
                }
              });
            } catch (ex) {
              console.log(ex);
            }
            setPayeeEdit(false);
          }}
          options={payees}
        />
      ) : (
        <div
          className={styles.normCell}
          onClick={() => setPayeeEdit(true)}
          onFocus={() => setPayeeEdit(true)}
          tabIndex={0}
        >
          {payeeName}
        </div>
      )}

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
      {categoryEdit ? (
        <SelectCell
          className={styles.midCell}
          value={{ label: tCategory.name, value: tCategory.id }}
          onBlur={() => setCategoryEdit(false)}
          onChange={async c => {
            try {
              if (!c) return;
              if (c.value === tCategory.id) return;
              await updateTransactionMutation({
                variables: {
                  id,
                  transaction: { categoryId: c.value }
                }
              });
            } catch (ex) {
              console.log(ex);
            }
            setCategoryEdit(false);
          }}
          options={categories}
        />
      ) : (
        <div
          className={styles.midCell}
          onClick={() => setCategoryEdit(true)}
          onFocus={() => setCategoryEdit(true)}
          tabIndex={0}
        >
          {categoryName}
        </div>
      )}
      {(activeType === 'Payment' || !activeType) && (
        <InputCell
          className={cx(styles.midCell, styles.right)}
          mutate={async newAmountString => {
            try {
              if (!newAmountString) return;
              const newAmount = Number(newAmountString.replace(/,/g, ''));
              if (newAmount === amount * -1) return;
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
