import gql from 'graphql-tag';

const accountsGql = gql`
  query ACCOUNTS_ADMIN {
    accounts {
      id
      name
      count
      balance
    }
  }
`;

const createAccountGql = gql`
  mutation CREATE_ACCOUNT($name: String!) {
    createAccount(account: { name: $name }) {
      id
      name
    }
  }
`;

const deleteAccountGql = gql`
  mutation DELETE_ACCOUNT($id: ID!) {
    deleteAccount(id: $id) {
      id
      name
    }
  }
`;

export { accountsGql, createAccountGql, deleteAccountGql };
