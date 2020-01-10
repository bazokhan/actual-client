import gql from 'graphql-tag';

export default gql`
  query CATEGORIES {
    categories {
      id
    }
  }
`;
