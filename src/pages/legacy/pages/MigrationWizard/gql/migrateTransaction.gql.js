import gql from 'graphql-tag';

export default gql`
  mutation MIGRATE_TRANSACTION($transaction: MigrateTransactionInput!) {
    migrateTransaction(transaction: $transaction) {
      id
      amount
      account {
        id
        name
      }
      category {
        id
        name
      }
      payee {
        id
        name
      }
    }
  }
`;
