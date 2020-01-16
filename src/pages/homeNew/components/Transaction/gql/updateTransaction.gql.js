import gql from 'graphql-tag';

export default gql`
  mutation UPDATE_TRANSACTION($id: ID!, $transaction: UpdateTransactionInput) {
    updateTransaction(id: $id, transaction: $transaction) {
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
