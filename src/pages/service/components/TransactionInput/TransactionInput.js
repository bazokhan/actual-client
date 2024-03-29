/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import { useQuery, useMutation } from '@apollo/react-hooks';
import DatePicker from 'react-datepicker';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import styles from './TransactionInput.module.scss';
import createTransactionGql from './gql/createTransaction.gql';
import transactionListsGql from './gql/transactionLists.gql';
import InputCell from './components/InputCell';
import SelectCell from './components/SelectCell';
import transactionsGql from '../../gql/transactions.gql';

const ExampleCustomInput = ({ value, onClick }) => {
  const firstInputRef = useRef();

  useEffect(() => {
    if (
      firstInputRef &&
      firstInputRef.current &&
      firstInputRef.current.focus &&
      firstInputRef.current.click
    ) {
      firstInputRef.current.focus();
      firstInputRef.current.click();
    }
  }, [firstInputRef]);

  return (
    <button
      ref={firstInputRef}
      type="button"
      style={{
        background: 'none',
        padding: '0',
        margin: '0',
        border: 'none',
        cursor: 'pointer'
      }}
      className={styles.midCell}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

ExampleCustomInput.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

const TransactionInput = ({ onClose, filters }) => {
  const { data } = useQuery(transactionListsGql, {
    fetchPolicy: 'cache-and-network'
  });
  const [createTransactionMutation] = useMutation(createTransactionGql, {
    refetchQueries: [{ query: transactionsGql }],
    awaitRefetchQueries: true
  });

  const [inputDate, setDate] = useState(new Date());
  const [inputAccount, setAccount] = useState(null);
  const [inputPayee, setPayee] = useState(null);
  const [inputCategory, setCategory] = useState(null);
  const [inputAmount, setAmount] = useState(0);
  const [inputNotes, setNotes] = useState('');

  const { register, handleSubmit, errors, setValue } = useForm();

  const onSubmit = async values => {
    try {
      console.log(values);
      await createTransactionMutation({ variables: { transaction: values } });
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    register({ name: 'date' }, { required: true });
    register({ name: 'accountId' }, { required: true });
    register({ name: 'categoryId' }, { required: true });
    register({ name: 'payeeId' }, { required: true });
    register({ name: 'amount' }, { required: true });
    register({ name: 'notes' });
  }, [register]);

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

  // const [transaction, setTransaction] = useState({
  //   account: null,
  //   amount: '',
  //   date: '',
  //   payee: null,
  //   notes: '',
  //   category: null
  // });

  const amountType = useMemo(() => (inputAmount >= 0 ? 'Deposit' : 'Payment'), [
    inputAmount
  ]);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.row}>
          <h2 className={styles.modalTitle}>
            <FaPlus /> Add new transaction
          </h2>
          <button
            type="button"
            className={styles.linkIconButton}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div
          className={styles.row}
          style={{
            padding: '10px 0',
            border: 'solid 1px var(--light-main-color)'
          }}
        >
          <div style={{ width: '30px' }} />
          <div className={styles.midCell}>
            <p>Date</p>
          </div>
          {!filters.account && (
            <div className={styles.midCell}>
              <p>Account</p>
            </div>
          )}
          <div className={styles.normCell}>
            <p>Payee</p>
          </div>
          <div className={styles.bigCell}>
            <p>Notes</p>
          </div>
          <div className={styles.midCell}>
            <p>Category</p>
          </div>
          {(filters.type === 'Payment' || !filters.type) && (
            <div className={styles.midCell}>
              <p>Payment</p>
            </div>
          )}
          {(filters.type === 'Deposit' || !filters.type) && (
            <div className={styles.midCell}>
              <p>Deposit</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={styles.row}
            style={{
              padding: '10px 0',
              borderStyle: 'none solid solid',
              borderWidth: '1px',
              borderColor: 'var(--light-main-color)'
            }}
          >
            <div style={{ width: '30px' }} />
            <div className={styles.midCell}>
              <DatePicker
                dateFormat="dd-MM-yyyy"
                selected={inputDate}
                onChange={date => {
                  setDate(date);
                  setValue('date', date?.toISOString()?.split('T')?.[0]);
                }}
                customInput={<ExampleCustomInput />}
              />
            </div>
            {!filters.account && (
              <SelectCell
                className={styles.midCell}
                value={inputAccount}
                onChange={a => {
                  setAccount(a);
                  setValue('accountId', a?.value);
                }}
                options={accounts}
              />
            )}
            <SelectCell
              className={styles.normCell}
              value={inputPayee}
              onChange={p => {
                setPayee(p);
                setValue('payeeId', p?.value);
              }}
              options={payees}
            />
            <InputCell
              className={styles.bigCell}
              onBlur={newNotes => {
                setNotes(newNotes);
                setValue('notes', newNotes);
              }}
              html={inputNotes || ''}
            />

            <SelectCell
              className={styles.midCell}
              value={inputCategory}
              onChange={c => {
                setCategory(c);
                setValue('categoryId', c?.value);
              }}
              options={categories}
            />
            {(filters.type === 'Payment' || !filters.type) && (
              <InputCell
                className={cx(styles.midCell, styles.right)}
                onBlur={newAmountString => {
                  try {
                    if (!newAmountString) return;
                    const newAmount = Number(newAmountString.replace(/,/g, ''));
                    if (!typeof newAmount === 'number' || isNaN(newAmount))
                      return;
                    setAmount(newAmount * -1);
                    setValue('amount', newAmount * -1);
                  } catch (ex) {
                    console.log(ex);
                  }
                }}
                html={
                  amountType === 'Payment' && inputAmount
                    ? n(inputAmount * -1)
                    : ''
                }
              />
            )}
            {(filters.type === 'Deposit' || !filters.type) && (
              <InputCell
                className={cx(styles.midCell, styles.right)}
                onBlur={newAmountString => {
                  try {
                    if (!newAmountString) return;
                    const newAmount = Number(newAmountString.replace(/,/g, ''));
                    if (!typeof newAmount === 'number' || isNaN(newAmount))
                      return;
                    setAmount(newAmount);
                    setValue('amount', newAmount);
                  } catch (ex) {
                    console.log(ex);
                  }
                }}
                html={
                  amountType === 'Deposit' && inputAmount ? n(inputAmount) : ''
                }
              />
            )}
          </div>
          <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              style={{ margin: '10px', width: '120px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              style={{ margin: '10px', width: '120px' }}
            >
              Add
            </button>
          </div>
        </form>
        {Object.keys(errors)?.length > 0 &&
          Object.keys(errors).map(key => (
            <p key={key} style={{ margin: '50px', color: 'red' }}>
              {key} is {errors[key]?.type}
            </p>
          ))}
      </div>
    </div>
  );
};

TransactionInput.propTypes = {
  filters: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TransactionInput;
