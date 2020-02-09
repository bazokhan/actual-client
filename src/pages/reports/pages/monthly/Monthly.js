import React, { useState, useEffect, Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styles from './Monthly.module.scss';
import monthlyReportGql from './gql/monthlyReport.gql';

const Monthly = () => {
  const { data } = useQuery(monthlyReportGql, {
    fetchPolicy: 'cache-and-network'
  });

  const [activeAccounts, setActiveAccounts] = useState([]);

  useEffect(
    () =>
      setActiveAccounts(
        data?.accounts?.map(account => ({ ...account, on: false }))
      ),
    [data]
  );

  return (
    <div className={styles.container}>
      {data?.accounts?.map(account => (
        <div key={account.id}>
          <input
            type="checkbox"
            value={account.id}
            onChange={() => {
              setActiveAccounts(
                activeAccounts?.map(a => {
                  if (a.id === account.id) return { ...a, on: !a.on };
                  return a;
                })
              );
            }}
            checked={account.on}
          />
          {account?.name}
        </div>
      ))}

      {activeAccounts?.map(
        account =>
          account?.on && (
            <div key={account.id} className={styles.table}>
              <div className={styles.header}>Income</div>
              <div className={styles.header}>Category</div>
              <div className={styles.header}>Month</div>
              <div className={styles.header}>Expense</div>
              <div className={styles.header}>Category</div>
              <div className={styles.header}>Month</div>
              {account?.transactions?.map(t => (
                <Fragment key={t.id}>
                  <p className={styles.bold}>{t?.amount >= 0 && t.amount}</p>
                  <p>{t?.amount >= 0 && t.category?.name}</p>
                  <p>
                    {t?.amount >= 0 &&
                      `${t.date?.split('-')?.[1]}/${t.date?.split('-')?.[2]}`}
                  </p>
                  <p className={styles.bold}>
                    {t?.amount < 0 && t.amount * -1}
                  </p>
                  <p>{t?.amount < 0 && t.category?.name}</p>
                  <p>
                    {t?.amount < 0 &&
                      `${t.date?.split('-')?.[1]}/${t.date?.split('-')?.[2]}`}
                  </p>
                </Fragment>
              ))}
            </div>
          )
      )}
    </div>
  );
};

export default Monthly;
