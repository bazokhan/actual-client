import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { v2sum, n } from 'helpers/mathHelpers';
import { FaPlus } from 'react-icons/fa';
import styles from './Header.module.scss';
import useAccounts from '../../hooks/useAccounts';

const Header = ({ account, activeType, transactions, setShow }) => {
  const sheetNet = useMemo(() => v2sum(transactions), [transactions]);
  const { balance } = useAccounts();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.transactionNum}>
        <p>{transactions.length}</p>
        <p>transactions</p>
      </div>
      <div className={styles.title}>
        <h1>
          {account ? account.name : 'All accounts'}
          {activeType ? ` - ${activeType}` : ''}
        </h1>
      </div>
      <div className={styles.totalsRow}>
        <button
          type="button"
          onClick={() => setShow(true)}
          className="btn btn-link btn-sm"
        >
          <FaPlus />
          Add
        </button>
        {/* <div className={styles.balance}>
          <h2>BALANCE</h2>
          <p>{n(balance)} EGP</p>
        </div>
        <div className={styles.balance}>
          <h2>Sheet Net</h2>
          <p>{n(sheetNet)} EGP</p>
        </div> */}
      </div>
    </div>
  );
};

Header.propTypes = {
  account: PropTypes.object,
  activeType: PropTypes.string,
  transactions: PropTypes.array.isRequired,
  setShow: PropTypes.func.isRequired
};

Header.defaultProps = {
  account: null,
  activeType: ''
};

export default Header;
