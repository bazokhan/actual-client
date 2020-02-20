/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import SORTERS from 'App/constants/Sorters';
import Table from 'ui/Table';
import TableRow from 'ui/TableRow/TableRow';
import { n } from 'helpers/mathHelpers';
import Tag from 'ui/Tag';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import styles from '../../Monthly.module.scss';

const Header = ({ style, isAscending, setIsAscending, sortBy }) => {
  const cells = [
    {
      name: 'month',
      size: 'sm',
      component: <p className={styles.title}>Month</p>
    },
    {
      name: 'amount',
      size: 'md',
      component: (
        <p
          className={styles.title}
          onClick={() => {
            console.log('clicked');
            setIsAscending(!isAscending);
            sortBy(
              isAscending ? SORTERS.NUM_ASC : SORTERS.NUM_DES,
              t => t.amount
            );
          }}
        >
          Amount
        </p>
      )
    },
    {
      name: 'category',
      size: 'md',
      component: <p className={styles.title}>Category</p>
    },
    {
      name: 'payee',
      size: 'md',
      component: <p className={styles.title}>Payee</p>
    }
  ];
  return <TableRow cells={cells} style={style} />;
};

const Row = ({ item: t, style }) => {
  const cells = [
    {
      name: 'month',
      size: 'sm',
      component: (
        <p className={styles.cell}>
          {`${t.date?.split('-')?.[1]}/${t.date?.split('-')?.[2]}`}
        </p>
      )
    },
    {
      name: 'amount',
      size: 'md',
      component: <p className={styles.cell}>{n(t.amount)}</p>
    },
    {
      name: 'category',
      size: 'md',
      component: (
        <Tag color="var(--main-color)" justifyContent="space-between">
          {t.category?.name}
        </Tag>
      )
    },
    {
      name: 'payee',
      size: 'md',
      component: (
        <Tag
          color="var(--error-color)"
          type="outlined"
          justifyContent="space-between"
        >
          <FaArrowAltCircleRight />
          {t.payee?.name}
        </Tag>
      )
    }
  ];

  return (
    <TableRow
      cells={cells}
      style={{ ...style, height: '32px', padding: '0' }}
    />
  );
};

Row.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object
};

Row.defaultProps = {
  style: {}
};

const PaymentTable = ({ loading, context }) => {
  const [isAscending, setIsAscending] = useState(true);

  const transactions = useMemo(
    () =>
      context?.filteredTransactions
        ?.filter(t => t.amount < 0)
        .filter(t =>
          context?.activeMonth ? t.month === context?.activeMonth : t
        ) || [],
    [context]
  );

  useEffect(() => {
    context.setPayment(
      transactions
        .filter(t => t.amount < 0)
        .reduce((prev, t) => prev + t.amount, 0)
    );
  }, [context, transactions]);

  return (
    <Table
      key={context?.account?.id}
      data={transactions}
      context={{
        ...context,
        transactions,
        isAscending,
        setIsAscending
      }}
      header={Header}
      loading={loading}
      rowHeight={32}
      row={Row}
      title={context?.account?.name}
    />
  );
};

PaymentTable.propTypes = {
  context: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

export default PaymentTable;
