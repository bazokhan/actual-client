import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt, FaIdCard, FaTable } from 'react-icons/fa';
import styles from '../Admin.module.scss';
import deleteGroupGql from '../gql/deleteGroup.gql';
import groupsGql from '../gql/groups.gql';
import Toast from './Toast';

const Groups = () => {
  const [tableMode, setTableMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(groupsGql);
  const [deleteGroupMutation] = useMutation(deleteGroupGql, {
    refetchQueries: [{ query: groupsGql }],
    awaitRefetchQueries: true
  });

  const groups = useMemo(() => (data && data.catGroups ? data.catGroups : []));
  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <>
      <div className={styles.adminSubheader}>
        <h6>{tableMode ? 'Table view' : 'Card view'}</h6>
        <button
          type="button"
          onClick={() => setTableMode(!tableMode)}
          className="btn btn-link"
        >
          {tableMode ? <FaIdCard /> : <FaTable />}
        </button>
      </div>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {tableMode ? (
        <div className={styles.rowsContainer}>
          {groups.map(group => (
            <div className={styles.row} key={group.id}>
              <div className={styles.rowTitle}>{group.name}</div>
              <div className={styles.rowBody}>{group.count} Transactions</div>
              <div className={styles.rowBody}>
                {group.categories.length} Categories
              </div>
              <div className={styles.rowBody}>{n(group.balance)} EGP</div>
              <div className={styles.rowTail}>
                {group.categories.map(category => (
                  <div key={category.id}>{category.name}</div>
                ))}
              </div>
              <div className={styles.rowAction}>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={async () => {
                    try {
                      await deleteGroupMutation({
                        variables: { id: group.id }
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
          {groups.map(group => (
            <div className={styles.card} key={group.id}>
              <div className={styles.cardAction}>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={async () => {
                    try {
                      await deleteGroupMutation({
                        variables: { id: group.id }
                      });
                    } catch (ex) {
                      setErrorMessage(ex.message);
                    }
                  }}
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className={styles.cardTitle}>{group.name}</div>
              <div className={styles.cardBody}>{group.count} Transactions</div>
              <div className={styles.cardBody}>
                {group.categories.length} Categories
              </div>
              <div className={styles.cardBody}>{n(group.balance)} EGP</div>
              <div className={styles.cardFooter}>
                {group.categories.map(category => (
                  <div key={category.id}>{category.name}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Groups;
