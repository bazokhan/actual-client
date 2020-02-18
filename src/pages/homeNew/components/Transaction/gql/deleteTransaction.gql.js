import gql from 'graphql-tag';

export default gql`
  mutation DELETE_TRANSACTION($id: ID!) {
    deleteTransaction(id: $id) {
      id
      notes
      amount
      account {
        id
        name
      }
      payee {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;
