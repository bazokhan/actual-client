import React from 'react';
import PropTypes from 'prop-types';
import {
  dateNumFromIsoString,
  todayString,
  numerizeDate
} from 'helpers/dateHelpers';
import FILTERS from 'App/constants/Filters';

const Filters = ({ categories, payees, filters, filterBy }) => {
  return (
    <div className="form-group">
      <label className="form-label label-sm" htmlFor="categories">
        Select Category
        <select
          className="form-select select-sm"
          onChange={e => {
            const categoryId = e.target.value;
            return categoryId
              ? filterBy(FILTERS.CATEGORY, t => t.category.id === categoryId)
              : filterBy(FILTERS.CATEGORY, t => t);
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
              ? filterBy(FILTERS.PAYEE, t => t.payee.id === payeeId)
              : filterBy(FILTERS.PAYEE, t => t);
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
            filterBy(
              FILTERS.AFTER,
              t => numerizeDate(t.date) - requiredDateNum >= 0,
              date
            );
          }}
          value={filters.after || todayString()}
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
            filterBy(
              FILTERS.BEFORE,
              t => requiredDateNum - numerizeDate(t.date) >= 0,
              date
            );
          }}
          value={filters.before || todayString()}
        />
      </label>

      <div>
        <label className="form-radio input-sm" htmlFor="all">
          <input
            id="all"
            type="radio"
            name="amountType"
            value=""
            checked={!filters.type}
            onChange={() => {
              filterBy(FILTERS.TYPE, t => t, null);
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
            checked={filters.type === 'Payment'}
            onChange={() => {
              filterBy(FILTERS.TYPE, t => t.amount < 0, 'Payment');
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
            checked={filters.type === 'Deposit'}
            onChange={() => {
              filterBy(FILTERS.TYPE, t => t.amount >= 0, 'Deposit');
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
  filters: PropTypes.object.isRequired,
  filterBy: PropTypes.func.isRequired
};

export default Filters;
