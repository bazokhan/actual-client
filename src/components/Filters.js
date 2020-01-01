import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  dateNumFromIsoString,
  dateNumToString,
  todayString
} from 'helpers/dateHelpers';

const Filters = ({
  categories,
  payees,
  setDate,
  activeType,
  setType,
  setCategory,
  setPayee,
  setSearch
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="form-group">
      <label className="form-label label-sm" htmlFor="categories">
        Select Category
        <select
          className="form-select select-sm"
          onChange={e => setCategory(e.target.value)}
          id="categories"
          style={{ background: '#243b53' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="transfer">Transfer</option>
        </select>
      </label>
      <label className="form-label label-sm" htmlFor="payees">
        Select Payee
        <select
          className="form-select select-sm"
          onChange={e => setPayee(e.target.value)}
          id="payees"
          style={{ background: '#243b53' }}
        >
          <option value="">All Payees</option>
          {payees.map(payee => (
            <option key={payee.id} value={payee.id}>
              {payee.type === 'Account'
                ? payee.transferAccount.name
                : payee.name}
            </option>
          ))}
        </select>
      </label>
      <label className="form-label label-sm" htmlFor="search">
        Search
        <input
          className="form-input input-sm"
          id="search"
          type="text"
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          style={{ background: '#243b53', color: 'white' }}
        />
      </label>

      <label className="form-label label-sm" htmlFor="startdate">
        From
        <input
          id="startdate"
          type="date"
          className="form-input input-sm"
          onChange={e => {
            setStartDate(dateNumFromIsoString(e.target.value));
          }}
          value={startDate ? dateNumToString(startDate) : todayString()}
          style={{ background: '#243b53', color: 'white' }}
        />
      </label>

      <label className="form-label label-sm" htmlFor="enddate">
        To
        <input
          id="enddate"
          type="date"
          className="form-input input-sm"
          onChange={e => {
            setEndDate(dateNumFromIsoString(e.target.value));
          }}
          value={endDate ? dateNumToString(endDate) : todayString()}
          style={{ background: '#243b53', color: 'white' }}
        />
      </label>
      <div className="btn-group btn-group-block">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={!startDate || !endDate}
          onClick={() => setDate([startDate, endDate])}
        >
          Go
        </button>
        <button
          type="button"
          className="btn btn-sm"
          disabled={!startDate || !endDate}
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
            setDate([]);
          }}
        >
          Clear
        </button>
      </div>
      <div>
        <label className="form-radio input-sm" htmlFor="all">
          <input
            id="all"
            type="radio"
            name="amountType"
            value=""
            checked={!activeType}
            onChange={e => setType(e.target.value)}
          />
          <i className="form-icon" /> All
        </label>
        <label className="form-radio input-sm" htmlFor="payment">
          <input
            id="payment"
            type="radio"
            name="amountType"
            value="Payment"
            checked={activeType === 'Payment'}
            onChange={e => setType(e.target.value)}
          />
          <i className="form-icon" /> Payments
        </label>
        <label className="form-radio input-sm" htmlFor="deposit">
          <input
            id="deposit"
            type="radio"
            name="amountType"
            value="Deposit"
            checked={activeType === 'Deposit'}
            onChange={e => setType(e.target.value)}
          />
          <i className="form-icon" /> Deposits
        </label>
      </div>
    </div>
  );
};

Filters.propTypes = {
  categories: PropTypes.array.isRequired,
  payees: PropTypes.array.isRequired,
  setDate: PropTypes.func.isRequired,
  activeType: PropTypes.string,
  setType: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  setPayee: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired
};

Filters.defaultProps = {
  activeType: ''
};

export default Filters;
