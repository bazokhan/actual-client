import gql from 'graphql-tag';

export default gql`
  mutation DELETE_GROUP($id: ID!) {
    deleteGroup(id: $id) {
      id
      name
    }
  }
`;
