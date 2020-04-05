import React, { useState } from 'react';
import ApexChart from 'react-apexcharts';
import Select from 'react-select';
import styles from './Chart.module.scss';
import useChartsData from './hooks/useChartsData';

const dailyChartOptions = {
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
};

const accumulatedChartOptions = {
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
};

const Charts = () => {
  const [chartType, setChartType] = useState('daily');

  const {
    activeAccount,
    setActiveAccount,
    activeGroup,
    setActiveGroup,
    error,
    loading,
    accountsOptions,
    groupsOptions,
    dailyData,
    accumulatedData
  } = useChartsData();

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
        <label className="form-radio input-sm form-inline" htmlFor="daily">
          <input
            id="daily"
            type="radio"
            name="daily"
            value="daily"
            checked={chartType === 'daily'}
            onChange={() => {
              setChartType('daily');
            }}
          />
          <i className="form-icon" /> Daily chart
        </label>
        <label
          className="form-radio input-sm form-inline"
          htmlFor="accumulated"
        >
          <input
            id="accumulated"
            type="radio"
            name="accumulated"
            value="accumulated"
            checked={chartType === 'accumulated'}
            onChange={() => {
              setChartType('accumulated');
            }}
          />
          <i className="form-icon" /> Accumulated
        </label>
      </div>
      {chartType === 'daily' &&
        (loading ? (
          <p>Loading Chart Data</p>
        ) : (
          <ApexChart
            series={dailyData}
            type="area"
            height={350}
            options={dailyChartOptions}
          />
        ))}
      {chartType === 'accumulated' &&
        (loading ? (
          <p>Loading Chart Data</p>
        ) : (
          <ApexChart
            series={accumulatedData}
            type="area"
            height={350}
            options={accumulatedChartOptions}
          />
        ))}
    </div>
  );
};

export default Charts;
