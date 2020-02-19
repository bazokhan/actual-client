/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import SORTERS from 'App/constants/Sorters';
import { FaTag } from 'react-icons/fa';
import Table from 'ui/Table';
import Tag from 'ui/Tag';
import TableRow from 'ui/TableRow/TableRow';
import useFilterMachine from 'hooks/useFilterMachine';
import SelectableDiv from 'ui/SelectableDiv';
import PlaceholderDiv from 'ui/PlaceholderDiv/PlaceholderDiv';
import styles from './Monthly.module.scss';
import monthlyReportGql from './gql/monthlyReport.gql';

const Header = ({
  transactions,
  style,
  isAscending,
  setIsAscending,
  sortBy
}) => {
  const cells = [
    {
      name: 'income',
      size: 'md',
      component: (
        <p
          className={styles.title}
          onClick={() => {
            console.log('Clicked', transactions[0]);
            setIsAscending(!isAscending);
            sortBy(
              isAscending ? SORTERS.NUM_ASC : SORTERS.NUM_DES,
              t => t.amount
            );
          }}
        >
          Income
        </p>
      )
    },
    {
      name: 'category-income',
      size: 'md',
      component: <p className={styles.title}>Income Category</p>
    },
    {
      name: 'month-income',
      size: 'md',
      component: <p className={styles.title}>Month</p>
    },
    {
      name: 'expense',
      size: 'md',
      component: <p className={styles.title}>Expense</p>
    },
    {
      name: 'category-expense',
      size: 'md',
      component: <p className={styles.title}>Expense Category</p>
    },
    {
      name: 'month-expense',
      size: 'md',
      component: <p className={styles.title}>Month</p>
    }
  ];
  return <TableRow cells={cells} style={style} />;
};

const Row = ({ item: t, style }) => {
  const cells = [
    {
      name: 'income',
      size: 'md',
      component: <p className={styles.cell}>{t?.amount >= 0 && t.amount}</p>
    },
    {
      name: 'category-income',
      size: 'md',
      component: (
        <p className={styles.cell}>{t?.amount >= 0 && t.category?.name}</p>
      )
    },
    {
      name: 'month-income',
      size: 'md',
      component: (
        <p className={styles.cell}>
          {t?.amount >= 0 &&
            `${t.date?.split('-')?.[1]}/${t.date?.split('-')?.[2]}`}
        </p>
      )
    },
    {
      name: 'expense',
      size: 'md',
      component: <p className={styles.cell}>{t?.amount < 0 && t.amount * -1}</p>
    },
    {
      name: 'category-expense',
      size: 'md',
      component: (
        <p className={styles.cell}>{t?.amount < 0 && t.category?.name}</p>
      )
    },
    {
      name: 'month-expense',
      size: 'md',
      component: (
        <p className={styles.cell}>
          {t?.amount < 0 &&
            `${t.date?.split('-')?.[1]}/${t.date?.split('-')?.[2]}`}
        </p>
      )
    }
  ];

  return <TableRow cells={cells} style={style} />;
};

// const TableFooter = ({ account }) => {
//   return (
//     <div>
//       <div className={styles.header}>Total</div>
//       <div className={styles.header}>
//         {account?.transactions
//           ?.filter(t => t.amount >= 0)
//           .reduce((acc, next) => acc + next.amount, 0)}{' '}
//         EGP
//       </div>
//       <div className={styles.header} />
//       <div className={styles.header}>Total</div>
//       <div className={styles.header}>
//         {account?.transactions
//           ?.filter(t => t.amount < 0)
//           .reduce((acc, next) => acc + next.amount * -1, 0)}{' '}
//         EGP
//       </div>
//       <div className={styles.header} />
//       <div className={styles.header}>Net</div>
//       <div className={styles.header} />
//       <div className={styles.header} />
//       <div className={styles.header} />
//       <div className={styles.header} />
//       <div className={styles.header}>
//         {account?.transactions.reduce((acc, next) => acc + next.amount, 0)} EGP
//       </div>
//     </div>
//   );
// };

const TableByMonth = ({ account, loading }) => {
  const { sortBy, filteredTransactions } = useFilterMachine(
    account.transactions
  );

  const [isAscending, setIsAscending] = useState(true);

  return (
    <Table
      key={account.id}
      data={filteredTransactions || []}
      context={{
        transactions: filteredTransactions,
        isAscending,
        setIsAscending,
        sortBy
      }}
      header={Header}
      loading={loading}
      rowHeight={32}
      row={Row}
      title={account.name}
    />
  );
};

TableByMonth.propTypes = {
  account: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

const Monthly = () => {
  const { data, loading } = useQuery(monthlyReportGql, {
    fetchPolicy: 'cache-and-network'
  });

  const allAccounts = useMemo(() => data?.accounts, [data]);

  const [activeAccountId, setActiveAccountId] = useState(allAccounts?.[0]?.id);

  const activeAccount = useMemo(
    () =>
      allAccounts?.find(account => account.id === activeAccountId) ||
      allAccounts?.[0],
    [activeAccountId, allAccounts]
  );

  const accountOptions = useMemo(
    () =>
      allAccounts?.map(account => ({
        label: account.name,
        value: account.id
      })),
    [allAccounts]
  );

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <h2>Accounts</h2>
        <div>
          {loading ? (
            <PlaceholderDiv height={60} number={1} />
          ) : (
            <SelectableDiv
              defaultValue={accountOptions[0]}
              options={accountOptions}
              onChange={opt => setActiveAccountId(opt.value)}
            >
              {/* <p className={styles.select}>{activeAccount?.name}</p> */}
              <Tag color="var(--main-color)" justifyContent="space-between">
                <FaTag />
                {activeAccount?.name}
              </Tag>
            </SelectableDiv>
          )}
        </div>
        {/* {data?.accounts?.map(account => (
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
        ))} */}
      </div>
      {activeAccount && (
        <TableByMonth account={activeAccount} loading={loading} />
      )}
      {/* {activeAccounts?.map(
        account =>
          account?.on && <TableByMonth account={account} loading={loading} />
      )} */}
    </div>
  );
};

export default Monthly;
