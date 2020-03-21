import gql from 'graphql-tag';

export default gql`
  query ACCOUNTS($includeDeleted: Boolean) {
    accounts(includeDeleted: $includeDeleted) {
      id
      name
    }
  }
`;
