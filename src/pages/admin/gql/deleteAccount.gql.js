import gql from 'graphql-tag';

export default gql`
  mutation DELETE_ACCOUNT($id: ID!) {
    deleteAccount(id: $id) {
      id
      name
    }
  }
`;
