import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt } from 'react-icons/fa';
import accountsGql from '../gql/accounts.gql';
import styles from '../Admin.module.scss';
import deleteAccountGql from '../gql/deleteAccount.gql';
import Toast from './Toast';

const Accounts = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(accountsGql);
  const [deleteAccountMutation] = useMutation(deleteAccountGql, {
    refetchQueries: [{ query: accountsGql }],
    awaitRefetchQueries: true
  });

  const accounts = useMemo(() => (data && data.accounts ? data.accounts : []));
  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <div className={styles.cardsContainer}>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {accounts.map(account => (
        <div className={styles.card} key={account.id}>
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
          <div className={styles.cardBody}>{account.count} Transactions</div>
          <div className={styles.cardBody}>{n(account.balance)} EGP</div>
        </div>
      ))}
    </div>
  );
};

export default Accounts;
