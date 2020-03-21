import gql from 'graphql-tag';

export default gql`
  query CATEGORIES($includeDeleted: Boolean) {
    categories(includeDeleted: $includeDeleted) {
      id
      name
    }
  }
`;
