import gql from 'graphql-tag';

export default gql`
  mutation MIGRATE_PAYEE($payee: MigratePayeeInput!) {
    migratePayee(payee: $payee) {
      id
      name
      account {
        id
        name
      }
    }
  }
`;
