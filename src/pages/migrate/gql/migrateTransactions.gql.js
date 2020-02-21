import gql from 'graphql-tag';

export default gql`
  mutation MIGRATE_TRANSACTIONS($transactions: [MigrateTransactionInput!]!) {
    migrateTransactions(transactions: $transactions) {
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
