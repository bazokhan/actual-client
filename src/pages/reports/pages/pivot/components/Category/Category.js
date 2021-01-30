import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { n } from 'helpers/mathHelpers';
import { Link } from 'react-router-dom';
import { FaTimes, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { numerizeDate, dateNumToString } from 'helpers/dateHelpers';
import styles from './Category.module.scss';

const Category = ({ collapseAll, category, index, handleCategoryFilter }) => {
  const [payeesToFilterBy, setFilters] = useState([]);
  const [collapsed, setCollapsed] = useState(collapseAll);

  const transactions = useMemo(
    () =>
      category.transactions.filter(t => !payeesToFilterBy.includes(t.payee.id)),
    [category, payeesToFilterBy]
  );

  useEffect(() => {
    handleCategoryFilter({ ...category, transactions });
  }, [category, handleCategoryFilter, transactions]);

  const balance = useMemo(
    () => transactions.reduce((prev, t) => prev + t.amount, 0),
    [transactions]
  );
  const [startDate, endDate] = useMemo(
    () =>
      transactions
        .reduce(
          (startEnd, t) => [
            Math.min(startEnd[0], numerizeDate(t.date)),
            Math.max(startEnd[1], numerizeDate(t.date))
          ],
          [100000000, 0]
        )
        .map(date => dateNumToString(date, 'DMY')),
    [transactions]
  );

  const accounts = useMemo(
    () =>
      transactions.reduce(
        (prev, t) => (prev.includes(t.account) ? prev : [...prev, t.account]),
        []
      ),
    [transactions]
  );

  const payees = useMemo(
    () =>
      transactions.reduce(
        (prev, t) => (prev.includes(t.payee) ? prev : [...prev, t.payee]),
        []
      ),
    [transactions]
  );

  if (!category.transactions.length) return null;
  return (
    <div className={cx(styles.row, collapsed ? styles.collapsed : '')}>
      <div className={cx(styles.cell, styles.tiny)}>
        {index + 1}
        <button
          className="btn btn-link btn-sm"
          type="button"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaAngleDown /> : <FaAngleUp />}
        </button>
      </div>
      <div className={cx(styles.cell, styles.mid)}>{category.name}</div>
      <div className={cx(styles.cell, styles.norm)}>
        {[startDate, endDate].join(' : ')}
      </div>
      <div className={cx(styles.cell, styles.norm)}>
        {accounts.map(a => (
          <span className={styles.tag} key={a.id}>
            {a.name}
          </span>
        ))}
      </div>
      <div className={cx(styles.cell, styles.big)}>
        {payees.map(p => (
          <span className={styles.tag} key={p.id}>
            {p.name}
            <button
              className="btn btn-link btn-sm"
              type="button"
              onClick={() => setFilters([...payeesToFilterBy, p.id])}
            >
              <FaTimes />
            </button>
          </span>
        ))}
      </div>
      <div className={cx(styles.cell, styles.mid)}>
        {balance < 0 ? n(balance * -1) : null}
      </div>
      <div className={cx(styles.cell, styles.mid)}>
        {balance >= 0 ? n(balance) : null}
      </div>
      <Link
        to={`/pivot/${category.id}`}
        className={cx(styles.cell, styles.small)}
      >
        {transactions.length}
      </Link>
    </div>
  );
};

Category.propTypes = {
  category: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  collapseAll: PropTypes.bool,
  handleCategoryFilter: PropTypes.func.isRequired
};

Category.defaultProps = {
  collapseAll: true
};

export default Category;
