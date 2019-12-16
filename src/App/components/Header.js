import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from '../App.module.scss';
// import { dateNumToString } from '../../helpers/dateHelpers';
import { sum, n } from '../../helpers/mathHelpers';
// import Filters from './Filters';

const Header = ({
  transactions,
  accountsAmounts,
  title
  // categories,
  // payees,
  // setDate,
  // activeType,
  // setType,
  // setCategory,
  // setPayee,
  // setSearch
}) => {
  // const [totalBalance, setTotalBalance] = useState(0);
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  const totalBalance = useMemo(
    () => accountsAmounts.reduce((total, next) => total + next, 0),
    [accountsAmounts]
  );
  const sheetNet = useMemo(() => sum(transactions), [transactions]);
  // useEffect(() => {
  //   setTotalBalance(sum(transactions));
  // }, [transactions]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.transactionNum}>
        <p>{transactions.length}</p>
        <p>transactions</p>
      </div>
      <div className={styles.title}>
        <h1>{title}</h1>
      </div>
      {/* <div className={styles.dateFilter}>
        {startDate && <p>From {dateNumToString(startDate, 'DMY')}</p>}
        {endDate && <p>To {dateNumToString(endDate, 'DMY')}</p>}
      </div> */}
      <div className={styles.totalsRow}>
        <div className={styles.balance}>
          <h2>BALANCE</h2>
          <p>{n(totalBalance)} EGP</p>
        </div>
        <div className={styles.balance}>
          <h2>Sheet Net</h2>
          <p>{n(sheetNet)} EGP</p>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  transactions: PropTypes.array.isRequired,
  accountsAmounts: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
  // categories: PropTypes.array.isRequired,
  // payees: PropTypes.array.isRequired,
  // setDate: PropTypes.func.isRequired,
  // activeType: PropTypes.string,
  // setType: PropTypes.func.isRequired,
  // setCategory: PropTypes.func.isRequired,
  // setPayee: PropTypes.func.isRequired,
  // setSearch: PropTypes.func.isRequired
};

// Header.defaultProps = {
//   activeType: ''
// };

export default Header;
