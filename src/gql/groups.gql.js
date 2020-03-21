import gql from 'graphql-tag';

export default gql`
  query GROUPS($includeDeleted: Boolean) {
    groups(includeDeleted: $includeDeleted) {
      id
      name
    }
  }
`;
