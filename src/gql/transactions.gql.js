import gql from 'graphql-tag';

export default gql`
  query TRANSACTIONS {
    transactions {
      id
    }
  }
`;
