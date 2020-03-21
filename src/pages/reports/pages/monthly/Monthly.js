/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FaTag, FaMoneyBillAlt } from 'react-icons/fa';
import Tag from 'ui/Tag';
import SelectableDiv from 'ui/SelectableDiv';
import PlaceholderDiv from 'ui/PlaceholderDiv/PlaceholderDiv';
import { n } from 'helpers/mathHelpers';
import useFilterMachine from 'hooks/useFilterMachine';
import FILTERS from 'App/constants/Filters';
import Toggle from 'react-switch';
import styles from './Monthly.module.scss';
import monthlyReportGql from './gql/monthlyReport.gql';
import DepositTable from './components/DepositTable';
import PaymentTable from './components/PaymentTable';

const isSelected = (arr, value) => arr?.includes(value);

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
  const transactions = useMemo(() => activeAccount?.transactions || [], [
    activeAccount
  ]);

  const allCategories = useMemo(() => data?.categories, [data]);

  const {
    sortBy,
    filteredTransactions,
    filterBy,
    unfilteredLists: { categories: categoryIds, months },
    filterValues,
    payment,
    deposit,
    net
  } = useFilterMachine(transactions);

  useEffect(() => {
    filterBy(FILTERS.CATEGORIES, t => t, categoryIds);
  }, [loading]);

  const accountOptions = useMemo(
    () =>
      allAccounts?.map(account => ({
        label: account.name,
        value: account.id
      })),
    [allAccounts]
  );

  const categoryOptions = useMemo(
    () =>
      categoryIds?.map(id => ({
        label: allCategories.find(c => c.id === id)?.name,
        value: id
      })),
    [allCategories, categoryIds]
  );

  const monthOptions = useMemo(
    () =>
      months?.map(month => ({
        label: month,
        value: month
      })),
    [months]
  );

  const [isConcise, setConcise] = useState(false);

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
              onChange={opt => {
                setActiveAccountId(opt.value);
                filterBy(
                  FILTERS.ACCOUNT,
                  t => t.account.id === opt.value,
                  opt.value
                );
              }}
            >
              <Tag
                style={{ margin: 0 }}
                color="var(--main-color)"
                justifyContent="space-between"
              >
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
              onChange={opt => {
                // setSelectedMonth(opt.value);
                filterBy(FILTERS.MONTH, t => t.month === opt.value, opt.value);
              }}
            >
              <Tag
                style={{ margin: 0 }}
                color="var(--main-color)"
                justifyContent="space-between"
              >
                <FaTag />
                {filterValues?.month}
              </Tag>
            </SelectableDiv>
          )}
        </div>
        <button
          type="button"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 8px',
            width: '100%',
            border: 'solid 1px var(--main-color)'
          }}
          onClick={() => filterBy(FILTERS.MONTH, t => t, '')}
        >
          All time
        </button>

        <h2>Deposit</h2>
        <div>
          {loading ? (
            <PlaceholderDiv height={60} number={1} />
          ) : (
            <Tag
              style={{ margin: 0 }}
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
              style={{ margin: 0 }}
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
              style={{ margin: 0 }}
              color={net < 0 ? 'var(--error-color)' : 'var(--success-color'}
              justifyContent="space-between"
            >
              <FaMoneyBillAlt />
              {n(net)} EGP
            </Tag>
          )}
        </div>

        <h2>Categories</h2>
        <label
          htmlFor="concise"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Toggle
            id="concise"
            onColor="#1382eb"
            offColor="#dddddd"
            checkedIcon={false}
            uncheckedIcon={false}
            height={16}
            width={32}
            checked={isConcise}
            onChange={() => setConcise(!isConcise)}
          />
          <p style={{ margin: 0, marginLeft: '5px' }}>
            {isConcise ? 'concise' : 'detailed'}
          </p>
        </label>
        <label
          htmlFor="selectall"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            id="selectall"
            type="checkbox"
            onChange={() => {
              if (filterValues.categories?.length === categoryOptions?.length) {
                filterBy(
                  FILTERS.CATEGORIES,
                  t => [].includes(t.category.id),
                  []
                );
                return;
              }

              filterBy(
                FILTERS.CATEGORIES,
                t => categoryIds.includes(t.category.id),
                categoryIds
              );
            }}
            value="selectall"
            checked={
              filterValues.categories?.length === categoryOptions?.length
            }
          />
          <p style={{ margin: 0, marginLeft: '5px' }}>
            {filterValues.categories?.length === categoryOptions?.length
              ? 'Deselect All'
              : 'Select All'}
          </p>
        </label>
        <div>
          {categoryOptions?.map(category =>
            loading ? (
              <PlaceholderDiv key={category.value} height={60} number={10} />
            ) : (
              <Tag
                style={{ margin: 0 }}
                key={category.value}
                color={net < 0 ? 'var(--error-color)' : 'var(--success-color'}
                type="outlined"
                justifyContent="space-between"
              >
                <label htmlFor={category.value}>
                  <input
                    id={category.value}
                    type="checkbox"
                    onChange={() => {
                      if (isSelected(filterValues.categories, category.value)) {
                        filterBy(
                          FILTERS.CATEGORIES,
                          t =>
                            isSelected(
                              filterValues.categories.filter(
                                c => c !== category.value
                              ),
                              t.category.id
                            ),
                          filterValues.categories.filter(
                            c => c !== category.value
                          )
                        );
                        return;
                      }
                      filterBy(
                        FILTERS.CATEGORIES,
                        t =>
                          isSelected(
                            [...filterValues.categories, category.value],
                            t.category.id
                          ),
                        [...filterValues.categories, category.value]
                      );
                    }}
                    value={category.value}
                    checked={isSelected(
                      filterValues.categories,
                      category.value
                    )}
                  />
                </label>
                {category.label}
              </Tag>
            )
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        {activeAccount && (
          <PaymentTable
            context={{
              account: activeAccount,
              months,
              // selectedMonth,
              sortBy,
              filteredTransactions,
              filterBy
            }}
            isConcise={isConcise}
            loading={loading}
          />
        )}
        {activeAccount && (
          <DepositTable
            context={{
              account: activeAccount,
              months,
              // selectedMonth,
              sortBy,
              filteredTransactions,
              filterBy
            }}
            isConcise={isConcise}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Monthly;
