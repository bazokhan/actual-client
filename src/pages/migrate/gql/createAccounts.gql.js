import gql from 'graphql-tag';

export default gql`
  mutation CREATE_ACCOUNTS($accounts: [CreateAccountInput!]!) {
    createAccounts(accounts: $accounts) {
      id
      name
    }
  }
`;
