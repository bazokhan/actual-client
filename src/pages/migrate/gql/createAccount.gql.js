import gql from 'graphql-tag';

export default gql`
  mutation CREATE_ACCOUNT($account: CreateAccountInput!) {
    createAccount(account: $account) {
      id
      name
    }
  }
`;
