/* eslint-disable no-restricted-globals */
import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { n } from 'helpers/mathHelpers';
import { useQuery } from '@apollo/react-hooks';
import DatePicker from 'react-datepicker';
import styles from './TransactionInput.module.scss';
// import createTransactionGql from './gql/createTransaction.gql';
import transactionListsGql from './gql/transactionLists.gql';
import InputCell from './components/InputCell';
import SelectCell from './components/SelectCell';

const ExampleCustomInput = ({ value, onClick }) => (
  <button
    type="button"
    style={{ background: 'none', padding: '0', margin: '0', border: 'none' }}
    className={styles.midCell}
    onClick={onClick}
  >
    {value}
  </button>
);

ExampleCustomInput.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

const TransactionInput = ({ show, setShow, filters }) => {
  const { data } = useQuery(transactionListsGql, {
    fetchPolicy: 'cache-and-network'
  });
  // const [createTransactionMutation] = useMutation(createTransactionGql);

  const [inputDate, setDate] = useState(new Date());
  const [inputAccount, setAccount] = useState(null);
  const [inputPayee, setPayee] = useState(null);
  const [inputCategory, setCategory] = useState(null);
  const [inputAmount, setAmount] = useState(0);
  const [inputNotes, setNotes] = useState('');

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

  return show ? (
    <>
      <div className={styles.row}>
        <div style={{ width: '30px' }} />
        <div className={styles.midCell}>
          <DatePicker
            dateFormat="dd-MM-yyyy"
            selected={inputDate}
            onChange={date => {
              console.log(date);
              setDate(date);
            }}
            customInput={<ExampleCustomInput />}
          />
        </div>
        {!filters.account && (
          <SelectCell
            className={styles.midCell}
            value={inputAccount}
            onChange={a => setAccount(a)}
            options={accounts}
          />
        )}
        <SelectCell
          className={styles.normCell}
          value={inputPayee}
          onChange={p => setPayee(p)}
          options={payees}
        />
        <InputCell
          className={styles.bigCell}
          onBlur={newNotes => setNotes(newNotes)}
          html={inputNotes || ''}
        />

        <SelectCell
          className={styles.midCell}
          value={inputCategory}
          onChange={c => setCategory(c)}
          options={categories}
        />
        {(filters.type === 'Payment' || !filters.type) && (
          <InputCell
            className={cx(styles.midCell, styles.right)}
            onBlur={newAmountString => {
              try {
                if (!newAmountString) return;
                const newAmount = Number(newAmountString.replace(/,/g, ''));
                if (!typeof newAmount === 'number' || isNaN(newAmount)) return;
                setAmount(newAmount * -1);
              } catch (ex) {
                console.log(ex);
              }
            }}
            html={
              amountType === 'Payment' && inputAmount ? n(inputAmount * -1) : ''
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
                if (!typeof newAmount === 'number' || isNaN(newAmount)) return;
                setAmount(newAmount);
              } catch (ex) {
                console.log(ex);
              }
            }}
            html={amountType === 'Deposit' && inputAmount ? n(inputAmount) : ''}
          />
        )}
      </div>
      <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setShow(false)}
          style={{ margin: '10px', width: '120px' }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() =>
            console.log({
              inputDate,
              inputAccount,
              inputPayee,
              inputCategory,
              inputAmount,
              inputNotes
            })
          }
          style={{ margin: '10px', width: '120px' }}
        >
          Add
        </button>
      </div>
    </>
  ) : null;
};

TransactionInput.propTypes = {
  filters: PropTypes.object.isRequired,
  show: PropTypes.bool,
  setShow: PropTypes.func.isRequired
};

TransactionInput.defaultProps = {
  show: false
};

export default TransactionInput;
