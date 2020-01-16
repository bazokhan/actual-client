import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt } from 'react-icons/fa';
import styles from '../Admin.module.scss';
import payeesGql from '../gql/payees.gql';
import deletePayeeGql from '../gql/deletePayee.gql';
import Toast from './Toast';

const Payees = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(payeesGql);
  const [deletePayeeMutation] = useMutation(deletePayeeGql, {
    refetchQueries: [{ query: payeesGql }],
    awaitRefetchQueries: true
  });

  const payees = useMemo(() => (data && data.payees ? data.payees : []));
  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <div className={styles.cardsContainer}>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {payees.map(payee => (
        <div className={styles.card} key={payee.id}>
          <div className={styles.cardAction}>
            <button
              type="button"
              className="btn btn-link"
              onClick={async () => {
                try {
                  await deletePayeeMutation({
                    variables: { id: payee.id }
                  });
                } catch (ex) {
                  setErrorMessage(ex.message);
                }
              }}
            >
              <FaTrashAlt />
            </button>
          </div>
          <div className={styles.cardTitle}>{payee.name}</div>
          <div className={styles.cardBody}>{payee.count} Transactions</div>
          <div className={styles.cardBody}>{n(payee.balance)} EGP</div>
        </div>
      ))}
    </div>
  );
};

export default Payees;