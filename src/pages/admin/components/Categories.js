import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { n } from 'helpers/mathHelpers';
import { FaTrashAlt } from 'react-icons/fa';
import styles from '../Admin.module.scss';
import categoriesGql from '../gql/categories.gql';
import deleteCategoryGql from '../gql/deleteCategory.gql';
import Toast from './Toast';

const Categories = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(categoriesGql);
  const [deleteCategoryMutation] = useMutation(deleteCategoryGql, {
    refetchQueries: [{ query: categoriesGql }],
    awaitRefetchQueries: true
  });

  const categories = useMemo(() =>
    data && data.categories ? data.categories : []
  );
  if (error) return <div className={styles.loading}>Error!</div>;
  if (loading) return <div className={styles.loading}>Loading..</div>;
  return (
    <div className={styles.cardsContainer}>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {categories.map(cagtegory => (
        <div className={styles.card} key={cagtegory.id}>
          <div className={styles.cardAction}>
            <button
              type="button"
              className="btn btn-link"
              onClick={async () => {
                try {
                  await deleteCategoryMutation({
                    variables: { id: cagtegory.id }
                  });
                } catch (ex) {
                  setErrorMessage(ex.message);
                }
              }}
            >
              <FaTrashAlt />
            </button>
          </div>
          <div className={styles.cardTitle}>{cagtegory.name}</div>
          <div className={styles.cardBody}>{cagtegory.count} Transactions</div>
          <div className={styles.cardBody}>{n(cagtegory.balance)} EGP</div>
          <div className={styles.cardFooter}>Group: {cagtegory.group.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Categories;