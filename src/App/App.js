import React from 'react';
import PropTypes from 'prop-types';
import useInitialLoad from '../hooks/useInitialLoad';
import styles from './App.module.scss';
import './styles/Main.scss';

const Transaction = ({
  transaction: { id, acct, amount, category, description, date, notes },
  accounts,
  categories,
  categoryGroups,
  categoryMapping,
  payees,
  payeeMapping
}) => {
  const activeAccount = accounts.find(account => account.id === acct) || {};
  const activeCategory = categories.find(cat => cat.id === category) || {};
  const catGroup =
    categoryGroups.find(group => group.id === activeCategory.cat_group) || {};
  const activeDate = `${date.toString().slice(0, 4)}/${date
    .toString()
    .slice(4, 6)}/${date.toString().slice(6, 8)}`;

  return (
    <div key={id} className={styles.row}>
      <div className={styles.midCell}>{activeDate}</div>
      <div className={styles.midCell}>{activeAccount.name}</div>
      <div className={styles.midCell}>???</div>
      <div className={styles.bigCell}>{notes}</div>
      <div className={styles.midCell}>{activeCategory.name}</div>
      <div className={styles.midCell}>{catGroup.name}</div>
      <div className={styles.midCell}>
        {amount < 0 ? (amount * -1).toString() : null}
      </div>
      <div className={styles.midCell}>
        {amount >= 0 ? amount.toString() : null}
      </div>
      <div className={styles.bigCell}>{description}</div>
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  categoryGroups: PropTypes.array.isRequired,
  categoryMapping: PropTypes.array.isRequired,
  payees: PropTypes.array.isRequired,
  payeeMapping: PropTypes.array.isRequired
};

const App = () => {
  const {
    loading,
    accounts,
    categories,
    categoryGroups,
    categoryMapping,
    payees,
    payeeMapping,
    transactions
  } = useInitialLoad();

  if (loading) return <div>Loading..</div>;

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.midCell}>Date</div>
        <div className={styles.midCell}>Account</div>
        <div className={styles.midCell}>Payee</div>
        <div className={styles.bigCell}>Notes</div>
        <div className={styles.midCell}>Category</div>
        <div className={styles.midCell}>Type</div>
        <div className={styles.midCell}>Payment</div>
        <div className={styles.midCell}>Deposit</div>
        <div className={styles.bigCell}>Description</div>
      </div>
      {transactions.map(transaction => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
          accounts={accounts}
          categories={categories}
          categoryGroups={categoryGroups}
          categoryMapping={categoryMapping}
          payees={payees}
          payeeMapping={payeeMapping}
        />
      ))}
    </div>
  );
};

export default App;
