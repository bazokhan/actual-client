import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { v2sum, n } from 'helpers/mathHelpers';
import {
  FaPlus,
  FaBuffer,
  FaChartLine,
  FaLock,
  FaAngleDown,
  FaAngleUp
} from 'react-icons/fa';
import Toggle from 'react-switch';
import styles from './Header.module.scss';
import useAccounts from '../../hooks/useAccounts';

const Header = ({
  filters,
  transactions,
  setModalOpen,
  optionsState,
  setOptionsState
}) => {
  const sheetNet = useMemo(() => v2sum(transactions), [transactions]);
  const payments = useMemo(
    () => v2sum(transactions.filter(t => t.amount < 0)),
    [transactions]
  );
  const deposits = useMemo(
    () => v2sum(transactions.filter(t => t.amount >= 0)),
    [transactions]
  );
  const { balance } = useAccounts();

  return (
    <div className={styles.headerContainer}>
      {optionsState.header && (
        <div className={styles.title}>
          <h1>
            {filters.account ? filters.account.name : 'All accounts'} overview
          </h1>
          <p>{filters.type ? ` - ${filters.type}s only` : ''}</p>
        </div>
      )}

      {optionsState.header ? (
        <div className={styles.headerCards}>
          <div className={styles.headerCard}>
            <label htmlFor="sidebar">
              <Toggle
                id="sidebar"
                onColor="#1382eb"
                offColor="#dddddd"
                checkedIcon={false}
                uncheckedIcon={false}
                height={16}
                width={32}
                checked={optionsState.sidebar}
                onChange={() =>
                  setOptionsState({
                    ...optionsState,
                    sidebar: !optionsState.sidebar
                  })
                }
              />
              <p>{optionsState.sidebar ? 'Hide sidebar' : 'Show sidebar'}</p>
            </label>
            <label htmlFor="header">
              <Toggle
                id="header"
                onColor="#1382eb"
                offColor="#dddddd"
                checkedIcon={false}
                uncheckedIcon={false}
                height={16}
                width={32}
                checked={optionsState.header}
                onChange={() =>
                  setOptionsState({
                    ...optionsState,
                    header: !optionsState.header
                  })
                }
              />
              <p>{optionsState.header ? 'Hide header' : 'Show header'}</p>
            </label>
          </div>

          <div className={styles.headerCard}>
            <span>
              <FaBuffer />
            </span>
            <p>{transactions.length}</p>
            <p>transactions</p>
          </div>

          <div className={styles.headerCard}>
            <span>
              <FaAngleUp />
            </span>
            <p>Deposits</p>
            <p style={{ color: 'var(--success-color)' }}>{n(deposits)} EGP</p>
          </div>

          <div className={styles.headerCard}>
            <span>
              <FaAngleDown />
            </span>
            <p>Payments</p>
            <p style={{ color: 'var(--error-color)' }}>{n(payments)} EGP</p>
          </div>

          <div className={styles.headerCard}>
            <span>
              <FaChartLine />
            </span>
            <p>Sheet Net</p>
            <p
              style={
                sheetNet < 0
                  ? { color: 'var(--error-color)' }
                  : { color: 'var(--success-color)' }
              }
            >
              {n(sheetNet)} EGP
            </p>
          </div>

          <div className={styles.headerLastCard}>
            <span>
              <FaLock />
            </span>
            <p>Safe</p>
            <p>{n(balance)} EGP</p>
          </div>
        </div>
      ) : (
        <div className={styles.headerCards}>
          <div className={styles.headerCard}>
            <label htmlFor="header">
              <Toggle
                id="header"
                onColor="#1382eb"
                offColor="#dddddd"
                checkedIcon={false}
                uncheckedIcon={false}
                height={16}
                width={32}
                checked={optionsState.header}
                onChange={() =>
                  setOptionsState({
                    ...optionsState,
                    header: !optionsState.header
                  })
                }
              />
              <p>{optionsState.header ? 'Show header' : 'Hide header'}</p>
            </label>
          </div>
        </div>
      )}
      <div className={styles.headerRow}>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={styles.addButton}
        >
          <FaPlus style={{ marginRight: '5px' }} />
          Add new transaction
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  filters: PropTypes.object.isRequired,
  transactions: PropTypes.array.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  optionsState: PropTypes.object.isRequired,
  setOptionsState: PropTypes.func.isRequired
};

export default Header;
