import gql from 'graphql-tag';

export default gql`
  mutation DELETE_PAYEE($id: ID!) {
    deletePayee(id: $id) {
      id
      name
    }
  }
`;
