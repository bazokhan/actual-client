import gql from 'graphql-tag';

export default gql`
  query ACCOUNTS_ADMIN {
    accounts {
      id
      name
      count
      balance
    }
  }
`;
