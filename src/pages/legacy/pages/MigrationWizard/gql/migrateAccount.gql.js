import gql from 'graphql-tag';

export default gql`
  mutation MIGRATE_ACCOUNT($account: MigrateAccountInput!) {
    migrateAccount(account: $account) {
      id
      name
    }
  }
`;
