/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt, FaIdCard, FaTable } from 'react-icons/fa';
import Select from 'react-select';
import styles from '../Admin.module.scss';
import categoriesGql from '../gql/categories.gql';
import deleteCategoryGql from '../gql/deleteCategory.gql';
import Toast from '../components/Toast';
import groupsGql from '../../reports/pages/chart/gql/groups.gql';
import updateCategoryGql from '../gql/updateCategory.gql';

const Categories = () => {
  const [editGroup, setEditGroup] = useState('');
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
        <div className={styles.rowsContainer}>
          {categories.map(category => (
            <div className={styles.row} key={category.id}>
              <div className={styles.rowTitle}>{category.name}</div>
              <div className={styles.rowBody}>
                {category.count} Transactions
              </div>
              <div className={styles.rowBody}>{n(category.balance)} EGP</div>
              {editGroup === category.id ? (
                <Select
                  onBlur={() => setEditGroup('')}
                  onChange={async option => {
                    try {
                      await updateCategoryMutation({
                        variables: {
                          id: category.id,
                          category: { groupId: option.value }
                        }
                      });
                    } catch (ex) {
                      console.log(ex);
                    }
                    setEditGroup('');
                  }}
                  options={groupsOptions}
                  value={groupsOptions.find(g => g.value === category.group.id)}
                />
              ) : (
                <div
                  className={styles.rowTail}
                  onClick={() => setEditGroup(category.id)}
                >
                  Group: {category.group.name}
                </div>
              )}
              <div className={styles.rowAction}>
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
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {categories.map(category => (
            <div className={styles.card} key={category.id}>
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
                Group: {category.group.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Categories;
