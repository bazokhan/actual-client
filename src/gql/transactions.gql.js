import gql from 'graphql-tag';

export default gql`
  query TRANSACTIONS($includeDeleted: Boolean) {
    transactions(includeDeleted: $includeDeleted) {
      id
    }
  }
`;
