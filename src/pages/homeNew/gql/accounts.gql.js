import gql from 'graphql-tag';

export default gql`
  query ACCOUNTS {
    accounts {
      id
      name
      balance
    }
  }
`;
