import gql from 'graphql-tag';

export default gql`
  query GROUPS {
    catGroups {
      id
      name
      categories {
        id
        name
      }
      count
      balance
    }
  }
`;
