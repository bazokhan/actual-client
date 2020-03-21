/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import SORTERS from 'App/constants/Sorters';
import Table from 'ui/Table';
import TableRow from 'ui/TableRow/TableRow';
import useFilterMachine from 'hooks/useFilterMachine';
import { n } from 'helpers/mathHelpers';
import styles from './AccountTable.module.scss';

const Header = ({ style, isAscending, setIsAscending, sortBy }) => {
  const cells = [
    {
      name: 'income',
      size: 'md',
      component: (
        <p
          className={styles.title}
          onClick={() => {
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

Header.propTypes = {
  style: PropTypes.object,
  isAscending: PropTypes.bool.isRequired,
  setIsAscending: PropTypes.func.isRequired,
  sortBy: PropTypes.func.isRequired
};

Header.defaultProps = {
  style: {}
};

const Row = ({ item: t, style }) => {
  const cells = [
    {
      name: 'income',
      size: 'md',
      component: <p className={styles.cell}>{t?.amount >= 0 && n(t.amount)}</p>
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
      component: (
        <p className={styles.cell}>{t?.amount < 0 && n(t.amount * -1)}</p>
      )
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

Row.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object
};

Row.defaultProps = {
  style: {}
};

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
      title={context?.account?.name}
    />
  );
};

AccountTable.propTypes = {
  context: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};
