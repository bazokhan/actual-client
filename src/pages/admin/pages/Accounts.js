import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt, FaIdCard, FaTable } from 'react-icons/fa';
import Tag from 'ui/Tag';
import NumDiv from 'ui/NumDiv';
import ItemCard from 'ui/ItemCard';
import Table from 'ui/Table/Table';
import TableRow from 'ui/TableRow/TableRow';
import { colorizeString } from 'helpers/colorHelpers';
import {
  accountsGql,
  createAccountGql,
  deleteAccountGql
} from '../gql/accounts.gql';
import styles from '../Admin.module.scss';
import Toast from '../components/Toast';
import CreateForm from '../components/CreateForm';

const Row = ({ item, deleteAccountMutation, setErrorMessage }) => {
  const cells = [
    {
      name: 'name',
      size: 'lg',
      component: <Tag color={colorizeString(item.name)}>{item.name}</Tag>
    },
    {
      name: 'count',
      size: 'sm',
      component: <NumDiv num={item.count} title="transactions" />
    },
    {
      name: 'balace',
      size: 'sm',
      component: <NumDiv num={item.balance} title="EGP" />
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
              await deleteAccountMutation({
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
  return <TableRow cells={cells} />;
};

Row.propTypes = {
  item: PropTypes.object.isRequired,
  deleteAccountMutation: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired
};

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
  // if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <>
      <CreateForm
        gql={createAccountGql}
        fields={[
          { label: 'Account Name', name: 'name', type: 'text', required: true }
        ]}
        queries={[accountsGql]}
      />
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
        <Table
          title="Accounts"
          data={accounts}
          loading={loading}
          context={{ deleteAccountMutation, setErrorMessage }}
          header={() => <div />}
          row={Row}
          rowHeight={60}
        />
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
