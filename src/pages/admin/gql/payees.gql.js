import gql from 'graphql-tag';

export default gql`
  query PAYEES {
    payees {
      id
      name
      count
      balance
    }
  }
`;
