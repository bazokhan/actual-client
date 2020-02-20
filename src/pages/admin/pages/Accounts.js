import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt, FaIdCard, FaTable } from 'react-icons/fa';
import accountsGql from '../gql/accounts.gql';
import styles from '../Admin.module.scss';
import deleteAccountGql from '../gql/deleteAccount.gql';
import Toast from '../components/Toast';
import ItemCard from '../../../ui/ItemCard';

const Accounts = () => {
  const [viewMode, setViewMode] = useState(
    localStorage.getItem('view_mode') || 'cards'
  );
  const tableMode = useMemo(() => viewMode === 'table', [viewMode]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(accountsGql, {
    fetchPolicy: 'cache-and-network'
  });
  const [deleteAccountMutation] = useMutation(deleteAccountGql, {
    refetchQueries: [{ query: accountsGql }],
    awaitRefetchQueries: true
  });

  const accounts = useMemo(() => (data && data.accounts ? data.accounts : []), [
    data
  ]);
  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <>
      <div className={styles.adminSubheader}>
        <h6>Accounts - {tableMode ? 'Table view' : 'Card view'}</h6>
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
          {accounts.map(account => (
            <div className={styles.row} key={account.id}>
              <div className={styles.rowTitle}>{account.name}</div>
              <div className={styles.rowBody}>{account.count} Transactions</div>
              <div className={styles.rowBody}>{n(account.balance)} EGP</div>
              <div className={styles.rowTail} />
              <div className={styles.rowAction}>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={async () => {
                    try {
                      await deleteAccountMutation({
                        variables: { id: account.id }
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
          {accounts.map(account => (
            <ItemCard
              key={account.id}
              title={account.name}
              style={{ margin: '15px' }}
            >
              <div className={styles.cardAction}>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={async () => {
                    try {
                      await deleteAccountMutation({
                        variables: { id: account.id }
                      });
                    } catch (ex) {
                      setErrorMessage(ex.message);
                    }
                  }}
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className={styles.cardTitle}>{account.name}</div>
              <div className={styles.cardBody}>
                {account.count} Transactions
              </div>
              <div className={styles.cardBody}>{n(account.balance)} EGP</div>
            </ItemCard>
          ))}
        </div>
      )}
    </>
  );
};

export default Accounts;
