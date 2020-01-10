import React from 'react';
import PropTypes from 'prop-types';
import {
  dateNumFromIsoString,
  todayString,
  numerizeDate
} from 'helpers/dateHelpers';

const Filters = ({
  categories,
  payees,
  activeType,
  filterByType,
  filterByCategory,
  filterByPayee,
  filterByAfter,
  filterByBefore,
  startDate,
  endDate
}) => {
  return (
    <div className="form-group">
      <label className="form-label label-sm" htmlFor="categories">
        Select Category
        <select
          className="form-select select-sm"
          onChange={e => {
            const categoryId = e.target.value;
            return categoryId
              ? filterByCategory(t => t.category.id === categoryId)
              : filterByCategory(t => t);
          }}
          id="categories"
          style={{ color: '#243b53' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <label className="form-label label-sm" htmlFor="payees">
        Select Payee
        <select
          className="form-select select-sm"
          onChange={e => {
            const payeeId = e.target.value;
            return payeeId
              ? filterByPayee(t => t.payee.id === payeeId)
              : filterByPayee(t => t);
          }}
          id="payees"
          style={{ color: '#243b53' }}
        >
          <option value="">All Payees</option>
          {payees.map(payee => (
            <option key={payee.id} value={payee.id}>
              {payee.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label label-sm" htmlFor="startdate">
        From
        <input
          id="startdate"
          type="date"
          className="form-input input-sm"
          onChange={e => {
            const date = e.target.value;
            const requiredDateNum = dateNumFromIsoString(date);
            filterByAfter([
              date,
              t => numerizeDate(t.date) - requiredDateNum >= 0
            ]);
          }}
          value={startDate || todayString()}
        />
      </label>

      <label className="form-label label-sm" htmlFor="enddate">
        To
        <input
          id="enddate"
          type="date"
          className="form-input input-sm"
          onChange={e => {
            const date = e.target.value;
            const requiredDateNum = dateNumFromIsoString(date);
            filterByBefore([
              date,
              t => requiredDateNum - numerizeDate(t.date) >= 0
            ]);
          }}
          value={endDate || todayString()}
        />
      </label>
      <div className="btn-group btn-group-block">
        {/* <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={!startDate || !endDate}
          onClick={() => setDate([startDate, endDate])}
        >
          Go
        </button> */}
        {/* <button
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
        </button> */}
      </div>
      <div>
        <label className="form-radio input-sm" htmlFor="all">
          <input
            id="all"
            type="radio"
            name="amountType"
            value=""
            checked={!activeType}
            onChange={() => {
              filterByType([null, t => t]);
            }}
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
            onChange={() => {
              filterByType(['Payment', t => t.amount < 0]);
            }}
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
            onChange={() => {
              filterByType(['Deposit', t => t.amount >= 0]);
            }}
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
  activeType: PropTypes.string,
  filterByType: PropTypes.func.isRequired,
  filterByCategory: PropTypes.func.isRequired,
  filterByPayee: PropTypes.func.isRequired,
  filterByAfter: PropTypes.func.isRequired,
  filterByBefore: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string
};

Filters.defaultProps = {
  activeType: null,
  startDate: null,
  endDate: null
};

export default Filters;
