/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import SORTERS from 'App/constants/Sorters';
import Table from 'ui/Table';
import TableRow from 'ui/TableRow/TableRow';
import { n } from 'helpers/mathHelpers';
import Tag from 'ui/Tag';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import styles from '../../Monthly.module.scss';

const ROW_HEIGHT = 60;
const Header = forwardRef(
  ({ style, isAscending, setIsAscending, sortBy, mode }, ref) => {
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
      },
      {
        name: 'notes',
        size: 'xl',
        condition: () => mode === 'fullScreen',
        component: <p className={styles.title}>Notes</p>
      }
    ];
    return (
      <div ref={ref}>
        <TableRow cells={cells} style={style} />
      </div>
    );
  }
);

Header.propTypes = {
  style: PropTypes.object,
  isAscending: PropTypes.bool.isRequired,
  setIsAscending: PropTypes.func.isRequired,
  sortBy: PropTypes.func.isRequired
};

Header.defaultProps = {
  style: {}
};

const Row = ({ item: t, style, mode }) => {
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
          color="var(--success-color)"
          type="outlined"
          justifyContent="space-between"
        >
          <FaArrowAltCircleLeft />
          {t.payee?.name}
        </Tag>
      )
    },
    {
      name: 'notes',
      size: 'xl',
      condition: () => mode === 'fullScreen',
      component: <p className={styles.title}>{t.notes || '---'}</p>
    }
  ];

  return (
    <TableRow
      cells={cells}
      style={{ ...style, height: `${ROW_HEIGHT}px`, padding: '0' }}
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

const DepositTable = ({ loading, context, isConcise }) => {
  const [isAscending, setIsAscending] = useState(true);

  const transactions = useMemo(
    () => context?.filteredTransactions?.filter(t => t.amount >= 0),
    [context]
  );

  return (
    <Table
      key={context?.account?.id}
      data={
        isConcise
          ? transactions.reduce((prev, next) => {
              const hasCategory = prev.find(
                t =>
                  t.category?.id === next.category?.id && t.month === next.month
              );
              if (hasCategory) {
                const categoryAccumulator = {
                  ...hasCategory,
                  amount: hasCategory.amount + next.amount,
                  payee: { id: hasCategory.payee.id, name: 'multiple' }
                };
                const filteredPrev = prev.filter(
                  t => t.id !== categoryAccumulator.id
                );
                return [...filteredPrev, categoryAccumulator];
              }
              return [...prev, next];
            }, [])
          : transactions
      }
      context={{
        ...context,
        transactions,
        isAscending,
        setIsAscending
      }}
      header={Header}
      loading={loading}
      rowHeight={ROW_HEIGHT}
      row={Row}
      title={`${transactions?.length} transactions`}
      alwaysShowTitle
    />
  );
};

DepositTable.propTypes = {
  context: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  isConcise: PropTypes.bool.isRequired
};

export default DepositTable;
