import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import ApexChart from 'react-apexcharts';
import * as moment from 'moment';
import Select from 'react-select';
import styles from './Chart.module.scss';
import transactionsGql from './gql/transactions.gql';
import accountsGql from './gql/accounts.gql';
import groupsGql from './gql/groups.gql';

const Charts = () => {
  const [activeAccount, setActiveAccount] = useState({
    label: 'All accounts',
    value: ''
  });
  const [activeGroup, setActiveGroup] = useState({
    label: 'All groups',
    value: ''
  });

  const { data, error } = useQuery(transactionsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: accountsData } = useQuery(accountsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: groupsData } = useQuery(groupsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const accounts = useMemo(
    () => (accountsData && accountsData.accounts ? accountsData.accounts : []),
    [accountsData]
  );

  const groups = useMemo(
    () => (groupsData && groupsData.groups ? groupsData.groups : []),
    [groupsData]
  );

  const accountsOptions = useMemo(() => [
    {
      label: 'All accounts',
      value: ''
    },
    ...accounts.map(account => ({ label: account.name, value: account.id }), [
      accounts
    ])
  ]);

  const groupsOptions = useMemo(() => [
    {
      label: 'All groups',
      value: ''
    },
    ...groups.map(group => ({ label: group.name, value: group.id }), [groups])
  ]);

  const transactions = useMemo(
    () => (data && data.transactions ? data.transactions : []),
    [data]
  );

  const apexData = useMemo(
    () =>
      transactions
        .filter(t =>
          activeAccount.value ? t.account.id === activeAccount.value : t
        )
        .filter(t =>
          activeGroup.value ? t.category.group.id === activeGroup.value : t
        )
        .reduce((prev, next) => {
          const dateString = moment(next.date, 'DD-MM-YYYY').format(
            'MM/DD/YYYY'
          );
          if (!dateString) {
            return prev;
          }
          const targetSeries = prev.find(
            series => series.name === next.category.group.name
          );
          if (targetSeries) {
            const targetDate = targetSeries.data.find(
              transaction => transaction.x === dateString
            );

            if (targetDate) {
              targetDate.y += next.amount;
              return prev;
            }

            targetSeries.data.push({ x: dateString, y: next.amount });
            return prev;
          }
          prev.push({
            name: next.category.group.name,
            data: [{ x: dateString, y: next.amount }]
          });
          return prev;
        }, []),
    [transactions, activeAccount, activeGroup]
  );

  if (error) return <div>Error!</div>;

  return (
    <div className={styles.chartContainer}>
      <Select
        options={accountsOptions}
        value={activeAccount}
        onChange={value => setActiveAccount(value)}
      />
      <Select
        options={groupsOptions}
        value={activeGroup}
        onChange={value => setActiveGroup(value)}
      />
      <ApexChart
        series={apexData}
        type="area"
        height={750}
        options={{
          chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true
            },
            toolbar: {
              autoSelected: 'zoom'
            }
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0
          },
          title: {
            text: 'Transactions',
            align: 'left'
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0,
              stops: [0, 90, 100]
            }
          },
          yaxis: {
            labels: {
              formatter: val => {
                return `${(val / 1000).toFixed(0)}k`;
              }
            },
            title: {
              text: 'Price'
            }
          },
          xaxis: {
            type: 'datetime'
          },
          tooltip: {
            shared: false,
            y: {
              formatter: val => {
                return `${(val / 1000).toFixed(0)}k`;
              }
            }
          }
        }}
      />
    </div>
  );
};

export default Charts;
