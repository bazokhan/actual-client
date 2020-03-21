import gql from 'graphql-tag';

const payeesGql = gql`
  query PAYEES {
    payees {
      id
      name
      count
      balance
    }
  }
`;

const createPayeeGql = gql`
  mutation CREATE_PAYEE($name: String!) {
    createPayee(payee: { name: $name }) {
      id
      name
      account {
        id
        name
      }
    }
  }
`;

const deletePayeeGql = gql`
  mutation DELETE_PAYEE($id: ID!) {
    deletePayee(id: $id) {
      id
      name
    }
  }
`;

export { payeesGql, createPayeeGql, deletePayeeGql };
