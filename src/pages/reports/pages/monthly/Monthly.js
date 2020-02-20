/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FaTag, FaMoneyBillAlt } from 'react-icons/fa';
import Tag from 'ui/Tag';
import SelectableDiv from 'ui/SelectableDiv';
import PlaceholderDiv from 'ui/PlaceholderDiv/PlaceholderDiv';
import { n } from 'helpers/mathHelpers';
import useFilterMachine from 'hooks/useFilterMachine';
import styles from './Monthly.module.scss';
import monthlyReportGql from './gql/monthlyReport.gql';
import DepositTable from './components/DepositTable';
import PaymentTable from './components/PaymentTable';

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
      })) || [],
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

  const { sortBy, filteredTransactions, filterBy } = useFilterMachine(
    transactions
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
              type="outlined"
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
              type="outlined"
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
      </div>
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        {activeAccount && (
          <PaymentTable
            context={{
              transactions,
              account: activeAccount,
              months,
              activeMonth,
              setPayment,
              setDeposit,
              setNet,
              sortBy,
              filteredTransactions,
              filterBy
            }}
            loading={loading}
          />
        )}
        {activeAccount && (
          <DepositTable
            context={{
              transactions,
              account: activeAccount,
              months,
              activeMonth,
              setPayment,
              setDeposit,
              setNet,
              sortBy,
              filteredTransactions,
              filterBy
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Monthly;
