/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Tag } from 'ui';
import styles from './Transaction.module.scss';
import updateTransactionGql from './gql/updateTransaction.gql';
import transactionListsGql from './gql/transactionLists.gql';
import SelectCell from './components/SelectCell';
import InputCell from './components/InputCell';
import deleteTransactionGql from './gql/deleteTransaction.gql';
import transactionsGql from './gql/transactions.gql';

const Transaction = ({
  transaction,
  filters,
  categoryColor,
  accountColor,
  payeeColor,
  style
}) => {
  const { data } = useQuery(transactionListsGql, {
    fetchPolicy: 'cache-and-network'
  });
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
  const [deleteTransactionMutation, { loading }] = useMutation(
    deleteTransactionGql,
    {
      refetchQueries: [{ query: transactionsGql }]
    }
  );

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
    <div
      key={id}
      className={styles.row}
      style={loading ? { ...style, opacity: '0.5' } : style}
    >
      <button
        onClick={async () => {
          try {
            await deleteTransactionMutation({
              variables: {
                id
              },
              update: (proxy, { data: { deleteTransaction } }) => {
                // Read the data from our cache for this query.
                const prevData = proxy.readQuery({ query: transactionsGql });
                // Write our data back to the cache with the new comment in it
                proxy.writeQuery({
                  query: transactionsGql,
                  data: {
                    ...prevData,
                    transactions: prevData.transactions.filter(
                      t => t.id !== deleteTransaction.id
                    )
                  }
                });
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        }}
        disabled={loading}
        type="button"
        className={styles.deleteButton}
        tabIndex={-1}
      >
        <FaTimes />
      </button>
      <div className={styles.midCell} tabIndex={0}>
        {date}
      </div>

      <SelectCell
        className={styles.midCell}
        defaultValue={{
          label: transaction.account.name,
          value: transaction.account.id
        }}
        options={accounts}
        color={accountColor}
        mutate={async opt => {
          try {
            if (!opt) return;
            if (opt.value === transaction.account.id) return;
            await updateTransactionMutation({
              variables: {
                id,
                transaction: { accountId: opt.value }
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        }}
      >
        <Tag type="solid" color={accountColor}>
          {accountName}
        </Tag>
      </SelectCell>

      <SelectCell
        className={styles.normCell}
        defaultValue={{
          label: transaction.payee.name,
          value: transaction.payee.id
        }}
        options={payees}
        color={payeeColor}
        mutate={async opt => {
          try {
            if (!opt) return;
            if (opt.value === transaction.payee.id) return;
            await updateTransactionMutation({
              variables: {
                id,
                transaction: { payeeId: opt.value }
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        }}
      >
        <Tag type="outlined" color={payeeColor} justifyContent="space-between">
          {amountType === 'Payment' ? (
            <FaArrowRight
              style={{ color: 'var(--error-color)', fontWeight: '900' }}
            />
          ) : (
            <FaArrowLeft
              style={{ color: 'var(--success-color)', fontWeight: '900' }}
            />
          )}
          {payeeName}
        </Tag>
      </SelectCell>

      <SelectCell
        className={styles.midCell}
        defaultValue={{
          label: transaction.category.name,
          value: transaction.category.id
        }}
        options={categories}
        color={categoryColor}
        mutate={async opt => {
          try {
            if (!opt) return;
            if (opt.value === transaction.category.id) return;
            await updateTransactionMutation({
              variables: {
                id,
                transaction: { categoryId: opt.value }
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        }}
      >
        <Tag type="solid" color={categoryColor}>
          {categoryName}
        </Tag>
      </SelectCell>

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
        defaultValue={notes || ''}
      />

      {(filters.type === 'Payment' || !filters.type) && (
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
          defaultValue={
            amountType === 'Payment' && amount ? n(amount * -1) : ''
          }
          color="var(--error-color)"
        />
      )}

      {(filters.type === 'Deposit' || !filters.type) && (
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
          defaultValue={amountType === 'Deposit' && amount ? n(amount) : ''}
          color="var(--success-color)"
        />
      )}
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  categoryColor: PropTypes.string,
  accountColor: PropTypes.string,
  payeeColor: PropTypes.string,
  style: PropTypes.object
};

Transaction.defaultProps = {
  categoryColor: '#eeeeee',
  accountColor: '#eeeeee',
  payeeColor: '#eeeeee',
  style: {}
};

export default Transaction;
