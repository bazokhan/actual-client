import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import styles from '../App.module.scss';
import {
  dateNumFromIsoString,
  dateNumToString,
  todayString
} from '../../helpers/dateHelpers';

const n = num => numeral(num).format('0,0.00');
const sum = transactions =>
  transactions
    .map(t => t.actualAmount)
    .reduce((acc, amount) => acc + amount, 0);

const Header = ({ transactions, title, categories, payees, filter }) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setTotalBalance(sum(transactions));
  }, [transactions]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.transactionNum}>
        <p>{transactions.length}</p>
        <p>transactions</p>
      </div>
      <div className={styles.title}>
        <h1>{title}</h1>
      </div>
      <div className={styles.dateFilter}>
        {startDate && <p>From {dateNumToString(startDate, 'DMY')}</p>}
        {endDate && <p>To {dateNumToString(endDate, 'DMY')}</p>}
      </div>
      <div className={styles.balance}>
        <h2>BALANCE</h2>
        <p>{n(totalBalance)} EGP</p>
      </div>
      <div>
        <select
          onChange={e =>
            filter(
              e.target.value === 'all'
                ? t => t
                : t => t.categoryObj.id === e.target.value
            )
          }
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="transfer">Transfer</option>
        </select>
        <select
          onChange={e =>
            filter(
              e.target.value === 'all'
                ? t => t
                : t => t.payee.id === e.target.value
            )
          }
        >
          <option value="all">All Payees</option>
          {payees.map(payee => (
            <option key={payee.id} value={payee.id}>
              {payee.type === 'Account'
                ? payee.transferAccount.name
                : payee.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          onChange={e => filter(t => t.searchString.includes(e.target.value))}
          placeholder="Search"
        />
        <input
          type="date"
          onChange={e => {
            setStartDate(dateNumFromIsoString(e.target.value));
          }}
          value={startDate ? dateNumToString(startDate) : todayString()}
        />
        <input
          type="date"
          onChange={e => {
            setEndDate(dateNumFromIsoString(e.target.value));
          }}
          value={endDate ? dateNumToString(endDate) : todayString()}
        />
        <button
          type="button"
          disabled={!startDate || !endDate}
          onClick={() => filter(t => startDate <= t.date && t.date <= endDate)}
        >
          Go
        </button>
        <button
          type="button"
          disabled={!startDate || !endDate}
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
            filter(t => t);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  transactions: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  payees: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired
};

export default Header;
