import gql from 'graphql-tag';

export default gql`
  mutation CREATE_TRANSACTION($transaction: CreateTransactionInput) {
    createTransaction(transaction: $transaction) {
      id
      notes
      amount
    }
  }
`;
