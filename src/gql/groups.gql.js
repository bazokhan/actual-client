import gql from 'graphql-tag';

export default gql`
  query GROUPS {
    groups {
      id
      name
    }
  }
`;
