import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt, FaIdCard, FaTable } from 'react-icons/fa';
import styles from '../Admin.module.scss';
import { payeesGql, deletePayeeGql, createPayeeGql } from '../gql/payees.gql';
import Toast from '../components/Toast';
import ItemCard from '../../../ui/ItemCard';
import CreateForm from '../components/CreateForm';

const Payees = () => {
  const [viewMode, setViewMode] = useState(
    localStorage.getItem('view_mode') || 'cards'
  );
  const tableMode = useMemo(() => viewMode === 'table', [viewMode]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(payeesGql, {
    fetchPolicy: 'cache-and-network'
  });
  const [deletePayeeMutation] = useMutation(deletePayeeGql, {
    refetchQueries: [{ query: payeesGql }],
    awaitRefetchQueries: true
  });

  const payees = useMemo(() => (data && data.payees ? data.payees : []), [
    data
  ]);
  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <>
      <CreateForm
        gql={createPayeeGql}
        fields={[
          { label: 'Payee Name', name: 'name', type: 'text', required: true }
        ]}
        queries={[payeesGql]}
      />
      <div className={styles.adminSubheader}>
        <h6>Payees - {tableMode ? 'Table view' : 'Card view'}</h6>
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
          {payees.map(payee => (
            <div className={styles.row} key={payee.id}>
              <div className={styles.rowTitle}>{payee.name}</div>
              <div className={styles.rowBody}>{payee.count} Transactions</div>
              <div className={styles.rowBody}>{n(payee.balance)} EGP</div>
              <div className={styles.rowTail} />
              <div className={styles.rowAction}>
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
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {payees.map(payee => (
            <ItemCard
              key={payee.id}
              title={payee.name}
              style={{ margin: '15px' }}
            >
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
            </ItemCard>
          ))}
        </div>
      )}
    </>
  );
};

export default Payees;
