/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import ContentEditable from 'react-contenteditable';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import styles from './Transaction.module.scss';
import updateTransactionGql from './gql/updateTransaction.gql';
import transactionListsGql from './gql/transactionLists.gql';
import SelectCell from './components/SelectCell';

const InputCell = ({ html, className, mutate, color }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(html);
  const inputRef = useRef();

  useEffect(() => {
    if (editMode && inputRef && inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
    }
  }, [inputRef, editMode]);
  return (
    <div className={cx(className, loading ? styles.loading : '')}>
      <div className={styles.editable}>
        {editMode ? (
          <form
            onSubmit={async e => {
              e.preventDefault();
              setLoading(true);
              try {
                await mutate(value);
              } catch (ex) {
                console.log(ex);
              }
              setLoading(false);
              setEditMode(false);
            }}
          >
            <input
              ref={inputRef}
              style={
                color
                  ? { width: '100%', outline: 'none', color }
                  : { width: '100%', outline: 'none' }
              }
              type="text"
              tabIndex={0}
              onChange={e => setValue(e.target.value)}
              value={value}
              onBlur={async e => {
                e.preventDefault();
                setLoading(true);
                try {
                  await mutate(value);
                } catch (ex) {
                  console.log(ex);
                }
                setLoading(false);
                setEditMode(false);
              }}
            />
          </form>
        ) : (
          <div
            style={
              color
                ? { width: '100%', outline: 'none', color }
                : { width: '100%', outline: 'none' }
            }
            tabIndex={0}
            onClick={() => setEditMode(true)}
            onFocus={() => setEditMode(true)}
          >
            {value}
          </div>
        )}
        {/* <ContentEditable
          style={
            color
              ? { width: '100%', outline: 'none', color }
              : { width: '100%', outline: 'none' }
          }
          disabled={loading}
          tabIndex={0}
          onSubmit={async e => {
            setLoading(true);
            try {
              await mutate(e.currentTarget.textContent);
            } catch (ex) {
              console.log(ex);
            }
            setLoading(false);
          }}
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
        /> */}
      </div>
    </div>
  );
};

InputCell.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired
};

const Transaction = ({
  transaction,
  filters,
  tagColor,
  accountColor,
  payeeColor,
  style
}) => {
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
    <div key={id} className={styles.row} style={style || {}}>
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
      {!filters.account &&
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
            <div
              className={styles.tag}
              style={{
                backgroundColor: accountColor,
                boxShadow: `0 3px 6px 0 ${accountColor}32`
              }}
            >
              {accountName}
            </div>
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
          <div
            className={styles.tag}
            style={{
              border: `solid 1px var(--main-color)`,
              // boxShadow: `0 3px 6px 0 ${payeeColor}32`,
              color: payeeColor,
              display: 'flex',
              justifyContent: 'space-between'
            }}
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
          </div>
        </div>
      )}

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
          <div
            className={styles.tag}
            style={{
              backgroundColor: tagColor,
              boxShadow: `0 3px 6px 0 ${tagColor}32`
            }}
          >
            {categoryName}
          </div>
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
          html={amountType === 'Payment' && amount ? n(amount * -1) : ''}
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
          html={amountType === 'Deposit' && amount ? n(amount) : ''}
          color="var(--success-color)"
        />
      )}
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  tagColor: PropTypes.string,
  accountColor: PropTypes.string,
  payeeColor: PropTypes.string
};

Transaction.defaultProps = {
  tagColor: '#333',
  accountColor: 'red',
  payeeColor: 'red'
};

export default Transaction;
