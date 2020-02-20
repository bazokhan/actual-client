/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import SORTERS from 'App/constants/Sorters';
import { FaTag, FaMoneyBillAlt } from 'react-icons/fa';
import Table from 'ui/Table';
import Tag from 'ui/Tag';
import TableRow from 'ui/TableRow/TableRow';
import useFilterMachine from 'hooks/useFilterMachine';
import SelectableDiv from 'ui/SelectableDiv';
import PlaceholderDiv from 'ui/PlaceholderDiv/PlaceholderDiv';
import { n } from 'helpers/mathHelpers';
import styles from './Monthly.module.scss';
import monthlyReportGql from './gql/monthlyReport.gql';

const Header = ({
  transactions,
  style,
  isAscending,
  setIsAscending,
  sortBy,
  months,
  filterBy,
  activeMonth,
  setActiveMonth
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

const Row = ({ item: t, style, activeMonth }) => {
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

  return <TableRow cells={cells} style={{ ...style, height: '32px' }} />;
};

const Footer = forwardRef(({ transactions }, ref) => {
  return (
    <div ref={ref} style={{ height: 200 }}>
      <div className={styles.header}>Total</div>
      <div className={styles.header}>
        {transactions
          ?.filter(t => t.amount >= 0)
          .reduce((acc, next) => acc + next.amount, 0)}{' '}
        EGP
      </div>
      <div className={styles.header} />
      <div className={styles.header}>Total</div>
      <div className={styles.header}>
        {transactions
          ?.filter(t => t.amount < 0)
          .reduce((acc, next) => acc + next.amount * -1, 0)}{' '}
        EGP
      </div>
      <div className={styles.header} />
      <div className={styles.header}>Net</div>
      <div className={styles.header} />
      <div className={styles.header} />
      <div className={styles.header} />
      <div className={styles.header} />
      <div className={styles.header}>
        {transactions?.reduce((acc, next) => acc + next.amount, 0)} EGP
      </div>
    </div>
  );
});

const AccountTable = ({ loading, context }) => {
  const { sortBy, filteredTransactions, filterBy } = useFilterMachine(
    context?.transactions
  );

  const [isAscending, setIsAscending] = useState(true);

  const transactions = useMemo(
    () =>
      filteredTransactions?.filter(t =>
        context?.activeMonth ? t.month === context?.activeMonth : t
      ) || [],
    [context, filteredTransactions]
  );

  useEffect(() => {
    context.setPayment(
      transactions
        .filter(t => t.amount < 0)
        .reduce((prev, t) => prev + t.amount, 0)
    );
    context.setDeposit(
      transactions
        .filter(t => t.amount >= 0)
        .reduce((prev, t) => prev + t.amount, 0)
    );
    context.setNet(transactions.reduce((prev, t) => prev + t.amount, 0));
  }, [context, transactions]);

  return (
    <Table
      key={context?.account?.id}
      data={transactions}
      context={{
        ...context,
        transactions,
        isAscending,
        setIsAscending,
        sortBy,
        filterBy
      }}
      header={Header}
      loading={loading}
      rowHeight={32}
      row={Row}
      footer={Footer}
      title={context?.account?.name}
    />
  );
};

AccountTable.propTypes = {
  context: PropTypes.object.isRequired,
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

  const transactions = useMemo(
    () =>
      activeAccount?.transactions?.map(t => ({
        ...t,
        month: `${t.date?.split('-')?.[1]}/${t.date?.split('-')?.[2]}`
      })),
    [activeAccount]
  );

  const months = useMemo(
    () =>
      transactions?.reduce(
        (prev, t) => (prev.includes(t.month) ? prev : [...prev, t.month]),
        []
      ),
    [transactions]
  );

  const accountOptions = useMemo(
    () =>
      allAccounts?.map(account => ({
        label: account.name,
        value: account.id
      })),
    [allAccounts]
  );

  const monthOptions = useMemo(
    () =>
      months?.map(month => ({
        label: month,
        value: month
      })),
    [months]
  );

  const [activeMonth, setActiveMonth] = useState(months?.[0] || '');

  const [payment, setPayment] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [net, setNet] = useState(0);

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
              <Tag color="var(--main-color)" justifyContent="space-between">
                <FaTag />
                {activeAccount?.name}
              </Tag>
            </SelectableDiv>
          )}
        </div>
        <h2>Month</h2>
        <div>
          {loading ? (
            <PlaceholderDiv height={60} number={1} />
          ) : (
            <SelectableDiv
              defaultValue={monthOptions?.[0]}
              options={monthOptions}
              onChange={opt => setActiveMonth(opt.value)}
            >
              <Tag color="var(--main-color)" justifyContent="space-between">
                <FaTag />
                {activeMonth}
              </Tag>
            </SelectableDiv>
          )}
        </div>

        <h2>Deposit</h2>
        <div>
          {loading ? (
            <PlaceholderDiv height={60} number={1} />
          ) : (
            <Tag
              color="var(--success-color)"
              type="outline"
              justifyContent="space-between"
            >
              <FaMoneyBillAlt />
              {n(deposit)} EGP
            </Tag>
          )}
        </div>

        <h2>Payment</h2>
        <div>
          {loading ? (
            <PlaceholderDiv height={60} number={1} />
          ) : (
            <Tag
              color="var(--error-color)"
              type="outline"
              justifyContent="space-between"
            >
              <FaMoneyBillAlt />
              {n(payment)} EGP
            </Tag>
          )}
        </div>

        <h2>Net</h2>
        <div>
          {loading ? (
            <PlaceholderDiv height={60} number={1} />
          ) : (
            <Tag
              color={net < 0 ? 'var(--error-color)' : 'var(--success-color'}
              justifyContent="space-between"
            >
              <FaMoneyBillAlt />
              {n(net)} EGP
            </Tag>
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
        <AccountTable
          context={{
            transactions,
            account: activeAccount,
            months,
            activeMonth,
            setPayment,
            setDeposit,
            setNet
          }}
          loading={loading}
        />
      )}
      {/* {activeAccounts?.map(
        account =>
          account?.on && <AccountTable account={account} loading={loading} />
      )} */}
    </div>
  );
};

export default Monthly;
