import gql from 'graphql-tag';

export default gql`
  query CATEGORIES {
    categories {
      id
      name
      count
      balance
      group {
        id
        name
      }
    }
  }
`;
