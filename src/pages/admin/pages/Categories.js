/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt, FaIdCard, FaTable } from 'react-icons/fa';
import Tag from 'ui/Tag';
import NumDiv from 'ui/NumDiv';
import Table from 'ui/Table/Table';
import TableRow from 'ui/TableRow/TableRow';
import styles from '../Admin.module.scss';
import {
  categoriesGql,
  createCategoryGql,
  deleteCategoryGql,
  updateCategoryGql
} from '../gql/categories.gql';
import Toast from '../components/Toast';
import groupsGql from '../../reports/pages/chart/gql/groups.gql';
import ItemCard from '../../../ui/ItemCard';
import CreateForm from '../components/CreateForm';
import SelectableDiv from '../../../ui/SelectableDiv/SelectableDiv';

const Row = ({
  item,
  deleteCategoryMutation,
  setErrorMessage,
  updateCategoryMutation,
  groupsOptions,
  style
}) => {
  const cells = [
    {
      name: 'name',
      size: 'lg',
      component: (
        <Tag
          color={
            item.group?.isIncome
              ? '#0C8810'
              : item.group?.name === 'نفقات'
              ? '#CD4A50'
              : '#394960'
          }
        >
          {item.name}
        </Tag>
      )
    },
    {
      name: 'count',
      size: 'sm',
      component: (
        <NumDiv
          num={item.count}
          style={{ textAlign: 'right', width: '100%' }}
          title="transactions"
        />
      )
    },
    {
      name: 'balace',
      size: 'sm',
      component: (
        <NumDiv
          num={n(item.balance)}
          style={{
            textAlign: 'right',
            width: '100%',
            fontWeight: 100,
            color: item.group?.isIncome
              ? '#0C8810'
              : item.group?.name === 'نفقات'
              ? '#CD4A50'
              : '#394960'
          }}
          title="EGP"
        />
      )
    },
    {
      name: 'group',
      size: 'lg',
      component: (
        <SelectableDiv
          defaultValue={groupsOptions.find(g => g.value === item.group.id)}
          onChange={async option => {
            try {
              await updateCategoryMutation({
                variables: {
                  id: item.id,
                  category: { groupId: option.value }
                }
              });
            } catch (ex) {
              console.log(ex);
            }
          }}
          options={groupsOptions}
        >
          <div
            className={styles.rowTail}
            style={{
              color: item.group?.isIncome
                ? '#0C8810'
                : item.group?.name === 'نفقات'
                ? '#CD4A50'
                : '#394960'
            }}
          >
            Group: {item.group.name}
          </div>
        </SelectableDiv>
      )
    },
    {
      name: 'deleteButton',
      size: 'xs',
      component: (
        <button
          type="button"
          className={styles.actionButton}
          onClick={async () => {
            try {
              await deleteCategoryMutation({
                variables: { id: item.id }
              });
            } catch (ex) {
              setErrorMessage(ex.message);
            }
          }}
        >
          <FaTrashAlt />
        </button>
      )
    }
  ];
  return <TableRow style={style} cells={cells} />;
};

Row.propTypes = {
  item: PropTypes.object.isRequired,
  deleteCategoryMutation: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  updateCategoryMutation: PropTypes.func.isRequired,
  groupsOptions: PropTypes.array.isRequired,
  style: PropTypes.object
};

Row.defaultProps = {
  style: {}
};

const Categories = () => {
  const [viewMode, setViewMode] = useState(
    localStorage.getItem('view_mode') || 'cards'
  );
  const tableMode = useMemo(() => viewMode === 'table', [viewMode]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(categoriesGql, {
    fetchPolicy: 'cache-and-network'
  });
  const [deleteCategoryMutation] = useMutation(deleteCategoryGql, {
    refetchQueries: [{ query: categoriesGql }],
    awaitRefetchQueries: true
  });

  const { data: groupsData } = useQuery(groupsGql, {
    fetchPolicy: 'cache-and-network'
  });

  const categories = useMemo(
    () => (data && data.categories ? data.categories : []),
    [data]
  );

  const groups = useMemo(
    () => (groupsData && groupsData.groups ? groupsData.groups : []),
    [groupsData]
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

  const [updateCategoryMutation] = useMutation(updateCategoryGql, {
    refetchQueries: [{ query: categoriesGql }],
    awaitRefetchQueries: true
  });

  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <>
      <CreateForm
        gql={createCategoryGql}
        fields={[
          {
            label: 'Category Name',
            name: 'name',
            type: 'text',
            required: true
          },
          {
            label: 'Category Group',
            name: 'groupId',
            type: 'select',
            required: true,
            options: groups.map(group => ({
              label: group.name,
              value: group.id
            }))
          }
        ]}
        queries={[categoriesGql]}
      />
      <div className={styles.adminSubheader}>
        <h6>Categories - {tableMode ? 'Table view' : 'Card view'}</h6>
        <button
          type="button"
          onClick={() => {
            const targetMode = tableMode ? 'cards' : 'table';
            setViewMode(targetMode);
            localStorage.setItem('view_mode', targetMode);
          }}
          className="btn btn-action btn-sm btn-primary"
        >
          {tableMode ? <FaIdCard /> : <FaTable />}
        </button>
      </div>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {tableMode ? (
        <Table
          title="Categories"
          data={categories}
          loading={loading}
          context={{
            deleteCategoryMutation,
            updateCategoryMutation,
            setErrorMessage,
            groupsOptions
          }}
          header={() => <div />}
          row={Row}
          rowHeight={60}
        />
      ) : (
        <div className={styles.cardsContainer}>
          {categories.map(category => (
            <ItemCard
              key={category.id}
              title={category.name}
              style={{ margin: '15px' }}
            >
              <div className={styles.cardAction}>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={async () => {
                    try {
                      await deleteCategoryMutation({
                        variables: { id: category.id }
                      });
                    } catch (ex) {
                      setErrorMessage(ex.message);
                    }
                  }}
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className={styles.cardTitle}>{category.name}</div>
              <div className={styles.cardBody}>
                {category.count} Transactions
              </div>
              <div className={styles.cardBody}>{n(category.balance)} EGP</div>
              <div className={styles.cardFooter}>
                Group: {category.group?.name}
              </div>
            </ItemCard>
          ))}
        </div>
      )}
    </>
  );
};

export default Categories;
