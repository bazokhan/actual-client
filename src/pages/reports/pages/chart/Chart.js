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
  const [chartType, setChartType] = useState('line');
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

  const accountsOptions = useMemo(
    () => [
      {
        label: 'All accounts',
        value: ''
      },
      ...accounts.map(account => ({ label: account.name, value: account.id }), [
        accounts
      ])
    ],
    [accounts]
  );

  const groupsOptions = useMemo(
    () => [
      {
        label: 'All groups',
        value: ''
      },
      ...groups.map(group => ({ label: group.name, value: group.id }), [groups])
    ],
    [groups]
  );

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

  const apexData2 = useMemo(
    () =>
      transactions
        .sort((a, b) =>
          moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY'))
        )
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

            const accumulated = targetSeries.data[
              targetSeries.data.length - 1
            ] || { y: 0 };

            targetSeries.data.push({
              x: dateString,
              y: next.amount + accumulated.y
            });
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
      <div className="form-group">
        <label className="form-radio input-sm form-inline" htmlFor="line">
          <input
            id="line"
            type="radio"
            name="line"
            value="line"
            checked={chartType === 'line'}
            onChange={() => {
              setChartType('line');
            }}
          />
          <i className="form-icon" /> Line chart
        </label>
        <label className="form-radio input-sm form-inline" htmlFor="columns">
          <input
            id="columns"
            type="radio"
            name="columns"
            value="columns"
            checked={chartType === 'columns'}
            onChange={() => {
              setChartType('columns');
            }}
          />
          <i className="form-icon" /> Columns chart
        </label>
        <label className="form-radio input-sm form-inline" htmlFor="pie">
          <input
            id="pie"
            type="radio"
            name="pie"
            value="pie"
            checked={chartType === 'pie'}
            onChange={() => {
              setChartType('pie');
            }}
          />
          <i className="form-icon" /> Pie chart
        </label>
      </div>
      {chartType === 'line' && (
        <ApexChart
          series={apexData}
          type="area"
          height={350}
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
                text: 'EGP'
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
      )}
      {chartType === 'pie' && (
        <ApexChart
          series={apexData2}
          type="area"
          height={350}
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
                text: 'EGP'
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
      )}
    </div>
  );
};

export default Charts;
