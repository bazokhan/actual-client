import React from 'react';
import PropTypes from 'prop-types';
import { n, sum } from '../../helpers/mathHelpers';
import styles from './Print.module.scss';

const Print = ({ transactions, activeAccount, activeType }) => {
  if (!transactions || !transactions.length) return null;
  return (
    <div className={styles.printContainer}>
      <div className={styles.printHeader}>
        <h1 className={styles.printTitle}>Telescan Radiology Center</h1>
        <h2 className={styles.printSubtitle}>Department of accounting</h2>
      </div>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.normCell}>Date</div>
          {!activeAccount && <div className={styles.midCell}>Account</div>}
          <div className={styles.normCell}>Payee</div>
          <div className={styles.bigCell}>Notes</div>
          <div className={styles.midCell}>Category</div>
          {(activeType === 'Payment' || activeType === '') && (
            <div className={styles.midCell}>Payment</div>
          )}
          {(activeType === 'Deposit' || activeType === '') && (
            <div className={styles.midCell}>Deposit</div>
          )}
        </div>
        {transactions.map(t => (
          <div className={styles.row} key={t.id}>
            <div className={styles.normCell}>{t.dateString}</div>
            {!activeAccount && (
              <div className={styles.midCell}>{t.account.name}</div>
            )}
            <div className={styles.normCell}>
              {t.transferAccount.id ? t.transferAccount.name : t.payee.name}
            </div>
            <div className={styles.bigCell}>{t.notes}</div>
            <div className={styles.midCell}>{t.categoryObj.name}</div>
            {(activeType === 'Payment' || activeType === '') && (
              <div className={styles.midCell}>
                {t.amountType === 'Payment' && t.actualAmount
                  ? n(t.actualAmount * -1)
                  : null}
              </div>
            )}
            {(activeType === 'Deposit' || activeType === '') && (
              <div className={styles.midCell}>
                {t.amountType === 'Deposit' && t.actualAmount
                  ? n(t.actualAmount)
                  : null}
              </div>
            )}
          </div>
        ))}
        <div className={styles.row}>
          <div className={styles.normCell}>Total</div>
          {!activeAccount && <div className={styles.midCell} />}
          <div className={styles.normCell} />
          <div className={styles.bigCell} />
          <div className={styles.midCell} />
          {/* <div className={styles.midCell} /> */}
          {(activeType === 'Payment' || activeType === '') && (
            <div className={styles.midCell}>
              {n(
                sum(transactions.filter(t => t.amountType === 'Payment')) * -1
              )}
            </div>
          )}
          {(activeType === 'Deposit' || activeType === '') && (
            <div className={styles.midCell}>
              {n(sum(transactions.filter(t => t.amountType === 'Deposit')))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.printFooter}>
        <p>actual-budget-pro-2020</p>
      </div>
    </div>
  );
};

Print.propTypes = {
  transactions: PropTypes.array.isRequired,
  activeAccount: PropTypes.string.isRequired,
  activeType: PropTypes.string.isRequired
};

export default Print;
