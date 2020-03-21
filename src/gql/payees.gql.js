import gql from 'graphql-tag';

export default gql`
  query PAYEES($includeDeleted: Boolean) {
    payees(includeDeleted: $includeDeleted) {
      id
      name
    }
  }
`;
