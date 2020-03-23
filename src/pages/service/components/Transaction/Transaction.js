/* eslint-disable no-restricted-globals */
import React, { useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import { useMutation } from '@apollo/react-hooks';
import { FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Tag } from 'ui';
import { COLOR_WHEEL, MAIN_COLORS } from 'App/constants/Colors';
import TableRow from 'ui/TableRow/TableRow';
import { dateNumToString } from 'helpers/dateHelpers';
import styles from './Transaction.module.scss';
import updateTransactionGql from './gql/updateTransaction.gql';
import SelectCell from './components/SelectCell';
import InputCell from './components/InputCell';
import deleteTransactionGql from './gql/deleteTransaction.gql';
import transactionsGql from './gql/transactions.gql';

const Transaction = ({
  item: transaction,
  style,
  accounts,
  categories,
  payees,
  filterValues
}) => {
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

  const accountOptions = useMemo(
    () => accounts?.map(a => ({ label: a.name, value: a.id })) || [],
    [accounts]
  );

  const payeeOptions = useMemo(
    () => payees?.map(a => ({ label: a.name, value: a.id })) || [],
    [payees]
  );

  const categoryOptions = useMemo(
    () => categories?.map(a => ({ label: a.name, value: a.id })) || [],
    [categories]
  );

  const categoryIndex = useMemo(
    () =>
      categories?.reduce((prev, c, i) => {
        if (c?.id === transaction?.category?.id) {
          return i;
        }
        return prev;
      }, 0),
    [categories, transaction]
  );
  const accountIndex = useMemo(
    () =>
      accounts?.reduce((prev, a, i) => {
        if (a?.id === transaction?.account?.id) {
          return i;
        }
        return prev;
      }, 0),
    [accounts, transaction]
  );
  const payeeIndex = useMemo(
    () =>
      payees?.reduce((prev, p, i) => {
        if (p?.id === transaction?.payee?.id) {
          return i;
        }
        return prev;
      }, 0),
    [payees, transaction]
  );

  const categoryColor = useMemo(
    () => COLOR_WHEEL[categoryIndex % COLOR_WHEEL.length] || '#eeeeee',
    [categoryIndex]
  );

  const accountColor = useMemo(
    () => MAIN_COLORS[accountIndex % MAIN_COLORS.length] || '#eeeeee',
    [accountIndex]
  );

  const payeeColor = useMemo(
    () => COLOR_WHEEL[payeeIndex % COLOR_WHEEL.length] || '#eeeeee',
    [payeeIndex]
  );

  const handleDeleteTransaction = async () => {
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
  };

  const handleUpdateAccount = async opt => {
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
  };

  const handleUpdatePayee = async opt => {
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
  };

  const handleUpdateCategory = async opt => {
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
  };

  const handleUpdateNotes = async newNotes => {
    if (newNotes === notes) return;
    await updateTransactionMutation({
      variables: {
        id,
        transaction: { notes: newNotes }
      }
    });
  };

  const handleUpdatePayment = async newAmountString => {
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
  };

  const handleUpdateDeposit = async newAmountString => {
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
  };

  const tableCells = [
    {
      name: 'delete-button',
      size: 'xs',
      component: (
        <button
          onClick={handleDeleteTransaction}
          className={styles.deleteButton}
          disabled={loading}
          type="button"
          tabIndex={-1}
        >
          <FaTimes />
        </button>
      )
    },
    {
      name: 'date',
      size: 'md',
      component: <p className={styles.date}>{dateNumToString(date, 'DMY')}</p>
    },
    {
      name: 'account',
      size: 'md',
      component: (
        <SelectCell
          defaultValue={{
            label: transaction.account.name,
            value: transaction.account.id
          }}
          options={accountOptions}
          color={accountColor}
          mutate={handleUpdateAccount}
        >
          <Tag type="solid" color={accountColor}>
            {accountName}
          </Tag>
        </SelectCell>
      )
    },
    {
      name: 'payee',
      size: 'lg',
      component: (
        <SelectCell
          defaultValue={{
            label: transaction.payee.name,
            value: transaction.payee.id
          }}
          options={payeeOptions}
          color={payeeColor}
          mutate={handleUpdatePayee}
        >
          <Tag
            type="outlined"
            color={payeeColor}
            justifyContent="space-between"
          >
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
      )
    },
    {
      name: 'category',
      size: 'md',
      component: (
        <SelectCell
          defaultValue={{
            label: transaction.category.name,
            value: transaction.category.id
          }}
          options={categoryOptions}
          color={categoryColor}
          mutate={handleUpdateCategory}
        >
          <Tag type="solid" color={categoryColor}>
            {categoryName}
          </Tag>
        </SelectCell>
      )
    },
    {
      name: 'notes',
      size: 'xl',
      component: (
        <InputCell mutate={handleUpdateNotes} defaultValue={notes || ''} />
      )
    },
    {
      name: 'payment',
      size: 'md',
      condition: () => filterValues?.type === 'Payment' || !filterValues?.type,
      component: (
        <InputCell
          className={styles.right}
          mutate={handleUpdatePayment}
          defaultValue={
            amountType === 'Payment' && amount ? n(amount * -1) : ''
          }
          color="var(--error-color)"
        />
      )
    },
    {
      name: 'deposit',
      size: 'md',
      condition: () => filterValues?.type === 'Deposit' || !filterValues?.type,
      component: (
        <InputCell
          className={styles.right}
          mutate={handleUpdateDeposit}
          defaultValue={amountType === 'Deposit' && amount ? n(amount) : ''}
          color="var(--success-color)"
        />
      )
    }
  ];

  return (
    <TableRow
      className={cx(styles.row, loading ? styles.loading : '')}
      style={style}
      cells={tableCells}
    />
  );
};

Transaction.propTypes = {
  item: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  payees: PropTypes.array.isRequired,
  filterValues: PropTypes.object.isRequired,
  style: PropTypes.object
};

Transaction.defaultProps = {
  style: {}
};

export default Transaction;
